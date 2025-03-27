import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk for operator login
export const operatorLoginThunk = createAsyncThunk(
  "operator-login",
  async (operatorCredObj, thunkApi) => {
    try {
      const res = await axios.post(
        "https://ashrmservices.onrender.com/operator-api/login",
        operatorCredObj
      );
      if (res.data.message === "login success") {
        // Store token in localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("currentOperator", JSON.stringify(res.data.operator)); // Persist operator data
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
const loadOperatorStateFromLocalStorage = () => {
  const token = localStorage.getItem("token");
  const currentOperator = JSON.parse(localStorage.getItem("currentOperator") || "{}");
  return {
    isPending: false,
    loginOperatorStatus: !!token,
    currentOperator,
    errorOccurred: false,
    errMsg: "",
  };
};

export const operatorSlice = createSlice({
  name: "operator-login",
  initialState: loadOperatorStateFromLocalStorage(),
  reducers: {
    resetState: (state) => {
      state.isPending = false;
      state.currentOperator = {};
      state.loginOperatorStatus = false;
      state.errorOccurred = false;
      state.errMsg = "";
      localStorage.removeItem("token");
      localStorage.removeItem("currentOperator");
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(operatorLoginThunk.pending, (state) => {
        state.isPending = true;
      })
      .addCase(operatorLoginThunk.fulfilled, (state, action) => {
        state.isPending = false;
        state.currentOperator = action.payload.operator;
        state.loginOperatorStatus = true;
        state.errorOccurred = false;
        state.errMsg = "";
      })
      .addCase(operatorLoginThunk.rejected, (state, action) => {
        state.isPending = false;
        state.currentOperator = {};
        state.loginOperatorStatus = false;
        state.errorOccurred = true;
        state.errMsg = action.payload;
      }),
});

// Export action creator functions
export const { resetState } = operatorSlice.actions;

// Export root reducer of this slice
export default operatorSlice.reducer;
