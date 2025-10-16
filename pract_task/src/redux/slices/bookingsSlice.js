import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const mockRooms = [
  { id: '1', name: 'Standard Room', capacity: 2, price: 100 },
  { id: '2', name: 'Deluxe Room', capacity: 2, price: 150 },
  { id: '3', name: 'Family Suite', capacity: 4, price: 220 },
  { id: '4', name: 'Business Suite', capacity: 3, price: 200 },
];

export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockRooms);
      }, 1000); 
    });
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
        state.error = action.error.message;
      });
  },
});

export default roomsSlice.reducer;