import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  storeTokenInLocalStorage,
  authHeader,
  handleResponse,
} from "../utils/authHandler";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface SignInState {
  header: { [key: string]: string };
  error: string | null | { message: string };
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
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue({ message: error.response.data.message });
      }
      return rejectWithValue({ message: error.response.data.message }); // Pass error message to the reducer
    }
  },
);
//Typescript not infering type of error message received from backend (format is: { message: string } - in user.tsx of BE code). To handle that:
function isErrorPayload(payload: any): payload is { message: string } {
  return (
    typeof payload === "object" && payload !== null && "message" in payload
  );
}

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
        if (isErrorPayload(action.payload)) {
          state.error = action.payload.message;
          console.log("state.error", state.error);
        } else {
          state.error = "Error occurred while trying to Sign In";
          console.log("state.error", state.error);
        }
      });
  },
});
export const { signOutUser } = authSlice.actions;
export default authSlice.reducer;