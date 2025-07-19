import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearErrors,
  loadUser,
  toggleTwoFactor,
} from "../../actions/userAction";

const Setting = () => {
  const dispatch = useDispatch();

  const { user, loading, error, message, success } = useSelector(
    (state) => state.user
  );
  const twoFactorEnabled = user?.isTwoFactorEnabled;

  const handleToggle = () => {
    dispatch(toggleTwoFactor());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success(message);
      dispatch(loadUser());
    }
  }, [error, dispatch, success]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Security Settings
        </h2>

        {/* 2FA Toggle Section */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-700">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-500">
              Add extra security to your account.
            </p>
          </div>

          <button
            onClick={handleToggle}
            disabled={loading}
            className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors duration-300 ${
              twoFactorEnabled ? "bg-green-500" : "bg-gray-300"
            } ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                twoFactorEnabled ? "translate-x-7" : "translate-x-1"
              }`}
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 
                       0 0 5.373 0 12h4zm2 5.291A7.962 
                       7.962 0 014 12H0c0 3.042 1.135 
                       5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setting;
