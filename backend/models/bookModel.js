const mongoose = require("mongoose");
const slugify = require("slugify");
const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter book Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter book Description"],
  },
  writer: {
    type: String,
    required: [true, "Please Enter Writer Name"],
  },
  type: {
    type: String,
    enum: ["book", "ebook"],
    default: "book",
  },
  oldPrice: {
    type: Number,
    required: [true, "Please Enter Original Price"],
    max: [99999999, "Price cannot exceed 8 digits"],
  },
  discountPrice: {
    type: Number,
    required: [true, "Please Enter Discount Price"],
    max: [99999999, "Price cannot exceed 8 digits"],
  },
  // ✅ NEW: Optional demo PDF
  demoPdf: {
    public_id: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
  },
  // ✅ NEW: Optional full PDF for eBooks
  fullPdf: {
    public_id: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
  },
  ratings: {
    type: Number,
    default: 0,
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  category: {
    type: String,
    required: [true, "Please Enter Book Category"],
  },
  Stock: {
    type: Number,
    required: [true, "Please Enter book Stock"],
    max: [9999, "Stock cannot exceed 4 digits"],
    default: 1,
  },
  videoLink: {
    type: String,
    default: null,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },

      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
bookSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});
module.exports = mongoose.model("Book", bookSchema);
