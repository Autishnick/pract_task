import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRooms,
  createRoom,
  deleteRoom,
  updateRoom,
} from "../redux/slices/roomsSlice";
import RoomsList from "../components/Rooms/RoomsList";
import EditRooms from "../components/Rooms/EditRooms";

const RoomsPage = () => {
  const dispatch = useDispatch();
  const { rooms, status, error } = useSelector((state) => state.rooms);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  const handleSave = (formData) => {
    if (editingRoom) {
      dispatch(updateRoom({ id: editingRoom.id, ...formData }));
    } else {
      dispatch(createRoom(formData));
    }
    setEditingRoom(null);
    setIsFormOpen(false);
  };

  const handleDelete = (roomId) => {
    if (window.confirm("Видалити цю кімнату?")) {
      dispatch(deleteRoom(roomId));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rooms Management</h1>
        <button
          onClick={() => {
            setEditingRoom(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Room
        </button>
      </div>

      {status === "loading" && <p>Loading rooms...</p>}
      {status === "failed" && <p className="text-red-600">{error}</p>}

      <RoomsList
        rooms={rooms}
        onEdit={(room) => {
          setEditingRoom(room);
          setIsFormOpen(true);
        }}
        onDelete={(room) => handleDelete(room.id)}
      />

      {isFormOpen && (
        <EditRooms
          initialData={editingRoom}
          onSubmit={handleSave}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default RoomsPage;
