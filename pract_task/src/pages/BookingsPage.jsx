import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../redux/slices/bookingsSlice";
import { fetchRooms } from "../redux/slices/roomsSlice";
import BookingsList from "../components/Bookings/BookingsList";
import { PlusCircle } from "lucide-react";

const isTimeConflict = (newBooking, existingBookings) => {
  const newStartTime = new Date(newBooking.startTime);
  const newEndTime = new Date(newBooking.endTime);

  for (const existing of existingBookings) {
    if (existing.id === newBooking.id) continue;

    const existingStartTime = new Date(existing.startTime);
    const existingEndTime = new Date(existing.endTime);

    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }
  return false;
};

const BookingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bookings, status, error } = useSelector((state) => state.bookings);
  const { rooms } = useSelector((state) => state.rooms);
  const { user } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({
    roomId: "",
    title: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    console.log("Current user:", user);
    console.log("Bookings status:", status);
    console.log("Bookings:", bookings);
    console.log("Rooms:", rooms);

    dispatch(fetchBookings());
    dispatch(fetchRooms());
  }, [user, dispatch, navigate]);

  // Додатковий лог для відстеження змін
  useEffect(() => {
    console.log("Bookings updated:", bookings);
  }, [bookings]);

  useEffect(() => {
    console.log("Rooms updated:", rooms);
  }, [rooms]);

  const openCreateModal = () => {
    setSelectedBooking(null);
    setFormData({
      roomId: rooms[0]?.id || "",
      title: "",
      startTime: "",
      endTime: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (booking) => {
    setSelectedBooking(booking);
    setFormData({
      roomId: booking.roomId,
      title: booking.title,
      startTime: booking.startTime,
      endTime: booking.endTime,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      dispatch(deleteBooking(bookingId));
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const bookingData = { ...formData, userId: user.id };

    const bookingsForRoom = bookings.filter(
      (b) => b.roomId === bookingData.roomId
    );

    if (isTimeConflict(bookingData, bookingsForRoom)) {
      alert(
        "Time conflict! This room is already booked for the selected time."
      );
      return;
    }

    const action = selectedBooking
      ? updateBooking({ id: selectedBooking.id, ...bookingData })
      : createBooking(bookingData);

    dispatch(action).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        setIsModalOpen(false);
      }
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={rooms.length === 0}
        >
          <PlusCircle size={20} />
          <span>New Booking</span>
        </button>
      </div>

      {status === "loading" && <p>Loading bookings...</p>}
      {status === "failed" && <p className="text-red-500">Error: {error}</p>}
      {status === "succeeded" && (
        <BookingsList
          bookings={bookings}
          rooms={rooms}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6">
              {selectedBooking ? "Edit Booking" : "Create New Booking"}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Room</label>
                <select
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
