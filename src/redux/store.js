import { configureStore } from "@reduxjs/toolkit";
import { quizApi } from "./api";
import quizReducer from "./slices/quizSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    quiz: quizReducer,
    auth: authReducer, // Добавляем в стор
    [quizApi.reducerPath]: quizApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(quizApi.middleware),
});

export default store;
