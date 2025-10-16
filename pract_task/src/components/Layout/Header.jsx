import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "../../redux/slices/authSlice";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Meeting Rooms</h1>

        <div className="flex items-center gap-6">
          <nav className="flex gap-4 items-center">
            <Link to="/" className="hover:underline">
              Rooms
            </Link>
            <Link to="/bookings" className="hover:underline">
              Booking
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm hidden sm:block">
                  Welcome, {user.name}!
                </span>
                <button
                  onClick={onLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md transition-colors"
                >
                  Exit
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
