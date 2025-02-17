import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import {quizApi} from "./api";
import {studentApi} from "./studentApi";
import {questionsApi} from "./questionsApi";
import {questionsDetailApi} from "./questionsDetailApi";
import {videoApi} from "./videoApi";
import {groupApi} from "./groupApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [quizApi.reducerPath]: quizApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer,
    [questionsApi.reducerPath]: questionsApi.reducer,
    [questionsDetailApi.reducerPath]: questionsDetailApi.reducer,
    [videoApi.reducerPath]: questionsDetailApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(quizApi.middleware, groupApi.middleware,studentApi.middleware,
          questionsApi.middleware,questionsDetailApi.middleware,questionsDetailApi.middleware,videoApi.middleware,),
});

export default store;
