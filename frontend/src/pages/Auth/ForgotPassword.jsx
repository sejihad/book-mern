import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset link sent to:", email);
    // Send reset email to backend API
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-lime-100 to-emerald-100 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg border border-green-100">
        <h2 className="text-3xl font-extrabold text-center text-green-700 mb-6">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold shadow-md hover:from-green-600 hover:to-emerald-600 transition"
          >
            Send Reset Link
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600 text-sm">
          Back to
          <Link
            to="/login"
            className="text-green-600 font-medium hover:underline ml-1"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
