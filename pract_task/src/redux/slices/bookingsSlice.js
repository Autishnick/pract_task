import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5000/';

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}bookings?_expand=room`);
      if (!response.ok) return thunkAPI.rejectWithValue('Failed to fetch bookings');
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, thunkAPI) => {
    try {
      const createResponse = await fetch(`${API_URL}bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      if (!createResponse.ok) return thunkAPI.rejectWithValue('Failed to create booking');
      const newBooking = await createResponse.json();

      // Отримуємо бронювання разом з даними кімнати
      const fetchResponse = await fetch(`${API_URL}bookings/${newBooking.id}?_expand=room`);
      if (!fetchResponse.ok) return thunkAPI.rejectWithValue('Failed to fetch booking details');
      return await fetchResponse.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async (bookingData, thunkAPI) => {
    try {
      const { id, ...fields } = bookingData;
      const updateResponse = await fetch(`${API_URL}bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      if (!updateResponse.ok) return thunkAPI.rejectWithValue('Failed to update booking');
      
      // Отримуємо оновлене бронювання разом з даними кімнати
      const fetchResponse = await fetch(`${API_URL}bookings/${id}?_expand=room`);
      if (!fetchResponse.ok) return thunkAPI.rejectWithValue('Failed to fetch booking details');
      return await fetchResponse.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteBooking = createAsyncThunk(
  'bookings/deleteBooking',
  async (bookingId, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}bookings/${bookingId}`, {
        method: 'DELETE',
      });
      if (!response.ok) return thunkAPI.rejectWithValue('Failed to delete booking');
      return bookingId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  bookings: [],
  status: 'idle',
  error: null,
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => { 
        state.status = 'loading'; 
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createBooking.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Додаємо нове бронювання, яке вже містить дані кімнати
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateBooking.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.bookings.findIndex(b => b.id === action.payload.id);
        // Оновлюємо бронювання з даними кімнати
        if (index !== -1) state.bookings[index] = action.payload;
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter(b => b.id !== action.payload);
      });
  },
});

export default bookingsSlice.reducer;