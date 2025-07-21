const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getAdminBlogs,
  getBlogDetails,
} = require("../controllers/blogController");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
router.get("/blogs", getAllBlogs);
router.get(
  "/admin/blogs",
  isAuthenticator,
  authorizeRoles("admin"),
  getAdminBlogs
);
router.post(
  "/admin/blog/new",
  isAuthenticator,
  authorizeRoles("admin"),
  createBlog
);
router.get("/blog/:id", getBlogDetails);
module.exports = router;
