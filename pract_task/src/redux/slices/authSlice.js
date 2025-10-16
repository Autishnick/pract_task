import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/";

const savedUser = JSON.parse(localStorage.getItem("user"));
const savedToken = localStorage.getItem("token");

const initialState = {
  user: savedUser || null,
  token: savedToken || null,
  isLoading: false,
  isSuccess: !!savedUser,
  isError: false,
  message: "",
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const checkUserResponse = await fetch(
        `${API_URL}users?email=${userData.email}`
      );
      const existingUsers = await checkUserResponse.json();

      if (existingUsers.length > 0) {
        return thunkAPI.rejectWithValue("User with this email already exists");
      }

      const response = await fetch(`${API_URL}users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        return thunkAPI.rejectWithValue("Registration failed");
      }

      const newUser = await response.json();

      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", newUser.id);

      return { user: newUser, token: newUser.id };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Error during register");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const { email, password } = userData;
      const url = `${API_URL}users?email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`;

      const response = await fetch(url);
      if (!response.ok) {
        return thunkAPI.rejectWithValue("Server error during login");
      }

      const foundUsers = await response.json();
      if (foundUsers.length === 0) {
        return thunkAPI.rejectWithValue("Invalid credentials or user not found");
      }

      const user = foundUsers[0];

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", user.id);

      return { user, token: user.id };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Login failed");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isSuccess = false;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
