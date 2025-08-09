import { useEffect, useState } from "react";
import { FiPlus, FiUpload, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCategory } from "../../actions/categoryAction";
import { clearErrors, createPackage } from "../../actions/packageAction";
import MetaData from "../../component/layout/MetaData";
import { NEW_PACKAGE_RESET } from "../../constants/packageConstants";
import Sidebar from "./Sidebar";

const NewPackage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.newPackage);
  const { categories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    oldPrice: "",
    discountPrice: "",
    deliveryTime: "",
    deliverToCountries: "",
    videoLink: "",
    books: {
      book1: {
        name: "",
        writer: "",
        language: "",
        publisher: "",
        publishDate: "",
        isbn10: "",
        isbn13: "",
        category: "",
        demoPdf: null,
      },
      book2: {
        name: "",
        writer: "",
        language: "",
        publisher: "",
        publishDate: "",
        isbn10: "",
        isbn13: "",
        category: "",
        demoPdf: null,
      },
      book3: {
        name: "",
        writer: "",
        language: "",
        publisher: "",
        publishDate: "",
        isbn10: "",
        isbn13: "",
        category: "",
        demoPdf: null,
      },
    },
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [activeBookTab, setActiveBookTab] = useState(1);

  useEffect(() => {
    dispatch(getCategory());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Package created successfully");
      dispatch({ type: NEW_PACKAGE_RESET });
      navigate("/admin/packages");
    }
  }, [dispatch, error, success, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBookInputChange = (e, bookNumber) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      books: {
        ...formData.books,
        [`book${bookNumber}`]: {
          ...formData.books[`book${bookNumber}`],
          [name]: value,
        },
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    // Package data
    data.set("name", formData.name);
    data.set("description", formData.description);
    data.set("oldPrice", formData.oldPrice);
    data.set("discountPrice", formData.discountPrice);
    data.set("deliveryTime", formData.deliveryTime);
    data.set("deliverToCountries", formData.deliverToCountries);
    if (formData.videoLink) data.set("videoLink", formData.videoLink);

    // Books data
    for (let i = 1; i <= 3; i++) {
      const book = formData.books[`book${i}`];
      data.set(`books[book${i}][name]`, book.name);
      data.set(`books[book${i}][writer]`, book.writer);
      data.set(`books[book${i}][language]`, book.language);
      data.set(`books[book${i}][publisher]`, book.publisher || "");
      data.set(`books[book${i}][publishDate]`, book.publishDate || "");
      data.set(`books[book${i}][isbn10]`, book.isbn10 || "");
      data.set(`books[book${i}][isbn13]`, book.isbn13 || "");
      data.set(`books[book${i}][category]`, book.category);

      // Check both demoPdfFile and demoPdf (for existing files)
      if (book.demoPdfFile) {
        data.append(`books[book${i}][demoPdf]`, book.demoPdfFile);
      } else if (
        typeof book.demoPdf === "string" &&
        book.demoPdf.includes("http")
      ) {
        // If it's an existing URL, send it as a string
        data.set(`books[book${i}][demoPdf]`, book.demoPdf);
      }
    }

    // Images
    if (image) data.append("image", image);
    images.forEach((img) => {
      data.append("images", img);
    });

    // Use updatePackage instead of createPackage
    dispatch(createPackage(data));
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

  const handleBookFileChange = (e, bookNumber) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({
      ...formData,
      books: {
        ...formData.books,
        [`book${bookNumber}`]: {
          ...formData.books[`book${bookNumber}`],
          demoPdf: URL.createObjectURL(file),
          demoPdfFile: file,
          // Clear any existing PDF URL if a new file is uploaded
          ...(formData.books[`book${bookNumber}`].demoPdf &&
          typeof formData.books[`book${bookNumber}`].demoPdf === "string"
            ? { demoPdf: null }
            : {}),
        },
      },
    });
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

  const removeBookFile = (bookNumber) => {
    setFormData({
      ...formData,
      books: {
        ...formData.books,
        [`book${bookNumber}`]: {
          ...formData.books[`book${bookNumber}`],
          demoPdf: null,
          demoPdfFile: null,
        },
      },
    });
  };

  const removeImage = (index) => {
    const newImagesPreview = [...imagesPreview];
    newImagesPreview.splice(index, 1);
    setImagesPreview(newImagesPreview);

    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const renderBookTab = (bookNumber) => {
    const book = formData.books[`book${bookNumber}`];

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter book name"
              required
              value={book.name}
              onChange={(e) => handleBookInputChange(e, bookNumber)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              value={book.writer}
              onChange={(e) => handleBookInputChange(e, bookNumber)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              required
              value={book.category}
              onChange={(e) => handleBookInputChange(e, bookNumber)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              Language <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="language"
              placeholder="Enter language"
              required
              value={book.language}
              onChange={(e) => handleBookInputChange(e, bookNumber)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              value={book.publisher}
              onChange={(e) => handleBookInputChange(e, bookNumber)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publish Date
            </label>
            <input
              type="date"
              name="publishDate"
              value={book.publishDate}
              onChange={(e) => handleBookInputChange(e, bookNumber)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              value={book.isbn10}
              onChange={(e) => handleBookInputChange(e, bookNumber)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              value={book.isbn13}
              onChange={(e) => handleBookInputChange(e, bookNumber)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Demo PDF
          </label>
          <div className="flex items-center gap-4">
            <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
              <FiUpload className="text-gray-400 mb-2" size={24} />
              <span className="text-sm text-gray-500 text-center">
                {book.demoPdf ? "Change PDF" : "Upload Demo PDF"}
              </span>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleBookFileChange(e, bookNumber)}
                className="hidden"
              />
            </label>
            {book.demoPdf && (
              <div className="relative">
                <div className="w-24 h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
                  <span className="text-xs text-gray-500">PDF Preview</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeBookFile(bookNumber)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FiX size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Create New Package" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Create New Package
            </h1>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter package name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Enter package description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                ></textarea>
              </div>
              {/* Book tabs */}
              <div>
                <div className="border-b border-gray-200 mb-4">
                  <nav className="-mb-px flex space-x-8">
                    {[1, 2, 3].map((tab) => (
                      <button
                        key={tab}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveBookTab(tab);
                        }}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                          activeBookTab === tab
                            ? "border-indigo-500 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Book {tab}
                      </button>
                    ))}
                  </nav>
                </div>
                {renderBookTab(activeBookTab)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Image <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
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
                          onClick={() => removeFile(setImage, setImagePreview)}
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
                    <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 cursor-pointer rounded-lg text-white font-semibold flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <FiPlus size={18} /> Create Package
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPackage;
