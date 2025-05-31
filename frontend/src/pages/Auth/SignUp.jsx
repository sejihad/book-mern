import { useState } from "react";
import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    image: null,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Submit to backend API
  };

  const handleGoogleSignup = () => {
    console.log("Signup with Google");
  };

  const handleFacebookSignup = () => {
    console.log("Signup with Facebook");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-lime-100 to-emerald-100 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg border border-green-100">
        <h2 className="text-4xl font-extrabold text-center text-green-700 mb-6">
          Create Your Account
        </h2>

        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={handleGoogleSignup}
            className="flex items-center gap-2 bg-white border border-gray-300 px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition hover:bg-gray-50"
          >
            <FcGoogle size={22} /> Google
          </button>
          <button
            onClick={handleFacebookSignup}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <FaFacebook size={22} /> Facebook
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-4 pr-10 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-green-600 focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Profile Image (Optional)
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold shadow-md hover:from-green-600 hover:to-emerald-600 transition"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?
          <Link
            to="/login"
            className="text-green-600 font-medium hover:underline ml-1"
          >
            Login here
          </Link>
        </div>

        <div className="mt-3 text-center text-gray-400 text-xs">
          By signing up, you agree to our
          <Link
            to="/privacy-policy"
            className="text-green-500 hover:underline ml-1"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
