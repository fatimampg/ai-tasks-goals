import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  storeTokenInLocalStorage,
  authHeader,
  handleResponse,
} from "../utils/authHandler";
import axios from "axios";

interface SignInState {
  header: { [key: string]: string };
  error: string | null;
}

const storedToken = localStorage.getItem("token");
const initialState: SignInState = {
  header: { Authorization: storedToken ? `Bearer ${storedToken}` : "" },
  error: null,
};

export const signInUser = createAsyncThunk(
  "auth/signInUser",
  async (
    userData: { email: string; password: string },
    { rejectWithValue },
  ) => {
    //rejectWithValue - redux toolkit helper function to handle errors
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_AUTH_URL}/signin`,
        userData,
      );
      const { token } = response.data;
      storeTokenInLocalStorage(token);
      const header = authHeader(token); // (this returns { Authorization: `Bearer ${token}` });
      console.log(header);
      return header;
    } catch (error: any) {
      return rejectWithValue(error.message); // Pass error message to the reducer
    }
  },
);



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signOutUser: (state) => {
      state.header = { Authorization: "" };
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.fulfilled, (state, action) => {
        // state.token = action.payload;
        state.header = action.payload;
        state.error = null;
        console.log("token given and auth header created");
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.error = action.error.message || "There was an error...";
      });
  },
});
export const { signOutUser } = authSlice.actions;
export default authSlice.reducer;