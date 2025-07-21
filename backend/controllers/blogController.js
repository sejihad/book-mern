const Blog = require("../models/blogModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const cloudinary = require("cloudinary");

const getAllBlogs = catchAsyncErrors(async (req, res, next) => {
  const blogs = await Blog.find();

  res.status(200).json({
    success: true,
    blogs,
  });
});

const getAdminBlogs = catchAsyncErrors(async (req, res, next) => {
  const blogs = await Blog.find();

  res.status(200).json({
    success: true,
    blogs,
  });
});
const createBlog = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({
      success: false,
      message: "No image received",
    });
  }

  const file = req.files.image;

  let imageLink;

  try {
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.data.toString("base64")}`,
      { folder: "/book/blogs" }
    );

    imageLink = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Image upload failed" });
  }

  req.body.image = imageLink;
  req.body.user = req.user?.id || "Unknown";

  const blog = await Blog.create(req.body);

  res.status(201).json({
    success: true,
    blog,
  });
});
const getBlogDetails = catchAsyncErrors(async (req, res, next) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ErrorHandler("Blog not found", 404));
  }

  res.status(200).json({ success: true, blog });
});
module.exports = {
  createBlog,
  getAllBlogs,
  getAdminBlogs,
  getBlogDetails,
};
