import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

interface TaskListState {
  taskList: any[];
  error: string | null;
}

const initialState: TaskListState = {
  taskList: [],
  error: null,
};

export const fetchTasks = createAsyncThunk(
  "tasks/timeInterval",
  async (
    { gte, lte }: { gte: Date; lte: Date },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as RootState;

      if (!state || !state.auth || !state.auth.header) {
        throw new Error("Authentication header not found in state");
      }
      const { header } = state.auth;
      console.log(
        "Type of gte",
        typeof gte,
        "and value:",
        gte.toISOString(),
        "Type of lte",
        typeof lte,
        "and value:",
        lte.toISOString(),
      );
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_AUTH_URL}/api/taskint`,
        {
          params: { gte: gte.toISOString(), lte: lte.toISOString() },
          headers: header,
        },
      );
      const tasks = response.data.data;

      // console.log(
      //   "Tasks fetched successfully in the thunk",
      //   "response",
      //   response,
      // );
      // console.log(
      //   "Tasks fetched successfully in the thunk",
      //   "response.data",
      //   response.data,
      // );
      // console.log(
      //   "Tasks fetched successfully in the thunk",
      //   "response.data.data and tasks  (should be equal)",
      //   response.data.data,
      //   tasks,
      // );
      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        console.log("Tasks fetched successfully:", action.payload);
        state.taskList = action.payload;
        state.error = null;
        console.log(
          "got tasks between time interval, associated to this user",
          state.taskList,
        );
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.error = action.error.message || "There was an error...";
      });
  },
});
export const { actions: taskActions } = tasksSlice;
export default tasksSlice.reducer;
