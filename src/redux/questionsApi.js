import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./api";

export const questionsApi = createApi({
    reducerPath: "questionsApi",
    baseQuery: customBaseQuery,
    endpoints: (builder) => ({
        getQuestions: builder.query({
            query: () => "topics/",
        }),
        createQuestion: builder.mutation({
            query: (newQuestion) => ({
                url: "topics/",
                method: "POST",
                body: newQuestion,
            }),
        }),
        getQuestionById: builder.query({
            query: (id) => `topics/${id}/`,
        }),
        updateQuestion: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `topics/${id}/`,
                method: "PATCH",
                body: data,
            }),
        }),
        deleteQuestion: builder.mutation({
            query: (id) => ({
                url: `topics/${id}/`,
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
} = questionsApi;
