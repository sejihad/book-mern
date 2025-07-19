import { useEffect, useRef, useState } from "react";
import {
  FaAngleDown,
  FaCog,
  FaCreditCard,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUser,
} from "react-icons/fa";
import { FiMenu, FiSearch, FiShoppingBag, FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../actions/userAction"; // ✅ import your logout action
import logo from "../../assets/logo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const userMenuRef = useRef();
  const dropdownTimeoutRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.user);

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

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    navigate("/login");
  };

  return (
    <nav className="w-full shadow-md bg-white sticky top-0 z-50">
      <div className="max-w-[1050px] mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
          <Link to="/" className="hover:text-green-600 transition">
            HOME
          </Link>

          <div
            className="relative"
            onMouseEnter={handleCategoryEnter}
            onMouseLeave={handleCategoryLeave}
          >
            <button className="flex items-center gap-1 hover:text-green-600 transition cursor-pointer">
              BOOKS <FaAngleDown className="mt-[1px]  " />
            </button>
            {showCategories && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border shadow-md rounded-md z-50">
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
          <Link to="/cart">
            <FiShoppingBag className="hover:text-green-600 transition cursor-pointer" />
          </Link>

          {/* User Menu */}
          <div ref={userMenuRef} className="relative">
            {isAuthenticated ? (
              <img
                src={user?.avatar?.url} // Fallback image if avatar not available
                alt="User Avatar"
                className="w-8 h-8 rounded-full cursor-pointer border hover:border-green-600 transition"
                onClick={() => setShowUserMenu(!showUserMenu)}
              />
            ) : (
              <FiUser
                className="cursor-pointer hover:text-green-600 transition"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login");
                  } else {
                    setShowUserMenu(!showUserMenu);
                  }
                }}
              />
            )}

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white border shadow-xl rounded-lg z-50">
                {isAuthenticated ? (
                  <div className="flex flex-col">
                    {user?.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-green-700 transition-colors duration-200 rounded-md"
                      >
                        <FaTachometerAlt /> Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-green-700 transition-colors duration-200 rounded-md"
                    >
                      <FaUser /> Profile
                    </Link>
                    {user?.provider === "local" && (
                      <Link
                        to="/profile/setting"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-green-700 transition-colors duration-200 rounded-md"
                      >
                        <FaCog /> Setting
                      </Link>
                    )}
                    <Link
                      to="/payments"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-green-700 transition-colors duration-200 rounded-md"
                    >
                      <FaCreditCard /> Payments
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-green-700 transition-colors duration-200 rounded-md"
                    >
                      <FaShoppingBag /> Orders
                    </Link>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-100 hover:text-red-700 transition-colors duration-200 rounded-md"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate("/login");
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-green-100 hover:text-green-700 transition-colors duration-200 rounded-md"
                  >
                    <FaSignInAlt /> Login
                  </button>
                )}
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

          {/* Mobile User */}
          <div className="pt-2 border-t border-gray-200">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left py-2 hover:text-red-600"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/login");
                }}
                className="block w-full text-left py-2 hover:text-green-600"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
