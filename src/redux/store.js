import { configureStore } from "@reduxjs/toolkit";
import { groupApi } from "./groupApi";
import authReducer from "./slices/authSlice";
import {quizApi} from "./api";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [quizApi.reducerPath]: quizApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer, // Добавляем groupApi
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(quizApi.middleware, groupApi.middleware),
});

export default store;
