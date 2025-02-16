import { configureStore } from "@reduxjs/toolkit";
import { groupApi } from "./groupApi";
import authReducer from "./slices/authSlice";
import {quizApi} from "./api";
import {studentApi} from "./studentApi";
import {questionsApi} from "./questionsApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [quizApi.reducerPath]: quizApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer,
    [questionsApi.reducerPath]: questionsApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(quizApi.middleware, groupApi.middleware,studentApi.middleware, questionsApi.middleware,),
});

export default store;
