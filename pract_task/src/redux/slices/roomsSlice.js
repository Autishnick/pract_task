import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5000/';

export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}rooms`);
      if (!response.ok) {
        return thunkAPI.rejectWithValue('Failed to fetch rooms');
      }
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createRoom = createAsyncThunk(
  'rooms/createRoom',
  async (roomData, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData),
      });
      if (!response.ok) {
        return thunkAPI.rejectWithValue('Failed to create room');
      }
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateRoom = createAsyncThunk(
  'rooms/updateRoom',
  async (roomData, thunkAPI) => {
    try {
      const { id, ...fields } = roomData;
      const response = await fetch(`${API_URL}rooms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      if (!response.ok) {
        return thunkAPI.rejectWithValue('Failed to update room');
      }
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteRoom = createAsyncThunk(
  'rooms/deleteRoom',
  async (roomId, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}rooms/${roomId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        return thunkAPI.rejectWithValue('Failed to delete room');
      }
      return roomId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  rooms: [],
  status: 'idle',
  error: null,
};

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.rooms.push(action.payload);
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        const index = state.rooms.findIndex(room => room.id === action.payload.id);
        if (index !== -1) {
          state.rooms[index] = action.payload;
        }
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter(room => room.id !== action.payload);
      });
  },
});

export default roomsSlice.reducer;