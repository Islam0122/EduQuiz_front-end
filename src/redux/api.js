import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const quizApi = createApi({
  reducerPath: "quizApi",
  baseQuery: fetchBaseQuery({ baseUrl: "Ислам байкеден Base url" }),
  endpoints: (builder) => ({
    getQuestions: builder.query({
      query: (language) => `/questions?lang=${language}`,
    }),
    getStudents: builder.query({
      query: (language) => `/questions?lang=${language}`,
    }),
    
  }),
});

export const { useGetQuestionsQuery } = quizApi;