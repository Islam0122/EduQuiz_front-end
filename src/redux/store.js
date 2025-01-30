import { configureStore } from "@reduxjs/toolkit";
import { quizApi } from "./api";
import quizReducer from "./slices/quizSlice";

const store = configureStore({
  reducer: {
    quiz: quizReducer,
    [quizApi.reducerPath]: quizApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(quizApi.middleware),
});

export default store;
