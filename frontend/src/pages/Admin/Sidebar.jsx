import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleIcon from "@mui/icons-material/People";
import PostAddIcon from "@mui/icons-material/PostAdd";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { FaBook, FaBoxOpen, FaShippingFast } from "react-icons/fa";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <div className="bg-white flex flex-col p-8 h-auto md:h-screen sticky md:top-0 shadow-md overflow-y-auto w-full md:w-[250px]">
      <Link
        to="/admin/dashboard"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <DashboardIcon className="mr-4 text-[1.2rem]" />
        <span>Dashboard</span>
      </Link>
      <Link
        to="/admin/blogs"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <LibraryBooksIcon className="mr-4 text-[1.2rem]" />
        <span>Blogs</span>
      </Link>
      <Link
        to="/admin/blog"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <PostAddIcon className="mr-4 text-[1.2rem]" />
        <span>Add Blog</span>
      </Link>
      <Link
        to="/admin/categories"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <CategoryIcon className="mr-4 text-[1.2rem]" />
        <span>Categories</span>
      </Link>
      <Link
        to="/admin/ships"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <FaShippingFast className="mr-4 text-[1.2rem]" />
        <span>Shipping</span>
      </Link>
      <Link
        to="/admin/book/new"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <PostAddIcon className="mr-4 text-[1.2rem]" />
        <span>Add Book</span>
      </Link>
      <Link
        to="/admin/books"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <FaBook className="mr-4 text-[1.2rem]" />
        <span>Books</span>
      </Link>
      <Link
        to="/admin/package/new"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <PostAddIcon className="mr-4 text-[1.2rem]" />
        <span>Add Package</span>
      </Link>
      <Link
        to="/admin/packages"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <FaBoxOpen className="mr-4 text-[1.2rem]" />
        <span>Packages</span>
      </Link>
      <Link
        to="/admin/orders"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <ListAltIcon className="mr-4 text-[1.2rem]" />
        <span>Orders</span>
      </Link>

      <Link
        to="/admin/users"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <PeopleIcon className="mr-4 text-[1.2rem]" />
        <span>Users</span>
      </Link>

      <Link
        to="/admin/reviews"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <RateReviewIcon className="mr-4 text-[1.2rem]" />
        <span>Reviews</span>
      </Link>
    </div>
  );
};

export default Sidebar;
