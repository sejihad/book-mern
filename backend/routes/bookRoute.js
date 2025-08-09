const express = require("express");
const {
  getAllBooks,
  getBookDetails,
  createBook,
  updateBook,
  deleteBook,
  createBookReview,

  deleteReview,
  getAdminBooks,
  getBookCart,
  getAdminBookDetails,
  getReviews,
} = require("../controllers/bookController");

const { isAuthenticator, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// 📚 Public Routes
router.get("/books", getAllBooks);
router.get("/books/:id", getBookCart);

router.get("/book/:slug", getBookDetails);

// 🔐 Admin Routes
router.get(
  "/admin/books",
  isAuthenticator,
  authorizeRoles("admin"),
  getAdminBooks
);

router.post(
  "/admin/book/new",
  isAuthenticator,
  authorizeRoles("admin"),
  createBook
);

router
  .route("/admin/book/:id")
  .get(isAuthenticator, authorizeRoles("admin"), getAdminBookDetails)
  .put(isAuthenticator, authorizeRoles("admin"), updateBook)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteBook);

// ⭐️ Review Routes
router.put("/review", isAuthenticator, createBookReview);

router.route("/book/reviews/:id").get(isAuthenticator, getReviews);
router
  .route("/book/review/:bookId/:reviewId")
  .delete(isAuthenticator, deleteReview);

module.exports = router;
