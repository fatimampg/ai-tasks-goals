import { createSlice } from "@reduxjs/toolkit";

interface SearchDatesState {
  taskDates: { gte: Date; lte: Date } | null;
  goalsMonth: { month: number; year: number } | null;
  error: string | null;
}

const initialState: SearchDatesState = {
  taskDates: null,
  goalsMonth: null,
  error: null,
};

const searchDatesSlice = createSlice({
  name: "searchDates",
  initialState,
  reducers: {
    storedTaskDateSearch: (state, action) => {
      state.taskDates = action.payload;
    },
    storedGoalMonthSearch: (state, action) => {
      state.goalsMonth = action.payload;
    },
  },
});

export const { storedTaskDateSearch, storedGoalMonthSearch } =
  searchDatesSlice.actions;
export default searchDatesSlice.reducer;
