import { configureStore } from "@reduxjs/toolkit";
import { groupApi } from "./groupApi";
import authReducer from "./slices/authSlice";
import {quizApi} from "./api";
import {studentApi} from "./studentApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [quizApi.reducerPath]: quizApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(quizApi.middleware, groupApi.middleware,studentApi.middleware,),
});

export default store;
