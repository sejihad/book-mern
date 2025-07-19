import AddIcon from "@mui/icons-material/Add";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleIcon from "@mui/icons-material/People";
import PostAddIcon from "@mui/icons-material/PostAdd";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-white flex flex-col p-8 h-screen sticky top-0 shadow-md overflow-y-auto w-[250px]">
      <Link
        to="/admin/dashboard"
        className="flex items-center px-6 py-3 text-gray-700 hover:text-red-500 hover:bg-red-100 rounded transition-all duration-300"
      >
        <DashboardIcon className="mr-4 text-lg" />
        <span>Dashboard</span>
      </Link>

      <div className="my-2">
        <SimpleTreeView>
          <TreeItem
            itemId="1"
            label={
              <div className="flex items-center px-6 py-3 text-gray-700">
                <ImportExportIcon className="mr-4 text-lg" />
                <span>Products</span>
              </div>
            }
          >
            <Link to="/admin/products" className="block">
              <TreeItem
                itemId="2"
                label={
                  <div className="flex items-center px-10 py-2 text-gray-700 hover:text-red-500 hover:bg-red-100 rounded transition-all duration-300">
                    <PostAddIcon className="mr-3 text-base" />
                    <span>All</span>
                  </div>
                }
              />
            </Link>

            <Link to="/admin/product" className="block">
              <TreeItem
                itemId="3"
                label={
                  <div className="flex items-center px-10 py-2 text-gray-700 hover:text-red-500 hover:bg-red-100 rounded transition-all duration-300">
                    <AddIcon className="mr-3 text-base" />
                    <span>Create</span>
                  </div>
                }
              />
            </Link>
          </TreeItem>
        </SimpleTreeView>
      </div>

      <Link
        to="/admin/orders"
        className="flex items-center px-6 py-3 text-gray-700 hover:text-red-500 hover:bg-red-100 rounded transition-all duration-300"
      >
        <ListAltIcon className="mr-4 text-lg" />
        <span>Orders</span>
      </Link>

      <Link
        to="/admin/users"
        className="flex items-center px-6 py-3 text-gray-700 hover:text-red-500 hover:bg-red-100 rounded transition-all duration-300"
      >
        <PeopleIcon className="mr-4 text-lg" />
        <span>Users</span>
      </Link>

      <Link
        to="/admin/reviews"
        className="flex items-center px-6 py-3 text-gray-700 hover:text-red-500 hover:bg-red-100 rounded transition-all duration-300"
      >
        <RateReviewIcon className="mr-4 text-lg" />
        <span>Reviews</span>
      </Link>
    </div>
  );
};

export default Sidebar;
