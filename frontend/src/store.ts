import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./store/authSlice";
import tasksReducer from "./store/tasksSlice";
import goalsReducer from "./store/goalsSlice";
import dateSearchReducer from "./store/searchDatesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    goals: goalsReducer,
    searchDates: dateSearchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["searchDates/storedTaskDateSearch"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
