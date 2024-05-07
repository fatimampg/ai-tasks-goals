import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { Goal } from "../types";

interface GoalsListState {
  goalList: Goal[];
  message: string | null;
  typeMessage: "success" | "error" | null;
  messageCounter: number;
  isLoading: boolean;
}

const initialState: GoalsListState = {
  goalList: [],
  message: null,
  typeMessage: null,
  messageCounter: 0,
  isLoading: false,
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

//Update the status of all goals (based on the result of the AI progress analysis):
export const updateGoalListStatus = createAsyncThunk(
  "goal/updateGoalListStatus",
  async (params: Goal[], { getState, rejectWithValue }) => {
    // in params is receiving updatedTaskStatusList
    try {
      const state = getState() as RootState;

      if (!state || !state.auth || !state.auth.header) {
        throw new Error("Authentication header not found in state");
      }
      const { header } = state.auth;

      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_AUTH_URL}/api//goallist`,
        { data: params },
        { headers: header },
      );

      const updatedGoalList = response.data;

      return updatedGoalList;
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
    clearMessageCounter: (state) => {
      state.messageCounter = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.goalList = action.payload;
        state.message = null;
        state.typeMessage = null;
        state.isLoading = false;
        state.messageCounter = state.messageCounter + 1;
        console.log("Goals fetched successfully:", state.goalList);
      })
      .addCase(fetchGoals.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        console.log("Goals not fetched", action.error.message);
        state.message = "No goals were found for this month.";
        state.typeMessage = "error";
        state.isLoading = false;
      })

      .addCase(updateGoal.fulfilled, (state, action) => {
        console.log("Goal updated successfully:", action.payload);
        state.message = "Goal successfully updated.";
        state.typeMessage = "success";
        state.messageCounter = state.messageCounter + 1;
        state.isLoading = false;
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
      .addCase(updateGoal.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateGoal.rejected, (state, action) => {
        console.log("Goal not updated", action.error.message);
        state.message = "Goal was not updated, please try again.";
        state.typeMessage = "error";
        state.messageCounter = state.messageCounter + 1;
        state.isLoading = false;
      })

      .addCase(deleteGoal.fulfilled, (state, action) => {
        console.log("Goal deleted successfully:", action.payload);
        state.message = "Goal successfully deleted.";
        state.typeMessage = "success";
        state.messageCounter = state.messageCounter + 1;
        state.isLoading = false;
        state.goalList = state.goalList.filter(
          (goal) => goal.id !== action.payload.id,
        ); //update goal list (exclude deleted goal)
        console.log("Updated goal list", state.goalList);
      })
      .addCase(deleteGoal.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        console.log("Goal not deleted", action.error.message);
        state.message = "Goal not deleted, please try again later.";
        state.isLoading = false;
        state.typeMessage = "error";
        state.isLoading = false;
      })

      .addCase(addGoal.fulfilled, (state, action) => {
        console.log("Goal added successfully:", action.payload);
        state.message = "Goal successfully added.";
        state.typeMessage = "success";
        state.messageCounter = state.messageCounter + 1;
        state.isLoading = false;
        state.goalList = [...state.goalList, action.payload]; //add new goal to the list
        console.log("Updated task list", state.goalList);
      })
      .addCase(addGoal.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(addGoal.rejected, (state, action) => {
        console.log("Goal not added", action.error.message);
        state.message = "Goal not added. Please try again later.";
        state.typeMessage = "error";
        state.isLoading = false;
      })

      .addCase(updateGoalListStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("Goal status (list) updated successfully:", action.payload);

        //Ensure that only tasks between gte and lte are shown after saving task progress:
        state.goalList.forEach((goalStoredRedux) => {
          const updatedGoalStatus = action.payload.find(
            (updatedGoal: Goal) => updatedGoal.id === goalStoredRedux.id,
          );
          if (updatedGoalStatus) {
            Object.assign(goalStoredRedux, updatedGoalStatus);
          }
        });
        state.message = "Goal progress status was successfully updated.";
        state.typeMessage = "success";
        state.messageCounter = state.messageCounter + 1;
      })
      .addCase(updateGoalListStatus.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateGoalListStatus.rejected, (state, action) => {
        console.log(
          "Goal progress status was not updated.",
          action.error.message,
        );
        state.message =
          "The goal progress status was not updated following the recent AI analysis. Please try to save the results again.";
        state.typeMessage = "error";
        state.messageCounter = state.messageCounter + 1;
        state.isLoading = false;
      });
  },
});

export const { clearGoalList, clearMessageCounter } = goalsSlice.actions;
export default goalsSlice.reducer;
