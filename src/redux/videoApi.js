import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./api";

export const videoApi = createApi({
    reducerPath: "videoApi",
    baseQuery: customBaseQuery, // Используем кастомный базовый запрос
    endpoints: (builder) => ({
        getVideos: builder.query({
            query: () => "videos", // Путь для получения списка видео
        }),
        getVideoById: builder.query({
            query: (id) => `videos/${id}/`, // Путь для получения видео по id
        }),
    }),
});

export const {
    useGetVideosQuery,
    useGetVideoByIdQuery,
} = videoApi;
