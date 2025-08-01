import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import slugify from "slugify";
import Loader from "./layout/Loader/Loader";
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex justify-center mt-2 text-yellow-400 text-sm">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} />
      ))}
      {halfStar && <FaStarHalfAlt />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={i} />
      ))}
    </div>
  );
};

const BookSection = ({ title, books, loading }) => {
  const navigate = useNavigate();
  const handleBuyNow = (book) => {
    navigate("/checkout", {
      state: {
        bookId: book._id,
        quantity: 1,
      },
    });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {title} <span className="text-green-600">Books</span>
            </h2>
            <Link
              to="/shop"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Show All →
            </Link>
          </div>

          {/* ✅ No Books Message */}
          {books.length === 0 ? (
            <div className="text-center text-gray-500 text-lg py-10">
              No books added yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {books.map((book, i) => (
                <div
                  key={book._id}
                  className="bg-white shadow hover:shadow-lg transition duration-300 border-amber-50"
                >
                  <div className="relative group overflow-hidden border border-gray-200 p-2 bg-white shadow hover:shadow-lg transition duration-300">
                    <Link
                      to={`/${book.type}/${book.category}/${slugify(book.name, {
                        lower: true,
                        strict: true,
                      })}`}
                    >
                      <img
                        src={book.image?.url}
                        alt={book.name}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    {book.oldPrice > book.discountPrice && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                        -
                        {Math.round(
                          ((book.oldPrice - book.discountPrice) /
                            book.oldPrice) *
                            100
                        )}
                        %
                      </span>
                    )}
                  </div>

                  <div className="p-4 text-center">
                    <h3 className="text-md font-semibold text-gray-800">
                      {book.name}
                    </h3>
                    <p className="text-sm text-gray-500">{book.writer}</p>
                    <StarRating rating={book.ratings} />
                    <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {book.category}
                    </span>
                    <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {book.type}
                    </span>
                    <div className="flex items-center justify-center gap-2 mt-2 text-sm">
                      <span className="text-green-600 font-semibold">
                        ${book.discountPrice}
                      </span>
                      <span className="line-through text-gray-400">
                        ${book.oldPrice}
                      </span>
                    </div>
                    {book.type === "ebook" && (
                      <button
                        onClick={() => handleBuyNow(book)}
                        className="mt-2 w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-2 hover:from-red-600 hover:to-orange-600 transition-all duration-300 cursor-pointer"
                      >
                        Buy Now
                      </button>
                    )}
                    {book.type === "book" && (
                      <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2 hover:from-blue-600 hover:to-green-600 transition-all duration-300 cursor-pointer">
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default BookSection;
