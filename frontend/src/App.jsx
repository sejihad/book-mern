import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./component/layout/Footer";
import Header from "./component/layout/Header";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import AllBlogs from "./pages/Admin/AllBlogs";
import AllBooks from "./pages/Admin/AllBooks";
import AllCategories from "./pages/Admin/AllCategories";
import AllOrders from "./pages/Admin/AllOrders";
import AllPackages from "./pages/Admin/AllPackages";
import AllShips from "./pages/Admin/AllShips";
import AllUsers from "./pages/Admin/AllUsers";
import Dashboard from "./pages/Admin/Dashboard";
import NewBlog from "./pages/Admin/NewBlog";
import UpdateBlog from "./pages/Admin/UpdateBlog";
import UserDetails from "./pages/Admin/UserDetails";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import GoogleSuccess from "./pages/Auth/GoogleSuccess";
import Login from "./pages/Auth/Login";
import ResetPassword from "./pages/Auth/ResetPassword";
import BlogDetails from "./pages/Blogs/BlogDetails";
import Blogs from "./pages/Blogs/Blogs";
import BookPage from "./pages/Book/BookPage";
import CatBook from "./pages/Book/CatBook";
import BookDetails from "./pages/BookDetails/BookDetails";
import BookCart from "./pages/Cart/BookCart";
import EbookCart from "./pages/Cart/EbookCart";
import PackageCart from "./pages/Cart/PackageCart";
import EBookPage from "./pages/Ebook/EbookPage";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import MyOrders from "./pages/Orders/MyOrders";

import OrderDetails from "./pages/Orders/OrderDetails";
import PackageSection from "./pages/Package/Package";
import PackageDetails from "./pages/Package/PackageDetails";
import Checkout from "./pages/Payment/Checkout";
import PaymentCancel from "./pages/Payment/PaymentCancel";
import PaymentSuccess from "./pages/Payment/PaymentSuccess";
import Shop from "./pages/Shop/Shop";
import Profile from "./pages/User/Profile";
import Setting from "./pages/User/Setting";
import UpdatePassword from "./pages/User/UpdatePassword";
import UpdateProfile from "./pages/User/UpdateProfile";
const App = () => {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/packages" element={<PackageSection />} />
        <Route path="/package/:slug" element={<PackageDetails />} />
        <Route path="/ebook" element={<EBookPage />} />
        <Route path="/ebook/cart" element={<EbookCart />} />
        <Route path="/book/cart" element={<BookCart />} />
        <Route path="/package/cart" element={<PackageCart />} />

        <Route path="/books/:category" element={<BookPage />} />
        <Route path="/category/:category" element={<CatBook />} />
        <Route path="/:type/:category/:slug" element={<BookDetails />} />
        <Route path="/login" element={<Login />} />

        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/facebook-success" element={<GoogleSuccess />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        {/* notfound  */}
        <Route path="*" element={<NotFound />} />

        {/* protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/update"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/password/update"
          element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/setting"
          element={
            <ProtectedRoute>
              <Setting />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-cancel"
          element={
            <ProtectedRoute>
              <PaymentCancel />
            </ProtectedRoute>
          }
        />

        {/* admin route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blog"
          element={
            <ProtectedRoute isAdmin={true}>
              <NewBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogs"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllBlogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blog/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <UpdateBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <UserDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ships"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllShips />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/packages"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllPackages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllOrders />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
