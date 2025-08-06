import { Doughnut, Line } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
// import { getAllOrders } from "../../actions/orderAction";
// import { getAdminProduct } from "../../actions/productAction";
// import { getAllUsers } from "../../actions/userAction";
import MetaData from "../../component/layout/MetaData";
import Sidebar from "./Sidebar";

import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAdminBook } from "../../actions/bookAction";
import { getAllUsers } from "../../actions/userAction";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);
const Dashboard = () => {
  const dispatch = useDispatch();

  const { books } = useSelector((state) => state.books);
  // const { orders } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.allUsers);
  const products = [
    {
      id: 1,
      name: "iPhone 14 Pro Max",
      price: 1299,
      Stock: 12,
      category: "Mobile",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Samsung Galaxy S22 Ultra",
      price: 1199,
      Stock: 8,
      category: "Mobile",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "MacBook Pro M2",
      price: 1999,
      Stock: 5,
      category: "Laptop",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Dell XPS 13",
      price: 1399,
      Stock: 9,
      category: "Laptop",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 5,
      name: "Sony WH-1000XM5",
      price: 399,
      Stock: 20,
      category: "Headphone",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 6,
      name: "AirPods Pro 2",
      price: 249,
      Stock: 18,
      category: "Earbuds",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 7,
      name: "Canon EOS R7",
      price: 1499,
      Stock: 3,
      category: "Camera",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 8,
      name: "Samsung 4K Smart TV",
      price: 999,
      Stock: 6,
      category: "TV",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 9,
      name: "PlayStation 5",
      price: 499,
      Stock: 10,
      category: "Gaming",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 10,
      name: "Xbox Series X",
      price: 499,
      Stock: 7,
      category: "Gaming",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 11,
      name: "Google Pixel 7",
      price: 699,
      Stock: 11,
      category: "Mobile",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 12,
      name: "Asus ROG Zephyrus",
      price: 1799,
      Stock: 4,
      category: "Laptop",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 13,
      name: "Apple Watch Series 9",
      price: 399,
      Stock: 13,
      category: "Watch",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 14,
      name: "Samsung Galaxy Watch 6",
      price: 349,
      Stock: 15,
      category: "Watch",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 15,
      name: "Logitech MX Master 3",
      price: 99,
      Stock: 30,
      category: "Accessories",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 16,
      name: "Razer BlackWidow Keyboard",
      price: 129,
      Stock: 10,
      category: "Accessories",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 17,
      name: "HP Pavilion Laptop",
      price: 749,
      Stock: 7,
      category: "Laptop",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 18,
      name: "Nikon Z30 Mirrorless",
      price: 999,
      Stock: 6,
      category: "Camera",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 19,
      name: "OnePlus 11 5G",
      price: 699,
      Stock: 14,
      category: "Mobile",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 20,
      name: "iPad Pro 12.9",
      price: 1099,
      Stock: 8,
      category: "Tablet",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 21,
      name: "Amazon Echo Dot 5th Gen",
      price: 49,
      Stock: 50,
      category: "Smart Home",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 22,
      name: "Google Nest Hub",
      price: 89,
      Stock: 25,
      category: "Smart Home",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 23,
      name: "MSI Gaming Laptop",
      price: 1599,
      Stock: 3,
      category: "Laptop",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 24,
      name: "Beats Studio3",
      price: 299,
      Stock: 10,
      category: "Headphone",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 25,
      name: "Realme GT Neo 5",
      price: 499,
      Stock: 12,
      category: "Mobile",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 26,
      name: "Anker Power Bank 20000mAh",
      price: 59,
      Stock: 40,
      category: "Accessories",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 27,
      name: "Xiaomi Mi Band 7",
      price: 49,
      Stock: 60,
      category: "Wearables",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 28,
      name: "JBL Flip 6 Speaker",
      price: 129,
      Stock: 18,
      category: "Speaker",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 29,
      name: "LG OLED 55” TV",
      price: 1399,
      Stock: 5,
      category: "TV",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 30,
      name: "TP-Link WiFi 6 Router",
      price: 89,
      Stock: 20,
      category: "Networking",
      image: "https://via.placeholder.com/150",
    },
  ];
  const orders = [
    {
      orderId: 1,
      customerName: "Rakib Hossain",
      totalPrice: 1299, // iPhone 14 Pro Max
      date: "2025-07-16",
    },
    {
      orderId: 2,
      customerName: "Sadia Akter",
      totalPrice: 749, // HP Pavilion Laptop
      date: "2025-07-15",
    },
    {
      orderId: 3,
      customerName: "Imran Khan",
      totalPrice: 499, // PlayStation 5
      date: "2025-07-14",
    },
  ];

  let outOfStock = 0;
  products?.forEach((item) => {
    if (item.Stock === 0) outOfStock += 1;
  });

  let totalAmount = 0;
  orders?.forEach((item) => {
    totalAmount += item.totalPrice;
  });

  useEffect(() => {
    dispatch(getAdminBook());
    //   dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        borderColor: "tomato",
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount],
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
        borderWidth: 1,
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  return (
    <div className="w-screen container max-w-full grid md:grid-cols-[1fr_5fr] min-h-screen bg-gray-100">
      <MetaData title="Dashboard - Admin Panel" />
      <Sidebar />

      <div className="bg-white p-8 overflow-x-hidden border-l border-gray-200">
        <h2 className="text-3xl font-semibold text-center mb-8 border-b pb-4 text-gray-800">
          Admin Dashboard
        </h2>

        <div className="my-8">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white rounded-lg p-6 text-center mx-auto mb-8 w-4/5 shadow-md">
            <p className="text-lg mb-2 font-medium">Total Revenue</p>
            <p className="text-3xl font-bold">${totalAmount.toFixed(2)}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/admin/books"
              className="bg-gradient-to-r from-pink-500 to-pink-300 text-white w-44 h-44 rounded-lg flex flex-col justify-center items-center shadow hover:-translate-y-1 transition"
            >
              <p className="text-lg font-medium mb-1">Books</p>
              <p className="text-2xl font-bold">{books?.length}</p>
            </Link>

            <Link
              to="/admin/orders"
              className="bg-gradient-to-r from-pink-300 to-red-100 text-gray-800 w-44 h-44 rounded-lg flex flex-col justify-center items-center shadow hover:-translate-y-1 transition"
            >
              <p className="text-lg font-medium mb-1">Orders</p>
              <p className="text-2xl font-bold">{orders?.length}</p>
            </Link>

            <Link
              to="/admin/users"
              className="bg-gradient-to-r from-purple-400 to-pink-200 text-white w-44 h-44 rounded-lg flex flex-col justify-center items-center shadow hover:-translate-y-1 transition"
            >
              <p className="text-lg font-medium mb-1">Users</p>
              <p className="text-2xl font-bold">{users?.length}</p>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap justify-around gap-8 mt-12">
          <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow">
            <Line data={lineState} options={options} />
          </div>
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
            <Doughnut data={doughnutState} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
