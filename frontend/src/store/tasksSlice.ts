import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { AddTasksParams } from "../types";
import { Task } from "../types";

interface TaskListState {
  taskList: any[];
  message: string | null;
  typeMessage: "success" | "error" | null;
  messageCounter: number;
  isLoading: boolean;
}

const initialState: TaskListState = {
  taskList: [],
  message: null,
  typeMessage: null,
  messageCounter: 0,
  isLoading: false,
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
      const gteString = gte.toISOString();
      const lteString = lte.toISOString();
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_AUTH_URL}/api/taskint`,
        {
          params: { gte: gteString, lte: lteString },
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
    clearMessageCounter: (state) => {
      state.messageCounter = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.taskList = action.payload;
        state.message = null;
        state.typeMessage = null;
        state.isLoading = false;
        state.messageCounter = state.messageCounter + 1;
      })
      .addCase(fetchTasks.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        console.log("Tasks not fetched", action.error.message);
        state.message =
          "No tasks with deadline between these dates where found.";
        state.typeMessage = "error";
        state.isLoading = false;
        state.messageCounter = state.messageCounter + 1;
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        state.message = "Task successfully updated.";
        state.typeMessage = "success";
        state.messageCounter = state.messageCounter + 1;
        state.taskList = state.taskList.map((task) =>
          task.id === action.payload.id ? action.payload : task,
        ); //replace in the taskList, the updated task (matching its id) and leave the rest unchanged
        state.isLoading = false;
      })
      .addCase(updateTask.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.message = "Task was not updated, please try again.";
        state.typeMessage = "error";
        state.messageCounter = state.messageCounter + 1;
        state.isLoading = false;
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.message = "Task successfully deleted.";
        state.typeMessage = "success";
        state.messageCounter = state.messageCounter + 1;
        state.taskList = state.taskList.filter(
          (task) => task.id !== action.payload.id,
        ); //update task list (exclude deleted task)
        state.isLoading = false;
      })
      .addCase(deleteTask.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        console.log("Task not deleted", action.error.message);
        state.message = "Task not deleted, please try again later.";
        state.isLoading = false;
        state.typeMessage = "error";
        state.messageCounter = state.messageCounter + 1;
      })

      .addCase(addTask.fulfilled, (state, action) => {
        state.message = "Task successfully added.";
        state.typeMessage = "success";
        state.messageCounter = state.messageCounter + 1;
        state.taskList = [...state.taskList, action.payload];
        state.isLoading = false;
      })
      .addCase(addTask.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(addTask.rejected, (state, action) => {
        console.log("Task not added", action.error.message);
        state.message = "Task not added. Please try again later.";
        state.typeMessage = "error";
        state.messageCounter = state.messageCounter + 1;
        state.isLoading = false;
      })

      .addCase(updateTaskListStatus.fulfilled, (state, action) => {
        state.message = "Changes in tasks progress status successfully made.";
        state.typeMessage = "success";
        state.messageCounter = state.messageCounter + 1;
        state.isLoading = false;
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
      .addCase(updateTaskListStatus.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateTaskListStatus.rejected, (state, action) => {
        console.log("Status of task list not updated", action.error.message);
        state.message =
          "Changes in task progress status were not made. Please try again.";
        state.typeMessage = "error";
        state.messageCounter = state.messageCounter + 1;
        state.isLoading = false;
      });
  },
});

export const { clearTaskList, clearMessageCounter } = tasksSlice.actions;
export default tasksSlice.reducer;
