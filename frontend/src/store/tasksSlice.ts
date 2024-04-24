import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { AddTasksParams } from "../components/Sidebar";
import { Task } from "../types";

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

      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_AUTH_URL}/api/taskint`,
        {
          params: { gte: gte.toISOString(), lte: lte.toISOString() },
          headers: header,
        },
      );
      const tasks = response.data.data;

      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateTask = createAsyncThunk(
  "task/update",
  async (params: Task, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;

      if (!state || !state.auth || !state.auth.header) {
        throw new Error("Authentication header not found in state");
      }
      const { header } = state.auth;
      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_AUTH_URL}/api/task/${params.id}`,
        {
          id: params.id,
          description: params.description,
          priority: params.priority,
          category: params.category,
          deadline: params.deadline,
          percentageCompleted: params.percentageCompleted,
          status: params.status,
        },
        { headers: header },
      );

      const updatedTask = response.data;
      // console.log("response.data - updateTask (tasksSlice)", response.data);

      return updatedTask;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

//Update the status of all tasks (updated (input) in TaskCard and made accessible to TasksList.tsx and Task.tsx):
export const updateTaskListStatus = createAsyncThunk(
  "task/updateTaskListStatus",
  async (params: Partial<Task[]>, { getState, rejectWithValue }) => {
    // in params is receiving updatedTaskStatusList
    try {
      const state = getState() as RootState;

      if (!state || !state.auth || !state.auth.header) {
        throw new Error("Authentication header not found in state");
      }
      const { header } = state.auth;

      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_AUTH_URL}/api/tasklist`,
        { data: params },
        { headers: header },
      );

      const updatedTaskList = response.data;

      return updatedTaskList;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteTask = createAsyncThunk(
  "task/delete",
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;

      if (!state || !state.auth || !state.auth.header) {
        throw new Error("Authentication header not found in state");
      }
      const { header } = state.auth;
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_AUTH_URL}/api/task/${id}`,
        { headers: header },
      );

      const deletedTask = response.data.data;
      // console.log(
      //   "response.data.data - deleteTask (taskSlice)",
      //   response.data.data,
      // );
      return deletedTask;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const addTask = createAsyncThunk(
  "task/add",
  async (params: AddTasksParams, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      if (!state || !state.auth || !state.auth.header) {
        throw new Error("Authentication header not found in state");
      }
      const { header } = state.auth;

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_AUTH_URL}/api/task`,
        {
          description: params.description,
          priority: params.priority,
          category: params.category,
          deadline: params.deadline,
        },
        { headers: header },
      );

      const addedTask = response.data.data;
      // console.log(
      //   "response.data.data - addedTasks (tasksSlice)",
      //   response.data.data,
      // );
      return addedTask;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTaskList: (state) => {
      state.taskList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.taskList = action.payload;
        state.error = null;
        console.log("Tasks fetched successfully:", state.taskList);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.error = action.error.message || "There was an error...";
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        console.log("Task updated successfully:", action.payload);
        state.error = null;
        state.taskList = state.taskList.map((task) =>
          task.id === action.payload.id ? action.payload : task,
        ); //replace in the taskList, the updated task (matching its id) and leave the rest unchanged
        console.log("Updated Task List:", state.taskList);
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error =
          action.error.message ||
          "There was an error while trying to update task (reducer)...";
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        console.log("Task deleted successfully:", action.payload);
        state.error = null;
        state.taskList = state.taskList.filter(
          (task) => task.id !== action.payload.id,
        ); //update task list (exclude deleted task)
        console.log("Updated task list", state.taskList);
      })

      .addCase(addTask.fulfilled, (state, action) => {
        console.log("Task added successfully:", action.payload);
        state.error = null;
        state.taskList = [...state.taskList, action.payload]; //add new task to the list
        console.log("Updated task list", state.taskList);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error =
          action.error.message || "There was an error while adding task...";
      })

      .addCase(updateTaskListStatus.fulfilled, (state, action) => {
        console.log(
          "Task status (list) updated successfully (all tasks searched until now):",
          action.payload,
        );
        state.error = null;
        //Ensure that only tasks between gte and lte are shown after saving task progress:
        state.taskList.forEach((taskStoredRedux) => {
          const updatedTaskStatus = action.payload.find(
            (updatedTask: Task) => updatedTask.id === taskStoredRedux.id,
          );
          if (updatedTaskStatus) {
            Object.assign(taskStoredRedux, updatedTaskStatus);
          }
        });
      })

      .addCase(updateTaskListStatus.rejected, (state, action) => {
        state.error =
          action.error.message ||
          "There was an error while trying to update task status list (reducer)...";
      });
  },
});

export const { clearTaskList } = tasksSlice.actions;
export default tasksSlice.reducer;
