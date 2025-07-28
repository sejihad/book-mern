const Book = require("../models/bookModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const cloudinary = require("cloudinary");

const createBook = catchAsyncErrors(async (req, res, next) => {
  let image = {};

  // ✅ Check if image file exists
  if (!req.files || !req.files.image) {
    return res.status(400).json({
      success: false,
      message: "No image received",
    });
  }

  const file = req.files.image;

  try {
    // ✅ Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.data.toString("base64")}`,
      {
        folder: "/book/books",
      }
    );

    image = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }

  // ✅ Handle optional demoPdf upload
  let demoPdf = { public_id: null, url: null };
  if (req.files.demoPdf) {
    try {
      const demoResult = await cloudinary.uploader.upload(
        `data:${
          req.files.demoPdf.mimetype
        };base64,${req.files.demoPdf.data.toString("base64")}`,
        {
          folder: "/book/demoPdfs",
          resource_type: "raw", // Important for non-image files
        }
      );
      demoPdf = {
        public_id: demoResult.public_id,
        url: demoResult.secure_url,
      };
    } catch (err) {
      console.error("Demo PDF Upload Error:", err);
    }
  }

  // ✅ Handle optional fullPdf upload
  let fullPdf = { public_id: null, url: null };
  if (req.files.fullPdf) {
    try {
      const fullResult = await cloudinary.uploader.upload(
        `data:${
          req.files.fullPdf.mimetype
        };base64,${req.files.fullPdf.data.toString("base64")}`,
        {
          folder: "/book/fullPdfs",
          resource_type: "raw",
        }
      );
      fullPdf = {
        public_id: fullResult.public_id,
        url: fullResult.secure_url,
      };
    } catch (err) {
      console.error("Full PDF Upload Error:", err);
    }
  }

  // ✅ Assign fields
  req.body.image = image;
  req.body.demoPdf = demoPdf;
  req.body.fullPdf = fullPdf;
  req.body.user = req.user?.id || "UnknownUser";

  const book = await Book.create(req.body);

  res.status(201).json({
    success: true,
    book,
  });
});

const updateBook = catchAsyncErrors(async (req, res, next) => {
  const bookId = req.params.id;
  const book = await Book.findById(bookId);

  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }

  // ✅ Handle image update
  if (req.files?.image) {
    // Delete old image from Cloudinary
    if (book.image?.public_id) {
      await cloudinary.uploader.destroy(book.image.public_id);
    }

    // Upload new image
    const file = req.files.image;
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.data.toString("base64")}`,
      {
        folder: "/book/books",
      }
    );
    req.body.image = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  // ✅ Handle demoPdf update
  if (req.files?.demoPdf) {
    if (book.demoPdf?.public_id) {
      await cloudinary.uploader.destroy(book.demoPdf.public_id, {
        resource_type: "raw",
      });
    }

    const demoResult = await cloudinary.uploader.upload(
      `data:${
        req.files.demoPdf.mimetype
      };base64,${req.files.demoPdf.data.toString("base64")}`,
      {
        folder: "/book/demoPdfs",
        resource_type: "raw",
      }
    );
    req.body.demoPdf = {
      public_id: demoResult.public_id,
      url: demoResult.secure_url,
    };
  }

  // ✅ Handle fullPdf update
  if (req.files?.fullPdf) {
    if (book.fullPdf?.public_id) {
      await cloudinary.uploader.destroy(book.fullPdf.public_id, {
        resource_type: "raw",
      });
    }

    const fullResult = await cloudinary.uploader.upload(
      `data:${
        req.files.fullPdf.mimetype
      };base64,${req.files.fullPdf.data.toString("base64")}`,
      {
        folder: "/book/fullPdfs",
        resource_type: "raw",
      }
    );
    req.body.fullPdf = {
      public_id: fullResult.public_id,
      url: fullResult.secure_url,
    };
  }

  // ✅ Update other fields dynamically
  const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    book: updatedBook,
  });
});

// get all prodcuts
const getAllBooks = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find();

  res.status(200).json({
    success: true,
    books,
  });
});
// Get All Product (Admin)
const getAdminBooks = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find();

  res.status(200).json({
    success: true,
    books,
  });
});

// delete product
const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  // ✅ Delete image from Cloudinary
  if (book.image?.public_id) {
    await cloudinary.uploader.destroy(book.image.public_id);
  }

  // ✅ Delete demoPdf from Cloudinary (as raw file)
  if (book.demoPdf?.public_id) {
    await cloudinary.uploader.destroy(book.demoPdf.public_id, {
      resource_type: "raw",
    });
  }

  // ✅ Delete fullPdf from Cloudinary (as raw file)
  if (book.fullPdf?.public_id) {
    await cloudinary.uploader.destroy(book.fullPdf.public_id, {
      resource_type: "raw",
    });
  }

  // ✅ Delete book from database
  await Book.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
});

// get single product
const getBookDetails = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({ success: true, product });
});

// Create New Review or Update the review
const createBookReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
const getBookReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
module.exports = {
  createBook,
  getAllBooks,
  updateBook,
  deleteBook,
  getBookDetails,
  createBookReview,
  getBookReviews,
  deleteReview,
  getAdminBooks,
};
