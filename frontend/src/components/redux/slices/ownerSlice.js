import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk for owner login
export const ownerLoginThunk = createAsyncThunk(
  "owner-login",
  async (ownerCredObj, thunkApi) => {
    try {
      const res = await axios.post(
        "https://ashrmservices.onrender.com/owner-api/login",
        ownerCredObj
      );
      if (res.data.message === "Login success") {
        // Store token in localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("currentOwner", JSON.stringify(res.data.owner)); // Persist owner data
        return res.data;
      } else {
        return thunkApi.rejectWithValue(res.data.message);
      }
    } catch (err) {
      return thunkApi.rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Load initial state from localStorage
const loadOwnerStateFromLocalStorage = () => {
  const token = localStorage.getItem("token");
  const currentOwner = JSON.parse(localStorage.getItem("currentOwner") || "{}");
  return {
    isPending: false,
    loginOwnerStatus: !!token,
    currentOwner,
    errorOccurred: false,
    errMsg: "",
  };
};

export const ownerSlice = createSlice({
  name: "owner-login",
  initialState: loadOwnerStateFromLocalStorage(),
  reducers: {
    resetState: (state) => {
      state.isPending = false;
      state.currentOwner = {};
      state.loginOwnerStatus = false;
      state.errorOccurred = false;
      state.errMsg = "";
      localStorage.removeItem("token");
      localStorage.removeItem("currentOwner");
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(ownerLoginThunk.pending, (state) => {
        state.isPending = true;
      })
      .addCase(ownerLoginThunk.fulfilled, (state, action) => {
        state.isPending = false;
        state.currentOwner = action.payload.owner;
        state.loginOwnerStatus = true;
        state.errorOccurred = false;
        state.errMsg = "";
      })
      .addCase(ownerLoginThunk.rejected, (state, action) => {
        state.isPending = false;
        state.currentOwner = {};
        state.loginOwnerStatus = false;
        state.errorOccurred = true;
        state.errMsg = action.payload;
      }),
});

// Export action creator functions
export const { resetState } = ownerSlice.actions;

// Export root reducer of this slice
export default ownerSlice.reducer;
