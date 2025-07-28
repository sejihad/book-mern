// 📁 src/pages/Shop.jsx
import { useEffect, useState } from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getBook } from "../../actions/bookAction";
import Loader from "../../component/layout/Loader/Loader";

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

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Shop = () => {
  const dispatch = useDispatch();
  const { loading, books } = useSelector((state) => state.books);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 15;

  const query = useQuery();

  useEffect(() => {
    dispatch(getBook());
  }, [dispatch]);

  useEffect(() => {
    const querySearch = query.get("search") || "";
    setSearchTerm(querySearch);
  }, [query]);

  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.writer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="container min-h-screen mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Books</h2>
      {loading ? (
        <Loader />
      ) : filteredBooks.length === 0 ? (
        <div className="text-center text-gray-500 text-lg py-10">
          No books found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {currentBooks.map((book, i) => (
              <div
                key={book._id}
                className="bg-white shadow hover:shadow-lg transition duration-300 border-amber-50"
              >
                <div className="relative group overflow-hidden border border-gray-200 p-2 bg-white shadow hover:shadow-lg transition duration-300">
                  <Link to={`/category/${book.category}/${book._id}`}>
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
                        ((book.oldPrice - book.discountPrice) / book.oldPrice) *
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
                  <div className="flex items-center justify-center gap-2 mt-2 text-sm">
                    <span className="text-green-600 font-semibold">
                      ${book.discountPrice}
                    </span>
                    <span className="line-through text-gray-400">
                      ${book.oldPrice}
                    </span>
                  </div>
                  <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2 hover:from-blue-600 hover:to-green-600 transition-all duration-300 cursor-pointer">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10">
            <div className="flex space-x-2">
              {[...Array(totalPages).keys()].map((num) => (
                <button
                  key={num + 1}
                  onClick={() => paginate(num + 1)}
                  className={`px-3 py-1 rounded-md border text-sm font-medium ${
                    currentPage === num + 1
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {num + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Shop;
