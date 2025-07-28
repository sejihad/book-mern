const express = require("express");
const {
  getAllBooks,
  getBookDetails,
  createBook,
  updateBook,
  deleteBook,
  createBookReview,
  getBookReviews,
  deleteReview,
  getAdminBooks,
} = require("../controllers/bookController");

const { isAuthenticator, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// 📚 Public Routes
router.get("/books", getAllBooks);
router.get("/book/:id", getBookDetails);

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
  .put(isAuthenticator, authorizeRoles("admin"), updateBook)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteBook);

// ⭐️ Review Routes
router.put("/review", isAuthenticator, createBookReview);

router
  .route("/reviews")
  .get(getBookReviews)
  .delete(isAuthenticator, deleteReview);

module.exports = router;
