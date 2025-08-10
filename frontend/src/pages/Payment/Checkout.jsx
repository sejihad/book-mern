import { Country } from "country-state-city";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { paypalOrderCreate } from "../../actions/paypalAction";
import { getShips } from "../../actions/shipAction";
import { stripeOrderCreate } from "../../actions/stripeAction";
import MetaData from "../../component/layout/MetaData";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Safely get location state with defaults
  const { cartItems = [], type = "" } = location.state || {};

  const isEbook = type === "ebook";

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { ships } = useSelector((state) => state.ships);

  // Calculate total price safely
  const totalPrice = cartItems.reduce((acc, item) => {
    const price = item?.price;
    const quantity = item?.quantity;
    return acc + price * quantity;
  }, 0);

  // Shipping state with all required fields
  const [shippingInfo, setShippingInfo] = useState(
    isEbook
      ? {}
      : {
          address: "",
          city: "",
          state: "",
          country: "",
          pinCode: "",
          phone: "",
        }
  );

  const [selectedCountry, setSelectedCountry] = useState("");
  const [shippingCharge, setShippingCharge] = useState(isEbook ? 0 : 0);
  const [isShippingAvailable, setIsShippingAvailable] = useState(!isEbook);
  const [isFormComplete, setIsFormComplete] = useState(isEbook);
  const [isLoading, setIsLoading] = useState(true);

  // Check if all required fields are filled
  useEffect(() => {
    if (isEbook) {
      setIsFormComplete(true);
      return;
    }

    const requiredFields = [
      shippingInfo.address,
      shippingInfo.city,
      shippingInfo.state,
      shippingInfo.country,
      shippingInfo.pinCode,
      shippingInfo.phone,
    ];
    setIsFormComplete(
      requiredFields.every((field) => field && field.trim() !== "") &&
        isShippingAvailable
    );
  }, [shippingInfo, isShippingAvailable, isEbook]);

  // Load shipping data on mount (only if not ebook)
  useEffect(() => {
    if (isEbook) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        await dispatch(getShips());
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to load shipping data");
        setIsLoading(false);
      }
    };
    loadData();
  }, [dispatch, isEbook]);

  // Handle country change (only if not ebook)
  useEffect(() => {
    if (isEbook || !selectedCountry) return;

    try {
      const countryData = Country.getCountryByCode(selectedCountry);
      if (!countryData) return;

      setShippingInfo((prev) => ({
        ...prev,
        country: countryData.name || "",
      }));

      // Check shipping availability
      const shipInfo = ships.find(
        (ship) => ship.country.toLowerCase() === countryData.name.toLowerCase()
      );

      setShippingCharge(shipInfo?.charge || 0);
      setIsShippingAvailable(!!shipInfo);
    } catch (error) {
      console.error("Country data error:", error);
      toast.error("Error loading country data");
    }
  }, [selectedCountry, ships, isEbook]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleStripePayment = async (e) => {
    e.preventDefault();
    if (!user.country || !user.number) {
      navigate("/profile/update");
      toast.info("Complete Your Profile");
      return;
    }
    // Validate authentication
    if (!isAuthenticated) {
      toast.info("Please login to proceed with payment");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    // Validate form completion (only if not ebook)
    if (!isEbook && !isFormComplete) {
      toast.error("Please fill all shipping fields correctly");
      return;
    }

    const orderData = {
      shippingInfo: isEbook ? {} : shippingInfo,
      orderItems: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        type: item.type,
      })),
      itemsPrice: totalPrice,
      shippingPrice: isEbook ? 0 : shippingCharge,
      totalPrice: isEbook ? totalPrice : totalPrice + shippingCharge,
      paymentMethod: "stripe",
    };

    // Call Stripe API
    dispatch(stripeOrderCreate(orderData));
  };

  const handlePaypalPayment = async (e) => {
    e.preventDefault();
    if (!user.country || !user.number) {
      navigate("/profile/update");
      toast.info("Complete Your Profile");
      return;
    }
    // Validate authentication
    if (!isAuthenticated) {
      toast.info("Please login to proceed with payment");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    // Validate form completion (only if not ebook)
    if (!isEbook && !isFormComplete) {
      toast.error("Please fill all shipping fields correctly");
      return;
    }
    const orderData = {
      shippingInfo: isEbook ? {} : shippingInfo,
      orderItems: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        type: item.type,
      })),
      itemsPrice: totalPrice,
      shippingPrice: isEbook ? 0 : shippingCharge,
      totalPrice: isEbook ? totalPrice : totalPrice + shippingCharge,
      paymentMethod: "paypal",
    };

    // Call Stripe API
    dispatch(paypalOrderCreate(orderData));
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading checkout data...</div>;
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <>
      <MetaData title="Checkout" />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isEbook ? "Complete Your Purchase" : "Shipping Details"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Shipping Form - Hidden for ebooks */}
          {!isEbook && (
            <div className="md:col-span-2 bg-white rounded shadow-md p-6">
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Country</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Select Country</option>
                    {Country.getAllCountries().map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Pin Code</label>
                  <input
                    type="text"
                    name="pinCode"
                    value={shippingInfo.pinCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>

                {!isShippingAvailable && (
                  <div className="mb-4 text-red-600">
                    Sorry, we don't ship to{" "}
                    {shippingInfo.country || "your selected country"} at this
                    time.
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Payment buttons - shown for both ebook and physical products */}
          <div className={`${isEbook ? "md:col-span-3" : ""}`}>
            <div className="mt-6 p-6 bg-white shadow-md rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
                Choose Payment Method
              </h2>

              <div className="flex flex-col space-y-4">
                <button
                  onClick={(e) => handleStripePayment(e)}
                  disabled={!isFormComplete}
                  className={`w-full py-3 px-4 rounded-md text-lg font-medium transition-all duration-300 ${
                    isFormComplete
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  💳 Pay with Stripe
                </button>

                <button
                  onClick={handlePaypalPayment}
                  disabled={!isFormComplete}
                  className={`w-full py-3 px-4 rounded-md text-lg font-medium transition-all duration-300 ${
                    isFormComplete
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  🅿️ Pay with PayPal
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded shadow-md p-6 h-fit">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

            <div className="divide-y">
              {cartItems.map((item, i) => {
                const price = item.discountPrice || item.price;
                const subtotal = price * item.quantity;

                return (
                  <div key={i} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x ${price.toFixed(2)}
                      </p>
                    </div>
                    <p>${subtotal.toFixed(2)}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              {!isEbook && (
                <>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>
                      {isShippingAvailable
                        ? `$${shippingCharge.toFixed(2)}`
                        : "Not Available"}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total:</span>
                <span>
                  {isEbook
                    ? `$${totalPrice.toFixed(2)}`
                    : isShippingAvailable
                    ? `$${(totalPrice + shippingCharge).toFixed(2)}`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
