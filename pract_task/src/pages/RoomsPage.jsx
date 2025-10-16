import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRooms } from "../redux/slices/roomsSlice";
import Header from "../components/Layout/Header";
const RoomsPage = () => {
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.rooms.rooms);
  const status = useSelector((state) => state.rooms.status);
  const error = useSelector((state) => state.rooms.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchRooms());
    }
  }, [status, dispatch]);

  return (
    <div className="rooms-page">
      <Header />
      <h1>Available Rooms</h1>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error: {error}</p>}
      {status === "succeeded" && (
        <div className="rooms-list">
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <h3>{room.name}</h3>
              <p>Capacity: {room.capacity}</p>
              <p>Price: ${room.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomsPage;
