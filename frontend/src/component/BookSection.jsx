import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import book_1 from "../assets/books/book-1.jpg";
import book_2 from "../assets/books/book-2.jpg";
import book_3 from "../assets/books/book-3.jpg";
import book_4 from "../assets/books/book-4.jpg";
import book_5 from "../assets/books/book-5.jpg";

const books = [
  {
    title: "The Locked Room",
    author: "T J Klune",
    price: "$50",
    oldPrice: "$54",
    discount: "-7%",
    category: "Fiction",
    rating: 4.5,
    image: book_1,
  },
  {
    title: "It Happened One Summer",
    author: "Virginia Woolf",
    price: "$45",
    oldPrice: "$56",
    discount: "-20%",
    category: "Romantic",
    rating: 0,
    image: book_2,
  },
  {
    title: "Mystery of the Blue Train",
    author: "Agatha Christie",
    price: "$40",
    oldPrice: "$50",
    discount: "-20%",
    category: "Mystery",
    rating: 3,
    image: book_3,
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: "$60",
    oldPrice: "$70",
    discount: "-14%",
    category: "Thriller",
    rating: 5,
    image: book_4,
  },
  {
    title: "Educated",
    author: "Tara Westover",
    price: "$35",
    oldPrice: "$45",
    discount: "-22%",
    category: "Memoir",
    rating: 4,
    image: book_5,
  },
];

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

const BookSection = ({ title }) => {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {title} <span className="text-green-600">Books</span>
        </h2>
        <button className="text-blue-600 hover:underline text-sm font-medium">
          Show All →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {books.map((book, i) => (
          <div
            key={i}
            className="bg-white  shadow hover:shadow-lg transition duration-300 border-amber-50"
          >
            <div className="relative group overflow-hidden border border-gray-200 p-2 bg-white shadow hover:shadow-lg transition duration-300">
              <Link to="/category/name/book">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              {book.discount && (
                <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                  {book.discount}
                </span>
              )}
            </div>

            <div className="p-4 text-center">
              <h3 className="text-md font-semibold  text-gray-800">
                {book.title}
              </h3>
              <p className="text-sm text-gray-500">{book.author}</p>
              <StarRating rating={book.rating} />
              <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {book.category}
              </span>
              <div className="flex items-center justify-center gap-2 mt-2 text-sm">
                <span className="text-green-600 font-semibold">
                  {book.price}
                </span>
                <span className="line-through text-gray-400">
                  {book.oldPrice}
                </span>
              </div>
              <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2  hover:from-blue-600 hover:to-green-600 transition-all duration-300 cursor-pointer">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BookSection;
