import { Edit, Trash2, Calendar, Clock } from "lucide-react";

const BookingsList = ({ bookings, rooms, onEdit, onDelete }) => {
  if (!bookings || bookings.length === 0) {
    return (
      <p className="p-4 text-center text-gray-500">You have no bookings yet.</p>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoomName = (booking) => {
    // Спочатку пробуємо взяти з об'єкта room (якщо є _expand)
    if (booking.room?.name) {
      return booking.room.name;
    }
    // Якщо немає, шукаємо в списку rooms за roomId
    if (rooms && rooms.length > 0) {
      const room = rooms.find((r) => r.id === booking.roomId);
      if (room) return room.name;
    }
    return "Unknown Room";
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
        >
          <div>
            <p className="font-bold text-xl">{booking.title}</p>
            <p className="text-gray-700">Room: {getRoomName(booking)}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> From: {formatDate(booking.startTime)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> To: {formatDate(booking.endTime)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(booking)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              aria-label="Edit booking"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={() => onDelete(booking.id)}
              className="p-2 hover:bg-gray-100 rounded-full text-red-600 transition"
              aria-label="Delete booking"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingsList;
