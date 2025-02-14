import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL, // Базовый URL из .env
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token; // Получаем токен из store
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const groupApi = createApi({
    reducerPath: "groupApi",
    baseQuery,
    endpoints: (builder) => ({
        getGroups: builder.query({
            query: () => "groups/",
        }),
        createGroup: builder.mutation({
            query: (newGroup) => ({
                url: "groups/",
                method: "POST",
                body: newGroup,
            }),
        }),
        getGroupById: builder.query({
            query: (id) => `groups/${id}/`,
        }),
        updateGroup: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `groups/${id}/`,
                method: "PATCH",
                body: data,
            }),
        }),
        deleteGroup: builder.mutation({
            query: (id) => ({
                url: `groups/${id}/`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetGroupsQuery,
    useCreateGroupMutation,
    useGetGroupByIdQuery,
    useUpdateGroupMutation,
    useDeleteGroupMutation,
} = groupApi;
