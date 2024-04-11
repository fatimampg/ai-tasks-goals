import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./store/authSlice";
import tasksReducer from "./store/tasksSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
