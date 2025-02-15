import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./api";

export const studentApi = createApi({
    reducerPath: "studentApi",
    baseQuery: customBaseQuery,  // Используем кастомный базовый запрос
    endpoints: (builder) => ({
        getStudents: builder.query({
            query: () => "students/",
        }),
        createStudent: builder.mutation({
            query: (newStudent) => ({
                url: "students/",
                method: "POST",
                body: newStudent,
            }),
        }),
        getStudentById: builder.query({
            query: (id) => `students/${id}/`,
        }),
        updateStudent: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `students/${id}/`,
                method: "PATCH",
                body: data,
            }),
        }),
        deleteStudent: builder.mutation({
            query: (id) => ({
                url: `students/${id}/`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetStudentsQuery,
    useCreateStudentMutation,
    useGetStudentByIdQuery,
    useUpdateStudentMutation,
    useDeleteStudentMutation,
} = studentApi;
