import { useEffect, useState } from "react";
import {
  FaBook,
  FaBox,
  FaRegStar,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import { getPackages } from "../../actions/packageAction";
import { addItemsPackageToCart } from "../../actions/packageCartAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex justify-center mt-2 text-yellow-400 text-sm">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} />
      ))}
      {halfStar && <FaStarHalfAlt />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={i} />
      ))}
    </div>
  );
};

const PackagesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { packages, loading } = useSelector((state) => state.packages);
  const { user } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getPackages());
  }, [dispatch]);

  const handleBuyNow = (item) => {
    navigate("/checkout", {
      state: {
        cartItems: [item],
        type: "package",
      },
    });
  };

  const addToCartHandler = (id, q) => {
    dispatch(addItemsPackageToCart(id, q));

    toast.success("Package Added To Cart");
  };

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <MetaData title="All Book Packages" />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Filter/Sort Controls (can be expanded) */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {filteredPackages.length} Packages Available
              </h2>
            </div>

            {/* No Packages Message */}
            {filteredPackages.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No packages found
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Try a different search term"
                    : "Check back later for new packages"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="bg-white border-amber-50 shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
                  >
                    <div className="relative border-gray-200 group">
                      <Link
                        to={`/package/${slugify(pkg.name, {
                          lower: true,
                          strict: true,
                        })}`}
                      >
                        <img
                          src={pkg.image?.url}
                          alt={pkg.name}
                          className="w-full h-48 object-cover"
                        />
                      </Link>
                      {pkg.oldPrice > pkg.discountPrice && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                          -
                          {Math.round(
                            ((pkg.oldPrice - pkg.discountPrice) /
                              pkg.oldPrice) *
                              100
                          )}
                          %
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <Link
                        to={`/package/${slugify(pkg.name, {
                          lower: true,
                          strict: true,
                        })}`}
                      >
                        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 mb-1">
                          {pkg.name}
                        </h3>
                      </Link>
                      <StarRating rating={pkg.ratings || 0} />

                      {/* Package Info */}
                      <div className="mt-3 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FaBook className="mr-2 text-blue-500" />
                          <span>
                            {Object.keys(pkg.books || {}).length} books included
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FaBox className="mr-2 text-indigo-500" />
                          <span>{pkg.deliveryTime || "Standard shipping"}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-indigo-600">
                            ${pkg.discountPrice}
                          </span>
                          {pkg.oldPrice > pkg.discountPrice && (
                            <span className="ml-2 text-sm line-through text-gray-400">
                              ${pkg.oldPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 space-y-2">
                        <button
                          onClick={() =>
                            handleBuyNow({
                              id: pkg._id,
                              name: pkg.name,
                              image: pkg.image.url,
                              price: pkg.discountPrice,
                              quantity: 1,
                              type: "package",
                            })
                          }
                          className="w-full bg-gradient-to-r from-indigo-500 to-indigo-500 text-white font-medium py-2 rounded hover:from-indigo-600 hover:to-indigo-600 transition"
                        >
                          Buy Now
                        </button>
                        <button
                          onClick={() => addToCartHandler(pkg._id, 1)}
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium py-2 rounded hover:from-blue-600 hover:to-indigo-600 transition"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;
