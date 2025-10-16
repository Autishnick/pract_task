import { Edit, Trash2 } from "lucide-react";

const RoomsList = ({ rooms, onEdit, onDelete }) => {
  if (!rooms || rooms.length === 0) {
    return <p className="text-gray-500">No rooms available.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg divide-y">
      {rooms.map((room) => (
        <div key={room.id} className="flex justify-between items-center p-4">
          <div>
            <p className="font-semibold text-lg">{room.name}</p>
            <p className="text-gray-600">
              Capacity: {room.capacity} | Price: ${room.price}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(room)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={() => onDelete(room)}
              className="p-2 hover:bg-gray-100 rounded-full text-red-600"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomsList;
