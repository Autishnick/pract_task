import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const mockRooms = [
  { id: '1', name: 'Standard Room', capacity: 2, price: 100 },
  { id: '2', name: 'Deluxe Room', capacity: 2, price: 150 },
  { id: '3', name: 'Family Suite', capacity: 4, price: 220 },
  { id: '4', name: 'Business Suite', capacity: 3, price: 200 },
];

export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}rooms`);

      if (!response.ok) {
        return thunkAPI.rejectWithValue('Failed to fetch rooms');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const message = error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
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
      });
  },
});

export default roomsSlice.reducer;