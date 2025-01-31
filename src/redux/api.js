import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_BASE_URL, 
});

export const quizApi = createApi({
  reducerPath: 'quizApi',
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'login/', 
        method: 'POST',
        body: credentials,
      }),
    }),
  }),  
});

export const { useLoginMutation } = quizApi;
