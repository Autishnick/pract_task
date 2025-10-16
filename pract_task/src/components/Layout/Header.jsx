import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meeting Rooms</h1>

        <nav className="flex gap-4">
          <Link to="/rooms">Rooms</Link>
          <Link to="/bookings">Booking</Link>
          <Link to="/login">Sign in</Link>
          <Link to="/register">Sign up</Link>
        </nav>

        {user && <button onClick={() => dispatch(logout())}>Exit</button>}
      </div>
    </header>
  );
}

export default Header;
