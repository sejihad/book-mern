// components/admin/BookManager.jsx
import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiUpload, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearErrors,
  createBook,
  deleteBook,
  getAdminBook,
  updateBook,
} from "../../actions/bookAction";
import { getCategory } from "../../actions/categoryAction";
import MetaData from "../../component/layout/MetaData";
import {
  DELETE_BOOK_RESET,
  NEW_BOOK_RESET,
  UPDATE_BOOK_RESET,
} from "../../constants/bookConstants";
import Sidebar from "./Sidebar";

const AllBooks = () => {
  const dispatch = useDispatch();

  const { books } = useSelector((state) => state.books);
  const { loading, error, success } = useSelector((state) => state.newBook);
  const { categories } = useSelector((state) => state.categories);
  const {
    error: updateDeleteError,
    isDeleted,
    isUpdated,
  } = useSelector((state) => state.book);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    writer: "",
    type: "book",
    oldPrice: "",
    discountPrice: "",
    language: "",
    publisher: "",
    publishDate: "",
    deliveryTime: "",
    deliverToCountries: "",
    isbn10: "",
    isbn13: "",
    category: "",

    videoLink: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [demoPdf, setDemoPdf] = useState(null);
  const [fullPdf, setFullPdf] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    dispatch(getAdminBook());
    dispatch(getCategory());
    if (error || updateDeleteError) {
      toast.error(error || updateDeleteError);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Book created successfully");
      dispatch({ type: NEW_BOOK_RESET });
      resetForm();
      setIsFormOpen(false);
    }

    if (isDeleted) {
      toast.success("Book deleted");
      dispatch({ type: DELETE_BOOK_RESET });
      dispatch(getAdminBook());
    }

    if (isUpdated) {
      toast.success("Book updated");
      dispatch({ type: UPDATE_BOOK_RESET });
      dispatch(getAdminBook());
      resetForm();
    }
  }, [dispatch, error, success, isDeleted, isUpdated, updateDeleteError]);

  const resetForm = () => {
    setEditId(null);
    setFormData({
      name: "",
      description: "",
      writer: "",
      type: "book",
      oldPrice: "",
      discountPrice: "",
      language: "",
      publisher: "",
      publishDate: "",
      deliveryTime: "",
      deliverToCountries: "",
      isbn10: "",
      isbn13: "",
      category: "",

      videoLink: "",
    });
    setImage(null);
    setImagePreview(null);
    setImages([]);
    setImagesPreview([]);
    setDemoPdf(null);
    setFullPdf(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    data.set("name", formData.name);
    data.set("description", formData.description);
    data.set("writer", formData.writer);
    data.set("type", formData.type);
    data.set("oldPrice", formData.oldPrice);
    data.set("discountPrice", formData.discountPrice);
    data.set("language", formData.language);
    data.set("publisher", formData.publisher);
    data.set("publishDate", formData.publishDate);
    data.set("deliveryTime", formData.deliveryTime);
    data.set("deliverToCountries", formData.deliverToCountries);
    data.set("isbn10", formData.isbn10);
    data.set("isbn13", formData.isbn13);
    data.set("category", formData.category);

    if (formData.videoLink) data.set("videoLink", formData.videoLink);
    if (image) data.append("image", image);

    images.forEach((img) => {
      data.append("images", img);
    });

    if (demoPdf) data.append("demoPdf", demoPdf);
    if (fullPdf) data.append("fullPdf", fullPdf);

    if (editId) {
      dispatch(updateBook(editId, data));
    } else {
      dispatch(createBook(data));
    }
  };

  const handleEdit = (book) => {
    setEditId(book._id);
    setFormData({
      name: book.name,
      description: book.description,
      writer: book.writer,
      type: book.type,
      oldPrice: book.oldPrice,
      discountPrice: book.discountPrice,
      language: book.language || "",
      publisher: book.publisher || "",
      publishDate: book.publishDate || "",
      deliveryTime: book.deliveryTime || "",
      deliverToCountries: book.deliverToCountries || "",
      isbn10: book.isbn10 || "",
      isbn13: book.isbn13 || "",
      category: book.category,

      videoLink: book.videoLink || "",
    });
    if (book.image) setImagePreview(book.image.url);
    if (book.images) setImagesPreview(book.images.map((img) => img.url));
    if (book.demoPdf) setDemoPdf(book.demoPdf.url);
    if (book.fullPdf) setFullPdf(book.fullPdf.url);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      dispatch(deleteBook(id));
    }
  };

  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPreview(reader.result);
        setFile(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, file]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (setFile, setPreview) => {
    setFile(null);
    setPreview(null);
  };

  const removeImage = (index) => {
    const newImagesPreview = [...imagesPreview];
    newImagesPreview.splice(index, 1);
    setImagesPreview(newImagesPreview);

    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Manage Books" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Book Manager</h1>
            <button
              onClick={() => {
                resetForm();
                setIsFormOpen(!isFormOpen);
              }}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              {isFormOpen ? (
                <>
                  <FiX size={18} /> Close
                </>
              ) : (
                <>
                  <FiPlus size={18} /> Add Book
                </>
              )}
            </button>
          </div>

          {isFormOpen && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editId ? "Edit Book" : "Create New Book"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Book Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter book name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Writer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="writer"
                      placeholder="Enter writer name"
                      required
                      value={formData.writer}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Book Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="book">Book</option>
                      <option value="ebook">E-Book</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Original Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="oldPrice"
                      placeholder="Enter original price"
                      required
                      value={formData.oldPrice}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="discountPrice"
                      placeholder="Enter discount price"
                      required
                      value={formData.discountPrice}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="language"
                      placeholder="Enter language"
                      required
                      value={formData.language}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Publisher
                    </label>
                    <input
                      type="text"
                      name="publisher"
                      placeholder="Enter publisher name"
                      value={formData.publisher}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      name="publishDate"
                      value={formData.publishDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Time
                    </label>
                    <input
                      type="text"
                      name="deliveryTime"
                      placeholder="e.g. 3-5 days"
                      value={formData.deliveryTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deliver To Countries
                    </label>
                    <input
                      type="text"
                      name="deliverToCountries"
                      placeholder="Country Name.."
                      value={formData.deliverToCountries}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ISBN-10
                    </label>
                    <input
                      type="text"
                      name="isbn10"
                      placeholder="Enter ISBN-10"
                      value={formData.isbn10}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ISBN-13
                    </label>
                    <input
                      type="text"
                      name="isbn13"
                      placeholder="Enter ISBN-13"
                      value={formData.isbn13}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video Link (Optional)
                    </label>
                    <input
                      type="text"
                      name="videoLink"
                      placeholder="Enter YouTube video link"
                      value={formData.videoLink}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    placeholder="Enter book description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Book Image <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                        <FiUpload className="text-gray-400 mb-2" size={24} />
                        <span className="text-sm text-gray-500 text-center">
                          {imagePreview ? "Change Image" : "Upload Image"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange(e, setImage, setImagePreview)
                          }
                          className="hidden"
                          required={!imagePreview}
                        />
                      </label>
                      {imagePreview && (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-24 h-24 rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeFile(setImage, setImagePreview)
                            }
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Images (Max 4)
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                        <FiUpload className="text-gray-400 mb-2" size={24} />
                        <span className="text-sm text-gray-500 text-center">
                          {imagesPreview.length ? "Add More" : "Upload Images"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImagesChange}
                          className="hidden"
                          disabled={imagesPreview.length >= 4}
                        />
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {imagesPreview.map((img, index) => (
                          <div key={index} className="relative">
                            <img
                              src={img}
                              alt={`Preview ${index}`}
                              className="w-16 h-16 rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <FiX size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Demo PDF
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                        <FiUpload className="text-gray-400 mb-2" size={24} />
                        <span className="text-sm text-gray-500 text-center">
                          {demoPdf ? "Change PDF" : "Upload Demo PDF"}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) =>
                            handleFileChange(e, setDemoPdf, setDemoPdf)
                          }
                          className="hidden"
                        />
                      </label>
                      {demoPdf && (
                        <div className="relative">
                          <div className="w-24 h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              PDF Preview
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(setDemoPdf, setDemoPdf)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {formData.type === "ebook" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full PDF
                      </label>
                      <div className="flex items-center gap-4">
                        <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                          <FiUpload className="text-gray-400 mb-2" size={24} />
                          <span className="text-sm text-gray-500 text-center">
                            {fullPdf ? "Change PDF" : "Upload Full PDF"}
                          </span>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) =>
                              handleFileChange(e, setFullPdf, setFullPdf)
                            }
                            className="hidden"
                          />
                        </label>
                        {fullPdf && (
                          <div className="relative">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
                              <span className="text-xs text-gray-500">
                                PDF Preview
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(setFullPdf, setFullPdf)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 cursor-pointer rounded-lg text-white font-semibold flex items-center justify-center gap-2 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loading ? (
                    "Processing..."
                  ) : editId ? (
                    <>
                      <FiEdit2 size={18} /> Update Book
                    </>
                  ) : (
                    <>
                      <FiPlus size={18} /> Create Book
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">All Books</h2>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {books?.length || 0} books
              </span>
            </div>

            {books?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No books found. Create one to get started!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Writer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {books?.map((book) => (
                      <tr key={book._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex-shrink-0 h-10 w-10">
                            {book.image ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={book.image.url}
                                alt={book.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-500">
                                  No Image
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {book.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {book.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {book.writer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 line-through">
                            ${book.oldPrice}
                          </div>
                          <div className="text-sm font-bold text-green-600">
                            ${book.discountPrice}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              book.type === "ebook"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {book.type === "ebook" ? "E-Book" : "Book"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(book)}
                            className="text-green-600 cursor-pointer hover:text-green-900 mr-4"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(book._id)}
                            className="text-red-600 cursor-pointer hover:text-red-900"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBooks;
