const Blog = require("../models/blogModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const cloudinary = require("cloudinary");
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

const getBlogDetails = catchAsyncErrors(async (req, res, next) => {
  let blog = await Blog.findOne({ slug: req.params.slug });

  if (!blog) {
    return next(new ErrorHandler("Blog not found", 404));
  }

  res.status(200).json({ success: true, blog });
});

const updateBlog = catchAsyncErrors(async (req, res, next) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ErrorHandler("Blog not found", 404));
  }

  // ✅ যদি নতুন ছবি থাকে তাহলে পুরাতোটা ডিলিট করে আপলোড করো
  if (req.files && req.files.image) {
    // পুরাতন ছবি ডিলিট
    if (blog.image && blog.image.public_id) {
      try {
        await cloudinary.uploader.destroy(blog.image.public_id);
      } catch (error) {
        console.error("Cloudinary Deletion Error:", error);
      }
    }

    // নতুন ছবি আপলোড
    try {
      const result = await cloudinary.uploader.upload(
        `data:${
          req.files.image.mimetype
        };base64,${req.files.image.data.toString("base64")}`,
        {
          folder: "/book/blogs",
        }
      );

      req.body.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Image upload failed" });
    }
  }

  // ✅ টাইটেল বা ডিসক্রিপশন যেটা আসবে, সেটাই আপডেট হবে
  const updatedData = {};
  if (req.body.title) updatedData.title = req.body.title;
  if (req.body.desc) updatedData.desc = req.body.desc;
  if (req.body.image) updatedData.image = req.body.image;

  // ✅ আপডেট করে সেভ
  blog = await Blog.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    blog,
  });
});

const deleteBlog = catchAsyncErrors(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ErrorHandler("Blog not found", 404));
  }

  if (blog.image && blog.image.public_id) {
    try {
      await cloudinary.uploader.destroy(blog.image.public_id);
    } catch (error) {
      console.error("Cloudinary Deletion Error:", error);
    }
  }

  await Blog.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
});

module.exports = {
  createBlog,
  getAllBlogs,
  getAdminBlogs,
  getBlogDetails,
  updateBlog,
  deleteBlog,
};
