import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  storeTokenInLocalStorage,
  authHeader,
  handleResponse,
} from "../utils/authHandler";
import axios from "axios";

interface SignInState {
  header: { [key: string]: string };
  message: string | null;
  typeMessage: "success" | "error" | null;
  messageCounter: number;
  isLoading: boolean;
}

const storedToken = localStorage.getItem("token");
const initialState: SignInState = {
  header: { Authorization: storedToken ? `Bearer ${storedToken}` : "" },
  message: null,
  typeMessage: null,
  messageCounter: 0,
  isLoading: false,
};

export const signInUser = createAsyncThunk(
  "auth/signInUser",
  async (
    userData: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_AUTH_URL}/signin`,
        userData,
      );
      const { token } = response.data;
      storeTokenInLocalStorage(token);
      const header = authHeader(token); // (returns { Authorization: `Bearer ${token}` });
      return header;
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue({ message: error.response.data.message });
      }
      return rejectWithValue({ message: error.response.data.message });
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
    clearMessageCounter: (state) => {
      state.messageCounter = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.fulfilled, (state, action) => {
        state.header = action.payload;
        state.message = "Sign-in successful";
        state.typeMessage = "success";
        state.isLoading = false;
        state.messageCounter = state.messageCounter + 1;
      })
      .addCase(signInUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(signInUser.rejected, (state, action) => {
        if (isErrorPayload(action.payload)) {
          state.message = action.payload.message;
          state.typeMessage = "error";
          state.isLoading = false;
          state.messageCounter = state.messageCounter + 1;
          console.log("state.error", action.payload.message);
        } else {
          state.message =
            "It was not possible to sign in. Check your email and password and try again.";
          state.typeMessage = "error";
          state.isLoading = false;
          state.messageCounter = state.messageCounter + 1;
          console.log("state.error", state.message);
        }
      });
  },
});
export const { signOutUser, clearMessageCounter } = authSlice.actions;
export default authSlice.reducer;