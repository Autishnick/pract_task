import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../redux/slices/authSlice";
import RegisterForm from "../components/Auth/RegisterForm";
import { AlertCircle, UserPlus } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess || user) {
      navigate("/");
    }
    return () => {
      dispatch(reset());
    };
  }, [user, isSuccess, navigate, dispatch]);

  const handleSubmit = (formData) => {
    dispatch(register(formData));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4"></div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
              Sign Up
            </h2>
            <p className="text-gray-500 font-light">Create your new account</p>
          </div>

          {isError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  Registration Failed
                </p>
                <p className="text-sm text-red-700 mt-1">{message}</p>
              </div>
            </div>
          )}

          <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-purple-600 hover:text-purple-700 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
