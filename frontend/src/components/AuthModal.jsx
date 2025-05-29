import { useState } from "react";

const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [showForgot, setShowForgot] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleLogin = () => {
    let errs = {};
    if (!formData.email.trim()) errs.email = "Email is required.";
    else if (!validateEmail(formData.email)) errs.email = "Invalid email.";
    if (!formData.password.trim()) errs.password = "Password is required.";
    else if (formData.password.length < 6)
      errs.password = "Password must be at least 6 characters.";

    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      alert("Logged in successfully!");
    }
  };

  const handleRegister = () => {
    let errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required.";
    if (!formData.email.trim()) errs.email = "Email is required.";
    else if (!validateEmail(formData.email)) errs.email = "Invalid email.";
    if (!formData.password.trim()) errs.password = "Password is required.";
    else if (formData.password.length < 6)
      errs.password = "Password must be at least 6 characters.";

    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      alert("Registered successfully!");
    }
  };

  const handleForgot = () => {
    let errs = {};
    if (!formData.email.trim()) errs.email = "Email is required.";
    else if (!validateEmail(formData.email)) errs.email = "Invalid email.";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      alert("Password reset link sent!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white py-10 w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          className="absolute top-2 right-3 text-gray-500 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Tabs */}
        {!showForgot && (
          <div className="flex justify-center gap-6 mb-6 font-semibold text-gray-700">
            <button
              className={activeTab === "login" ? "text-green-600" : ""}
              onClick={() => {
                setActiveTab("login");
                setErrors({});
              }}
            >
              Login
            </button>
            <button
              className={activeTab === "register" ? "text-green-600" : ""}
              onClick={() => {
                setActiveTab("register");
                setErrors({});
              }}
            >
              Register
            </button>
          </div>
        )}

        {/* Login */}
        {activeTab === "login" && !showForgot && (
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}

            {/* Password with Eye Icon */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-2 mb-2 p-2 border rounded pr-10"
              />
              <span
                className="absolute top-2.5 right-3 cursor-pointer text-xl"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🚫" : "👁️"}
              </span>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}

            <div
              className="text-right text-sm text-green-600 cursor-pointer mb-3"
              onClick={() => {
                setShowForgot(true);
                setErrors({});
              }}
            >
              Forgot Password?
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Login
            </button>
          </div>
        )}

        {/* Register */}
        {activeTab === "register" && !showForgot && (
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName}</p>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 mb-2 p-2 border rounded"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}

            {/* Password with Eye Icon */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-2 mb-2 p-2 border rounded pr-10"
              />
              <span
                className="absolute top-2.5 right-3 cursor-pointer text-xl"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🚫" : "👁️"}
              </span>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}

            <div className="text-xs text-gray-600 mb-3">
              By registering, you agree to our{" "}
              <span className="text-blue-600 cursor-pointer">
                Privacy Policy
              </span>
              .
            </div>
            <button
              onClick={handleRegister}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Register
            </button>
          </div>
        )}

        {/* Forgot Password */}
        {showForgot && (
          <div>
            <h2 className="text-center font-semibold text-gray-700 mb-4">
              Reset Password
            </h2>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
            <button
              onClick={handleForgot}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-600 transition mb-3 cursor-pointer"
            >
              Get New Password
            </button>
            <div
              className="text-center hover:text-green-600 text-sm text-gray-600 cursor-pointer"
              onClick={() => {
                setShowForgot(false);
                setErrors({});
              }}
            >
              Go to Login
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
