import { Link } from "react-router-dom";

const books = [
  {
    title: "The Locked Room",
    author: "T J Klune",
    price: "$50",
    oldPrice: "$54",
    discount: "-7%",
    category: "Fiction",
    rating: 4.5,
    image: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
  },
  {
    title: "It Happened One Summer",
    author: "Virginia Woolf",
    price: "$45",
    oldPrice: "$56",
    discount: "-20%",
    category: "Romantic",
    rating: 0, // 0 or null means no rating
    image: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
  },
  {
    title: "Mystery of the Blue Train",
    author: "Agatha Christie",
    price: "$40",
    oldPrice: "$50",
    discount: "-20%",
    category: "Mystery",
    rating: 3,
    image: "https://covers.openlibrary.org/b/id/8306662-L.jpg",
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: "$60",
    oldPrice: "$70",
    discount: "-14%",
    category: "Thriller",
    rating: 5,
    image: "https://covers.openlibrary.org/b/id/10528614-L.jpg",
  },
  {
    title: "Educated",
    author: "Tara Westover",
    price: "$35",
    oldPrice: "$45",
    discount: "-22%",
    category: "Memoir",
    rating: 4,
    image: "https://covers.openlibrary.org/b/id/8235081-L.jpg",
  },
];

const StarRating = ({ rating }) => {
  if (!rating || rating <= 0) return null;

  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center text-yellow-400 text-sm mt-1">
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={"full" + i}
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z" />
        </svg>
      ))}
      {halfStar && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 fill-current"
          viewBox="0 0 20 20"
        >
          <defs>
            <linearGradient id="half-grad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half-grad)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z"
          />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={"empty" + i}
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 fill-gray-300"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z" />
        </svg>
      ))}
    </div>
  );
};

const BookSection = ({ title }) => {
  return (
    <section className="container py-6 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6 px-2">
        <h3 className="text-2xl font-semibold">
          {title} <span className="text-green-600">Books</span>
        </h3>
        <button className="text-sm text-blue-600 hover:underline">
          Show All →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {books.slice(0, 5).map((book, i) => (
          <div
            key={i}
            className="border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="relative">
              <div className="overflow-hidden rounded-t-lg">
                <Link to="/category/name/book" className="block">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-48  transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                  />
                </Link>
              </div>

              {book.discount && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  {book.discount}
                </div>
              )}
            </div>
            <div className="p-3">
              <h4 className="text-lg font-semibold truncate">{book.title}</h4>
              <StarRating rating={book.rating} />
              <p className="text-sm text-gray-600 mt-1">{book.category}</p>
              <div className="mt-2 flex items-center gap-2 text-sm font-medium">
                <span className="text-green-600">{book.price}</span>
                <span className="line-through text-gray-400">
                  {book.oldPrice}
                </span>
              </div>
              <button
                className="cursor-pointer
    mt-4 w-full 
    bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 
    text-white py-2 rounded 
    hover:from-blue-600 hover:via-teal-500 hover:to-green-600 
    transition
  "
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BookSection;
