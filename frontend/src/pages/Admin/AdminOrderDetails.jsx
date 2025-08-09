import { useEffect, useState } from "react";
import {
  FaBox,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaShippingFast,
  FaTimesCircle,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearErrors,
  getOrderDetails,
  updateOrder,
} from "../../actions/orderAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";
import Sidebar from "./Sidebar";

const AdminOrderDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState("");

  const { order, loading, error } = useSelector((state) => state.orderDetails);
  const { isUpdated, error: updateError } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success("Order Updated Successfully");
      dispatch({ type: "UPDATE_ORDER_RESET" });
      navigate("/admin/orders");
    }
  }, [dispatch, error, updateError, isUpdated, navigate]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <FaCheckCircle className="text-indigo-500 inline mr-2" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500 inline mr-2" />;
      default:
        return <FaClock className="text-yellow-500 inline mr-2" />;
    }
  };

  const getPaymentIcon = (method) => {
    switch (method?.toLowerCase()) {
      case "stripe":
        return <FaCreditCard className="text-blue-500 inline mr-2" />;
      case "paypal":
        return <FaCreditCard className="text-blue-400 inline mr-2" />;
      default:
        return <FaCreditCard className="text-gray-500 inline mr-2" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "ebook":
        return <FaCreditCard className="text-purple-500 inline mr-2" />;
      case "book":
        return <FaBox className="text-brown-500 inline mr-2" />;
      case "package":
        return <FaShippingFast className="text-orange-500 inline mr-2" />;
      default:
        return <FaBox className="text-gray-500 inline mr-2" />;
    }
  };

  const updateOrderHandler = (e) => {
    e.preventDefault();
    dispatch(updateOrder(id, { status }));
  };

  if (loading || !order) return <Loader />;

  return (
    <div className="w-full min-h-screen container bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="md:w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <MetaData title={`Admin - Order #${order?._id?.slice(-6) || ""}`} />

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Order Details #{order?._id?.slice(-6)?.toUpperCase() || ""}
          </h1>
          <Link
            to="/admin/orders"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Orders
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Order Summary Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {getStatusIcon(order.order_status)}
                  Order Status
                </h3>
                <p
                  className={`text-lg ${
                    order.order_status === "completed"
                      ? "text-indigo-600"
                      : order.order_status === "cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  } font-semibold`}
                >
                  {order.order_status}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {getPaymentIcon(order.payment?.method)}
                  Payment Method
                </h3>
                <p className="text-lg text-gray-700 capitalize">
                  {order.payment?.method}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Status:{" "}
                  <span
                    className={
                      order.payment?.status === "paid"
                        ? "text-indigo-600"
                        : order.payment?.status === "cancel"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  >
                    {order.payment?.status}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {getTypeIcon(order.order_type)}
                  Order Type
                </h3>
                <p className="text-lg text-gray-700 capitalize">
                  {order.order_type}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping and Payment Info */}
          <div className="p-6 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shipping Info - Only show for non-ebook orders */}
            {order.order_type !== "ebook" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Shipping Information
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Address:</span>{" "}
                    {order.shippingInfo?.address}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">City:</span>{" "}
                    {order.shippingInfo?.city}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">State:</span>{" "}
                    {order.shippingInfo?.state}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Country:</span>{" "}
                    {order.shippingInfo?.country}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">PIN Code:</span>{" "}
                    {order.shippingInfo?.pinCode}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Phone:</span>{" "}
                    {order.shippingInfo?.phone}
                  </p>
                </div>
              </div>
            )}

            {/* Payment Info - Always shown */}
            <div
              className={order.order_type === "ebook" ? "md:col-span-2" : ""}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Payment Information
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Transaction ID:</span>{" "}
                  {order.payment?.transactionId}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Items Price:</span> $
                  {order.itemsPrice?.toFixed(2)}
                </p>
                {/* Shipping Price - Only show for non-ebook orders */}
                {order.order_type !== "ebook" && (
                  <p className="text-gray-700">
                    <span className="font-medium">Shipping Price:</span> $
                    {order.shippingPrice?.toFixed(2)}
                  </p>
                )}
                <p className="text-gray-700 font-bold">
                  <span className="font-medium">Total Paid:</span> $
                  {order.totalPrice?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Order Items
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.orderItems?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded"
                              src={item.image}
                              alt={item.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.price?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Update Order Section - Only show for non-ebook orders */}
          {order.order_type !== "ebook" && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Update Order Status
              </h3>
              <form onSubmit={updateOrderHandler}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Update Status
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
