const Book = require("../models/bookModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const slugify = require("slugify");
const cloudinary = require("cloudinary");
const createBook = catchAsyncErrors(async (req, res, next) => {
  // Validate required fields
  const requiredFields = [
    "name",
    "description",
    "writer",
    "oldPrice",
    "discountPrice",
    "category",
  ];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({
        success: false,
        message: `${field} is required`,
      });
    }
  }

  // Validate image
  if (!req.files?.image) {
    return res.status(400).json({
      success: false,
      message: "Book image is required",
    });
  }

  // Upload main image
  let image;
  try {
    const file = req.files.image;
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.data.toString("base64")}`,
      {
        folder: "/book/books",
        resource_type: "auto",
      }
    );
    image = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error("Image upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload book image",
    });
  }

  // Upload additional images (max 4)
  const images = [];
  if (req.files.images) {
    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    for (const file of files.slice(0, 4)) {
      // Limit to 4 images
      try {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.data.toString("base64")}`,
          {
            folder: "/book/additional_images",
            resource_type: "auto",
          }
        );
        images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      } catch (error) {
        console.error("Additional image upload error:", error);
        // Continue even if one image fails
      }
    }
  }

  // Upload demo PDF
  let demoPdf = null;
  if (req.files?.demoPdf) {
    try {
      const result = await cloudinary.uploader.upload(
        `data:${
          req.files.demoPdf.mimetype
        };base64,${req.files.demoPdf.data.toString("base64")}`,
        {
          folder: "/book/demo_pdfs",
          resource_type: "raw",
        }
      );
      demoPdf = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      console.error("Demo PDF upload error:", error);
    }
  }

  // Upload full PDF (only for ebooks)
  let fullPdf = null;
  if (req.body.type === "ebook" && req.files?.fullPdf) {
    try {
      const result = await cloudinary.uploader.upload(
        `data:${
          req.files.fullPdf.mimetype
        };base64,${req.files.fullPdf.data.toString("base64")}`,
        {
          folder: "/book/full_pdfs",
          resource_type: "raw",
        }
      );
      fullPdf = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      console.error("Full PDF upload error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to upload full PDF (required for ebooks)",
      });
    }
  }

  // Create book
  const bookData = {
    ...req.body,
    image,
    images,
    demoPdf,
    fullPdf,
    user: req.user.id,
    slug: slugify(req.body.name, { lower: true, strict: true }),
  };

  const book = await Book.create(bookData);

  res.status(201).json({
    success: true,
    book,
  });
});
const updateBook = catchAsyncErrors(async (req, res, next) => {
  const bookId = req.params.id;
  const book = await Book.findById(bookId);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  // Handle image update
  if (req.files?.image) {
    try {
      // Delete old image if exists
      if (book.image?.public_id) {
        await cloudinary.uploader.destroy(book.image.public_id);
      }

      // Upload new image
      const file = req.files.image;
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.data.toString("base64")}`,
        {
          folder: "/book/books",
          resource_type: "auto",
        }
      );
      req.body.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      console.error("Image update error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update book image",
      });
    }
  }

  // Handle additional images update
  if (req.files?.images) {
    try {
      // Delete old additional images if they exist
      if (book.images?.length > 0) {
        for (const img of book.images) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      // Upload new additional images
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      const images = [];
      for (const file of files.slice(0, 4)) {
        // Limit to 4 images
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.data.toString("base64")}`,
          {
            folder: "/book/additional_images",
            resource_type: "auto",
          }
        );
        images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      req.body.images = images;
    } catch (error) {
      console.error("Additional images update error:", error);
      // Continue even if some images fail to update
    }
  }

  // Handle demoPdf update
  if (req.files?.demoPdf) {
    try {
      // Delete old demoPdf if exists
      if (book.demoPdf?.public_id) {
        await cloudinary.uploader.destroy(book.demoPdf.public_id, {
          resource_type: "raw",
        });
      }

      // Upload new demoPdf
      const demoResult = await cloudinary.uploader.upload(
        `data:${
          req.files.demoPdf.mimetype
        };base64,${req.files.demoPdf.data.toString("base64")}`,
        {
          folder: "/book/demo_pdfs",
          resource_type: "raw",
        }
      );
      req.body.demoPdf = {
        public_id: demoResult.public_id,
        url: demoResult.secure_url,
      };
    } catch (error) {
      console.error("Demo PDF update error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update demo PDF",
      });
    }
  }

  // Handle fullPdf update (only for ebooks)
  if (req.body.type === "ebook" && req.files?.fullPdf) {
    try {
      // Delete old fullPdf if exists
      if (book.fullPdf?.public_id) {
        await cloudinary.uploader.destroy(book.fullPdf.public_id, {
          resource_type: "raw",
        });
      }

      // Upload new fullPdf
      const fullResult = await cloudinary.uploader.upload(
        `data:${
          req.files.fullPdf.mimetype
        };base64,${req.files.fullPdf.data.toString("base64")}`,
        {
          folder: "/book/full_pdfs",
          resource_type: "raw",
        }
      );
      req.body.fullPdf = {
        public_id: fullResult.public_id,
        url: fullResult.secure_url,
      };
    } catch (error) {
      console.error("Full PDF update error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update full PDF (required for ebooks)",
      });
    }
  }

  // Handle slug update if name changed
  if (req.body.name && req.body.name !== book.name) {
    req.body.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  // Update book
  const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
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
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  try {
    // Delete main image from Cloudinary
    if (book.image?.public_id) {
      await cloudinary.uploader.destroy(book.image.public_id);
    }

    // Delete additional images from Cloudinary
    if (book.images?.length > 0) {
      for (const img of book.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    // Delete demoPdf from Cloudinary
    if (book.demoPdf?.public_id) {
      await cloudinary.uploader.destroy(book.demoPdf.public_id, {
        resource_type: "raw",
      });
    }

    // Delete fullPdf from Cloudinary
    if (book.fullPdf?.public_id) {
      await cloudinary.uploader.destroy(book.fullPdf.public_id, {
        resource_type: "raw",
      });
    }

    // Delete book from database
    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({
      success: false,
      message:
        "Error deleting book. Some resources may not have been properly deleted.",
    });
  }
});

// get single product
const getBookDetails = catchAsyncErrors(async (req, res, next) => {
  let book = await Book.findOne({ slug: req.params.slug });

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  res.status(200).json({ success: true, book });
});
const getBookCart = catchAsyncErrors(async (req, res, next) => {
  let book = await Book.findById(req.params.id);

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  res.status(200).json({ success: true, book });
});

// Create New Review or Update the review
const createBookReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, bookId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const book = await Book.findById(bookId);

  const isReviewed = book.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    book.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    book.reviews.push(review);
    book.numOfReviews = book.reviews.length;
  }

  let avg = 0;

  book.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  book.ratings = avg / book.reviews.length;

  await book.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
const getBookReviews = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.query.id)
    .populate("reviews.user", "name image")
    .select("reviews");

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  // Transform reviews to include formatted date and ensure consistent structure
  const transformedReviews = book.reviews.map((review) => ({
    ...review.toObject(),
    createdAt: review.createdAt, // Make sure your schema has timestamps
    user: {
      name: review.user?.name || "Anonymous",
      image: review.user?.image || null,
    },
  }));

  res.status(200).json({
    success: true,
    reviews: transformedReviews,
  });
});
// Delete Review
const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.query.productId);

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
  getBookCart,
};
