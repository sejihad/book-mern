import { useEffect, useState } from "react";
import {
  FaMinus,
  FaPlus,
  FaRegStar,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getPackageDetails } from "../../actions/packageAction";
import { addItemsPackageToCart } from "../../actions/packageCartAction";
import Loader from "../../component/layout/Loader/Loader";

const StarRating = ({ rating, interactive = false, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || rating;

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          className={`text-xl ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => handleClick(value)}
          onMouseEnter={() => handleMouseEnter(value)}
          onMouseLeave={handleMouseLeave}
        >
          {value <= displayRating ? (
            <FaStar className="text-yellow-400" />
          ) : (
            <FaRegStar className="text-yellow-400" />
          )}
        </span>
      ))}
    </div>
  );
};

const PackageDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { loading, package: pkg } = useSelector(
    (state) => state.packageDetails
  );
  const { user } = useSelector((state) => state.user);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeBookTab, setActiveBookTab] = useState(1);
  const [review, setReview] = useState({ rating: 0, comment: "" });

  useEffect(() => {
    dispatch(getPackageDetails(slug));
  }, [dispatch, slug]);

  const addToCartHandler = () => {
    dispatch(addItemsPackageToCart(pkg._id, quantity));
    navigate("/package/cart");
    toast.success("Package Added To Cart");
  };

  const handleBuyNow = (item) => {
    if (!user) {
      navigate("/login");
    } else if (user.country === "" || user.number === "") {
      navigate("/profile/update");
      toast.info("Complete Your Profile");
    } else {
      navigate("/checkout", {
        state: {
          cartItems: [item],
          type: "package",
        },
      });
    }
  };

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  const submitReview = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Add your review submission logic here
    toast.success("Review submitted successfully");
    setReview({ rating: 0, comment: "" });
  };

  if (loading || !pkg) return <Loader />;

  const allImages = [pkg.image, ...(pkg.images || [])].filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Main Package Section - 3 Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-8">
        {/* Left Column - Package Images */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            {/* Main Image */}
            <div className="flex justify-center mb-4 h-48">
              <img
                src={allImages[selectedImage]?.url}
                alt={pkg.name}
                className="h-full object-contain"
              />
            </div>

            {/* Thumbnail Slider */}
            {allImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto py-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-12 h-12 rounded border ${
                      selectedImage === index
                        ? "border-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle Column - Package Information */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-full">
            <h1 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h1>

            <div className="flex items-center mb-4">
              <StarRating rating={pkg.ratings || 0} />
              <span className="ml-2 text-gray-600">
                ({pkg.numOfReviews} reviews)
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {pkg.description}
              </p>
            </div>

            {/* Books in Package */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Books Included</h3>
              <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-4 overflow-x-auto">
                  {[1, 2, 3].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveBookTab(tab)}
                      className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                        activeBookTab === tab
                          ? "border-green-500 text-green-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Book {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {pkg.books && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">
                      {pkg.books[`book${activeBookTab}`]?.name}
                    </h4>
                    <p className="text-gray-600">
                      by {pkg.books[`book${activeBookTab}`]?.writer}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Publisher:</span>{" "}
                      {pkg.books[`book${activeBookTab}`]?.publisher || "N/A"}
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm">
                        Published:{" "}
                        {pkg.books[`book${activeBookTab}`]?.publishDate &&
                          new Date(
                            pkg.books[`book${activeBookTab}`].publishDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-500">Language:</span>{" "}
                      {pkg.books[`book${activeBookTab}`]?.language || "N/A"}
                    </div>
                    <div>
                      <span className="text-gray-500">ISBN-10:</span>{" "}
                      {pkg.books[`book${activeBookTab}`]?.isbn10 || "N/A"}
                    </div>
                    <div>
                      <span className="text-gray-500">ISBN-13:</span>{" "}
                      {pkg.books[`book${activeBookTab}`]?.isbn13 || "N/A"}
                    </div>
                  </div>
                  {pkg.books[`book${activeBookTab}`]?.demoPdf && (
                    <a
                      href={pkg.books[`book${activeBookTab}`]?.demoPdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View Sample PDF
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Purchase Options */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-4">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-green-600">
                ${pkg.discountPrice}
              </span>
              {pkg.oldPrice > pkg.discountPrice && (
                <span className="text-lg text-gray-400 line-through ml-3">
                  ${pkg.oldPrice}
                </span>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Quantity:</span>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    onClick={decrementQuantity}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                    disabled={quantity <= 1}
                  >
                    <FaMinus className="text-gray-600" />
                  </button>
                  <span className="px-4 py-1 bg-white w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                  >
                    <FaPlus className="text-gray-600" />
                  </button>
                </div>
              </div>

              {pkg.deliveryTime && (
                <div className="text-sm text-gray-600 mb-2">
                  <span>Delivery: </span>
                  <span className="font-medium">{pkg.deliveryTime}</span>
                </div>
              )}

              {pkg.deliverToCountries && (
                <div className="text-sm text-gray-600">
                  <span>Ships to: </span>
                  <span className="font-medium">{pkg.deliverToCountries}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={addToCartHandler}
                className="w-full flex items-center justify-center py-2 px-4 rounded-md font-medium text-white bg-green-600 hover:bg-green-700 transition"
              >
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </button>
              <button
                onClick={() =>
                  handleBuyNow({
                    id: pkg._id,
                    name: pkg.name,
                    image: pkg.image.url,
                    price: pkg.discountPrice,
                    quantity: quantity,
                    type: "package",
                  })
                }
                className="w-full py-2 px-4 rounded-md font-medium text-white bg-green-600 hover:bg-green-700 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      {pkg.videoLink && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Package Preview
          </h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={pkg.videoLink}
              title="Package Video"
              allowFullScreen
              className="w-full h-96 rounded-md"
            ></iframe>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Customer Reviews
        </h2>

        {/* Review Form */}
        {user && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Your Rating</label>
                <StarRating
                  rating={review.rating}
                  interactive={true}
                  onChange={(rating) => setReview({ ...review, rating })}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Your Review</label>
                <textarea
                  rows={4}
                  value={review.comment}
                  onChange={(e) =>
                    setReview({ ...review, comment: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Share your thoughts about this package..."
                ></textarea>
              </div>
              <button
                onClick={submitReview}
                disabled={review.rating === 0 || !review.comment.trim()}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
              >
                Submit Review
              </button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {pkg.reviews?.length > 0 ? (
          <div className="space-y-4">
            {pkg.reviews.map((review, index) => (
              <div key={index} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{review.name}</h4>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default PackageDetails;
