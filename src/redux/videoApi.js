import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./api";

export const videoApi = createApi({
    reducerPath: "videoApi",
    baseQuery: customBaseQuery,
    endpoints: (builder) => ({
        getVideos: builder.query({
            query: () => "videos",
        }),
        getVideoById: builder.query({
            query: (id) => `videos/${id}/`,
        }),
        getVideosCategory: builder.query({
            query: () => "videos_categories",
        }),
        getVideoCategoryId: builder.query({
            query: (id) => `videos_categories/${id}/`,
        }),
    }),
});

export const {
    useGetVideosQuery,
    useGetVideoByIdQuery,
    useGetVideosCategoryQuery,
    useGetVideoCategoryIdQuery,
} = videoApi;
