import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./api";

export const questionsDetailApi = createApi({
    reducerPath: "questionsDetailApi",
    baseQuery: customBaseQuery,
    endpoints: (builder) => ({
        getQuestions: builder.query({
            query: () => "questions/",
        }),
        createQuestion: builder.mutation({
            query: (newQuestion) => ({
                url: "questions/",
                method: "POST",
                body: newQuestion,
            }),
        }),
        getQuestionById: builder.query({
            query: (id) => `questions/${id}/`,
        }),
        
        updateQuestion: builder.mutation({
            query: ({ id, data }) => ({
                url: `/questions/${id}/`,
                method: 'PATCH',
                body: data,
            }),
        }),
        deleteQuestion: builder.mutation({
            query: (id) => ({
                url: `questions/${id}/`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetQuestionsQuery,
    useCreateQuestionMutation,
    useGetQuestionByIdQuery,
    useUpdateQuestionMutation,
    useDeleteQuestionMutation,
} = questionsDetailApi;
