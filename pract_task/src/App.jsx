import { Routes, Route } from "react-router-dom";
import Header from "./components/Layout/Header";
import RoomsPage from "./pages/RoomsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BookingsPage from "./pages/BookingsPage";
import "./index.css";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<RoomsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
