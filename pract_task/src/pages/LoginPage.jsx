import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../redux/slices/authSlice";
import LoginForm from "../components/Auth/LoginForm";
import { AlertCircle } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/");
    }
  }, [user, isSuccess, navigate]);

  const handleSubmit = (formData) => {
    dispatch(login(formData));
  };

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4"></div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
              Login
            </h2>
            <p className="text-gray-500 font-light">
              Welcome back! Please login to your account
            </p>
          </div>

          {isError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Login Failed</p>
                <p className="text-sm text-red-700 mt-1">{message}</p>
              </div>
            </div>
          )}

          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
