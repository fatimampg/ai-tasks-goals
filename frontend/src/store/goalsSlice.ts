import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { Goal } from "../types";

interface GoalsListState {
  goalList: Goal[];
  error: string | null;
}

const initialState: GoalsListState = {
  goalList: [],
  error: null,
};

export const fetchGoals = createAsyncThunk(
  "goals/month",
  async (
    { month, year }: { month: number; year: number },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as RootState;

      if (!state || !state.auth || !state.auth.header) {
        throw new Error("Authentication header not found in state");
      }
      const { header } = state.auth;

      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_AUTH_URL}/api/goalmonth`,
        {
          params: { month: month, year: year },
          headers: header,
        },
      );
      const goals = response.data.data;

      return goals;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateGoal = createAsyncThunk(
  "goal/update",
  async (params: Goal, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;

      if (!state || !state.auth || !state.auth.header) {
        throw new Error("Authentication header not found in state");
      }
      const { header } = state.auth;
      console.log("/api/goal/${params.id}`", `/api/goal/${params.id}`);
      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_AUTH_URL}/api/goal/${params.id}`,
        {
          description: params.description,
          month: params.month,
          year: params.year,
          category: params.category,
        }, //  body
        { headers: header },
      );

      const updatedTask = response.data;

      return updatedTask;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteGoal = createAsyncThunk(
  "goal/delete",
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;

      if (!state || !state.auth || !state.auth.header) {
        throw new Error("Authentication header not found in state");
      }
      const { header } = state.auth;
      console.log("/api/goal/${id}`", `/api/goal/${id}`);
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_AUTH_URL}/api/goal/${id}`,
        { headers: header },
      );

      const deletedGoal = response.data.data;
      return deletedGoal;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const addGoal = createAsyncThunk(
  "goal/add",
  async (params: Partial<Goal>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      if (!state || !state.auth || !state.auth.header) {
        throw new Error("Authentication header not found in state");
      }
      const { header } = state.auth;

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_AUTH_URL}/api/goal`,
        {
          description: params.description,
          month: params.month,
          year: params.year,
          category: params.category,
        },
        { headers: header },
      );

      const addedGoal = response.data.data;
      // console.log("response.data.data - addedGoal (goalsSlice)", response.data.data );
      return addedGoal;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    clearGoalList: (state) => {
      state.goalList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.goalList = action.payload;
        state.error = null;
        console.log("Goals fetched successfully:", state.goalList);
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.error =
          action.error.message || "There was an error while fetching goal list";
      })

      .addCase(updateGoal.fulfilled, (state, action) => {
        console.log("Goal updated successfully:", action.payload);
        state.error = null;

        const updatedGoal = action.payload;
        //1. If changes were made in month or year, then this goal should not be listed:
        state.goalList = state.goalList.filter((goal) => {
          if (goal.id === updatedGoal.id) {
            return (
              goal.month === updatedGoal.month && goal.year === updatedGoal.year
            );
          }
          return true;
        });
        //2. If no changes were made in month and year (the updated goal is still in goalList), then update it in the goalList:
        state.goalList = state.goalList.map((goal) =>
          goal.id === updatedGoal.id ? updatedGoal : goal,
        );

        console.log("Updated Goal List:", state.goalList);
      })

      .addCase(updateGoal.rejected, (state, action) => {
        state.error =
          action.error.message ||
          "There was an error while trying to update goal (reducer)...";
      })

      .addCase(deleteGoal.fulfilled, (state, action) => {
        console.log("Goal deleted successfully:", action.payload);
        state.error = null;
        state.goalList = state.goalList.filter(
          (goal) => goal.id !== action.payload.id,
        ); //update goal list (exclude deleted goal)
        console.log("Updated goal list", state.goalList);
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.error =
          action.error.message || "There was an error while deleting goal...";
      })

      .addCase(addGoal.fulfilled, (state, action) => {
        console.log("Goal added successfully:", action.payload);
        state.error = null;
        state.goalList = [...state.goalList, action.payload]; //add new goal to the list
        console.log("Updated task list", state.goalList);
      })
      .addCase(addGoal.rejected, (state, action) => {
        state.error =
          action.error.message || "There was an error while adding goal...";
      });
  },
});

export const { clearGoalList } = goalsSlice.actions;
export default goalsSlice.reducer;
