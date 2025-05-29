import { useState } from "react";
import { FiMenu, FiSearch, FiShoppingBag, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <nav className="w-full shadow-sm bg-white">
        <div className="container px-4 py-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <img className="w-30" src={logo} alt="Logo" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 font-semibold text-sm text-gray-800">
            <Link to="/" className="text-green-600">
              HOME
            </Link>
            <Link to="/books" className="hover:text-green-600">
              BOOKS
            </Link>
            <Link to="/author" className="hover:text-green-600">
              AUTHOR
            </Link>
            {/* <Link to="/sellers" className="hover:text-green-600">
              SELLERS
            </Link> */}
            <Link to="/shop" className="hover:text-green-600">
              SHOP
            </Link>
            <Link to="/blogs" className="hover:text-green-600">
              BLOGS
            </Link>
            {/* <Link to="/publish" className="text-red-600 font-bold">
              +PUBLISH
            </Link> */}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 text-2xl text-gray-700">
            <span className="hidden sm:inline text-sm font-medium">$0.00</span>
            <FiShoppingBag className="cursor-pointer" />
            <FiUser
              className="cursor-pointer"
              onClick={() => setAuthOpen(true)}
            />
            <FiSearch className="cursor-pointer hidden md:inline" />
            <FiMenu
              onClick={() => setMenuOpen(!menuOpen)}
              className="cursor-pointer md:hidden"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white px-4 pb-4 font-semibold text-gray-800">
            <Link to="/" className="block py-2">
              HOME
            </Link>
            <Link to="/books" className="block py-2">
              BOOKS
            </Link>
            <Link to="/authors" className="block py-2">
              AUTHORS
            </Link>
            <Link to="/sellers" className="block py-2">
              SELLERS
            </Link>
            <Link to="/shop" className="block py-2">
              SHOP
            </Link>
            <Link to="/blogs" className="block py-2">
              BLOGS
            </Link>
            <Link to="/publish" className="block py-2 text-red-600 font-bold">
              +PUBLISH
            </Link>
          </div>
        )}
      </nav>

      {/* Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;
