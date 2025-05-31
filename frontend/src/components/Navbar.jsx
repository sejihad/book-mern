import { useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { FiMenu, FiSearch, FiShoppingBag, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategories, setShowCategories] = useState(false); // for desktop hover
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false); // for mobile
  const userMenuRef = useRef();
  const dropdownTimeoutRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryEnter = () => {
    clearTimeout(dropdownTimeoutRef.current);
    setShowCategories(true);
  };

  const handleCategoryLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowCategories(false);
    }, 200);
  };

  return (
    <nav className="w-full shadow-md bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
          <Link to="/" className="hover:text-green-600 transition">
            HOME
          </Link>

          {/* Desktop Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleCategoryEnter}
            onMouseLeave={handleCategoryLeave}
          >
            <button className="flex items-center gap-1 hover:text-green-600 transition">
              BOOKS <FaAngleDown className="mt-[1px]" />
            </button>
            {showCategories && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border-amber-50 shadow-md rounded-md z-50">
                {["Fiction", "Non-Fiction", "Science", "History"].map((cat) => (
                  <Link
                    key={cat}
                    to={`/books/${cat.toLowerCase()}`}
                    className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                    onClick={() => setShowCategories(false)}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/author" className="hover:text-green-600 transition">
            AUTHOR
          </Link>
          <Link to="/shop" className="hover:text-green-600 transition">
            SHOP
          </Link>
          <Link to="/blogs" className="hover:text-green-600 transition">
            BLOGS
          </Link>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 text-gray-700 text-xl relative">
          <span className="hidden sm:inline text-sm font-semibold text-gray-600">
            $0.00
          </span>
          <Link to="/cart">
            <FiShoppingBag className="hover:text-green-600 transition cursor-pointer" />
          </Link>

          {/* User */}
          <div ref={userMenuRef} className="relative">
            <FiUser
              className="cursor-pointer hover:text-green-600 transition"
              onClick={() => setShowUserMenu(!showUserMenu)}
            />
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white border shadow-xl rounded-lg z-50">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate("/login");
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Login
                </button>
              </div>
            )}
          </div>

          <FiSearch className="hidden md:inline cursor-pointer hover:text-green-600 transition" />
          <FiMenu
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden cursor-pointer hover:text-green-600 transition"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 pt-2 text-gray-700 text-sm font-semibold shadow-inner space-y-2">
          <Link to="/" className="block hover:text-green-600">
            HOME
          </Link>

          {/* Accordion for BOOKS */}
          <div>
            <button
              className="flex justify-between w-full hover:text-green-600"
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
            >
              BOOKS{" "}
              <FaAngleDown
                className={`transition-transform duration-200 ${
                  mobileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {mobileDropdownOpen && (
              <div className="pl-4 mt-2 space-y-1 text-gray-600">
                {["Fiction", "Non-Fiction", "Science", "History"].map((cat) => (
                  <Link
                    key={cat}
                    to={`/books/${cat.toLowerCase()}`}
                    className="block hover:text-green-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/author" className="block hover:text-green-600">
            AUTHOR
          </Link>
          <Link to="/shop" className="block hover:text-green-600">
            SHOP
          </Link>
          <Link to="/blogs" className="block hover:text-green-600">
            BLOGS
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
