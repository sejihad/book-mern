// components/Hero.jsx
import { Link } from "react-router-dom";
import book_pn from "../assets/books-pn-min.png";
import "./hero.css"; // Import custom CSS for animation

const Hero = () => {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container px-4 flex flex-col-reverse md:flex-row justify-between items-center gap-8">
        {/* Left Content */}
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold leading-tight text-gray-800">
            BOOKS WILL{" "}
            <span className="text-green-600">EXPAND YOUR KNOWLEDGE</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-md">
            Discover the power of books that grow your mind. Dive into endless
            possibilities and fuel your imagination.
          </p>
          <button className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-full shadow-md transition-all duration-300">
            <Link to="/shop"> Buy Now</Link>
          </button>
        </div>

        {/* Right Image with Animation */}
        <img src={book_pn} alt="Books" className="w-40 md:w-56 animate-float" />
      </div>
    </section>
  );
};

export default Hero;
