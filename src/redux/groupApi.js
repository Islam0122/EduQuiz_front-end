import { createApi} from "@reduxjs/toolkit/query/react";
import {customBaseQuery} from "./api";




export const groupApi = createApi({
    reducerPath: "groupApi",
    baseQuery: customBaseQuery,  // Используем кастомный базовый запрос
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