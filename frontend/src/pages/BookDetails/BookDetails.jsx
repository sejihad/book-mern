import { useEffect, useState } from "react";
import {
  FaMinus,
  FaPlus,
  FaRegStar,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getBook, getBookDetails } from "../../actions/bookAction";
import { addToCart } from "../../actions/cartAction";
import BookSection from "../../component/BookSection";
import Loader from "../../component/layout/Loader/Loader";

const StarRating = ({ rating, interactive = false, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || rating;

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          className={`text-xl ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => handleClick(value)}
          onMouseEnter={() => handleMouseEnter(value)}
          onMouseLeave={handleMouseLeave}
        >
          {value <= displayRating ? (
            <FaStar className="text-yellow-400" />
          ) : (
            <FaRegStar className="text-yellow-400" />
          )}
        </span>
      ))}
    </div>
  );
};

const BookDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { loading, book } = useSelector((state) => state.bookDetails);
  const { books, loadingBooks = loading } = useSelector((state) => state.books);

  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [showPdf, setShowPdf] = useState(false);
  useEffect(() => {
    dispatch(getBookDetails(slug));
    dispatch(getBook());
  }, [dispatch, slug]);

  const addToCartHandler = () => {
    dispatch(addToCart(id, quantity));
  };
  const handleBuyNow = (book) => {
    navigate("/checkout", {
      state: {
        bookId: book._id,
        quantity: 1,
      },
    });
  };
  const incrementQuantity = () => {
    if (quantity < book.Stock) setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const relatedBooks = books
    .filter(
      (b) =>
        b.type === book?.type &&
        b.category?.toLowerCase() === book?.category?.toLowerCase()
    )
    .slice(0, 5);

  return loading || !book ? (
    <Loader />
  ) : (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Main Book Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Book Cover */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200">
          <div className="p-8 flex justify-center">
            <img
              src={book.image?.url}
              alt={book.name}
              className="w-full h-auto max-h-[500px] object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Book Details */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {book.name}
            </h1>
            <p className="text-xl text-gray-600 mb-4">By {book.writer}</p>

            <div className="flex items-center mb-4">
              <StarRating rating={book.ratings || 0} />
              <span className="ml-2 text-gray-600">
                ({book.numOfReviews || 0} reviews)
              </span>
            </div>

            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-green-600">
                ${book.discountPrice}
              </span>
              {book.oldPrice > book.discountPrice && (
                <span className="text-lg text-gray-400 line-through ml-3">
                  ${book.oldPrice}
                </span>
              )}
              {book.oldPrice > book.discountPrice && (
                <span className="ml-3 bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
                  Save ${book.oldPrice - book.discountPrice}
                </span>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {book.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <span className="block text-gray-600 mb-1">Category:</span>
                <span className="font-medium">{book.category}</span>
              </div>
              <div>
                <span className="block text-gray-600 mb-1">Type:</span>
                <span className="font-medium capitalize">{book.type}</span>
              </div>
              {book.type === "book" && (
                <div>
                  <span className="block text-gray-600 mb-1">
                    Availability:
                  </span>
                  <span
                    className={
                      book.Stock > 0
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {book.Stock > 0 ? `${book.Stock} in stock` : "Out of stock"}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity & Add to Cart */}

            <div className="mb-8">
              {book.type === "book" ? (
                <>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-gray-700">Quantity:</span>
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <button
                        onClick={decrementQuantity}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                        disabled={quantity <= 1}
                      >
                        <FaMinus className="text-gray-600" />
                      </button>
                      <span className="px-4 py-2 bg-white w-12 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                        disabled={quantity >= book.Stock}
                      >
                        <FaPlus className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={addToCartHandler}
                    disabled={book.Stock === 0}
                    className={`w-full flex items-center justify-center py-3 px-6 rounded-md font-medium text-white transition ${
                      book.Stock === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    <FaShoppingCart className="mr-2" />
                    Add to Cart
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleBuyNow(book)}
                  className="mt-2 w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-2 hover:from-red-600 hover:to-orange-600 transition-all duration-300 cursor-pointer"
                >
                  Buy Now
                </button>
              )}
            </div>

            {/* Demo PDF */}
            {book.demoPdf && (
              <div className="mb-4">
                <button
                  onClick={() => setShowPdf(true)}
                  className="inline-block bg-blue-100 text-blue-600 hover:bg-blue-200 px-4 py-2 rounded-md transition"
                >
                  Read Sample PDF
                </button>
              </div>
            )}

            {/* PDF Modal */}
            {showPdf && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full h-[90vh] max-w-6xl relative flex flex-col">
                  {/* Close button */}
                  <button
                    onClick={() => setShowPdf(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-3xl font-bold z-50"
                  >
                    &times;
                  </button>

                  {/* Modal Header */}
                  <div className="p-4 border-b">
                    <h2 className="text-2xl font-semibold text-center text-gray-800">
                      📘 Sample Book Preview
                    </h2>
                  </div>

                  {/* PDF Container */}
                  <div className="flex-1 relative overflow-hidden">
                    {/* PDF Viewer with restricted interactions */}
                    <div className="absolute inset-0">
                      <iframe
                        src={`${book.demoPdf.url}#toolbar=0&navpanes=0`}
                        title="Sample PDF"
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>

                      {/* Block right-click and other interactions */}
                      <div
                        className="absolute inset-0 z-10 pointer-events-none"
                        onContextMenu={(e) => e.preventDefault()}
                      ></div>
                    </div>
                  </div>

                  {/* Custom Controls */}
                  <div className="p-4 border-t flex justify-between items-center bg-gray-50">
                    <span className="text-sm text-gray-600">
                      Read-only preview | Download disabled
                    </span>
                    <button
                      onClick={() => setShowPdf(false)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Section */}
      {book.videoLink && (
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Book Preview
          </h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={book.videoLink}
              title="Book Video"
              allowFullScreen
              className="w-full h-[400px] rounded-md shadow-md"
            ></iframe>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-12 bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Customer Reviews
        </h2>

        {/* Review Form */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-gray-700 mb-2">Your Rating</label>
              <StarRating
                rating={review.rating}
                interactive={true}
                onChange={(rating) => setReview({ ...review, rating })}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Your Review</label>
              <textarea
                rows={5}
                value={review.comment}
                onChange={(e) =>
                  setReview({ ...review, comment: e.target.value })
                }
                placeholder="Share your thoughts about this book..."
                className="w-full border rounded-md px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={review.rating === 0 || review.comment.trim() === ""}
            >
              Submit Review
            </button>
          </div>
        </div>

        {/* Existing Reviews */}
        {book?.reviews?.length > 0 ? (
          <div className="space-y-8">
            {book.reviews.map((r, index) => (
              <div
                key={index}
                className="relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Profile picture with fallback */}
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
                      {r.user.image ? (
                        <img
                          src={r.user.image}
                          alt={r.user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-medium text-purple-600">
                          {r.user.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {r.user.name}
                      </h4>
                      <div className="flex items-center ml-2">
                        <StarRating rating={r.rating} />
                        <span className="ml-2 text-sm font-medium text-gray-500">
                          {r.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 whitespace-pre-line">
                      {r.comment}
                    </p>
                  </div>
                </div>

                {/* Decorative quote mark */}
                <div className="absolute top-6 right-6 text-gray-100 text-4xl font-serif -z-10">
                  "
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-500 mb-1">
              No reviews yet
            </h4>
            <p className="text-gray-400">
              Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>

      {/* Related Books */}
      {relatedBooks?.length > 0 && (
        <div className="mt-12">
          <BookSection
            title="Related Books"
            books={relatedBooks}
            loading={loadingBooks}
          />
        </div>
      )}
    </div>
  );
};

export default BookDetails;
