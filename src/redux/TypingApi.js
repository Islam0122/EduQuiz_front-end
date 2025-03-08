import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./api";

export const typingApi = createApi({
    reducerPath: "typingApi",
    baseQuery: customBaseQuery,
    endpoints: (builder) => ({
        getTypingText: builder.query({
            query: (category) => category ? `texts/?category=${category}` : "texts/",
        }),
        getTypingById: builder.query({
            query: (id) => `texts/${id}`,
        }),
        getTypingTimers: builder.query({
            query: () => "timers/",
        }),
        getTypingTimerById: builder.query({
            query: (id) => `timers/${id}`,
        }),
        getTypingCategories: builder.query({
            query: () => "categories/",
        }),
        getTypingCategoryById: builder.query({
            query: (id) => `categories/${id}`,
        })
    }),
});

export const {
    useGetTypingTextQuery,
    useGetTypingByIdQuery,
    useGetTypingTimersQuery,
    useGetTypingTimerByIdQuery,
    useGetTypingCategoriesQuery,
    useGetTypingCategoryByIdQuery
} = typingApi;
