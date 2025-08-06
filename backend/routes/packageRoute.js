const express = require("express");
const {
  getAllPackages,
  getPackageDetails,
  createPackage,
  updatePackage,
  deletePackage,
  createPackageReview,
  getPackageReviews,
  deleteReview,
  getAdminPackages,
  getPackageCart,
} = require("../controllers/packageController");

const { isAuthenticator, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// 📦 Public Routes
router.get("/packages", getAllPackages);
router.get("/packages/:id", getPackageCart);
router.get("/package/:slug", getPackageDetails);

// 🔐 Admin Routes
router.get(
  "/admin/packages",
  isAuthenticator,
  authorizeRoles("admin"),
  getAdminPackages
);

router.post(
  "/admin/package/new",
  isAuthenticator,
  authorizeRoles("admin"),
  createPackage
);

router
  .route("/admin/package/:id")
  .put(isAuthenticator, authorizeRoles("admin"), updatePackage)
  .delete(isAuthenticator, authorizeRoles("admin"), deletePackage);

// ⭐️ Review Routes
router.put("/review/package", isAuthenticator, createPackageReview);

router
  .route("/reviews/package")
  .get(getPackageReviews)
  .delete(isAuthenticator, deleteReview);

module.exports = router;
