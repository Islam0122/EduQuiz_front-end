import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./api";

export const TestResultsApi = createApi({
    reducerPath: "TestResultsApi",
    baseQuery: customBaseQuery,
    endpoints: (builder) => ({
        // Отправка OTP
        sendOtp: builder.mutation({
            query: (email) => ({
                url: "send-otp/",
                method: "POST",
                body: { email },
            }),
        }),
        // Подтверждение OTP
        verifyOtp: builder.mutation({
            query: ({ email, code }) => ({
                url: "verify-otp/",
                method: "POST",
                body: { email, code },
            }),
        }),
        // Получить список всех тестов
        getResults: builder.query({
            query: () => "tests/",
        }),
        // Получить один результат по id
        getResultById: builder.query({
            query: (id) => `tests/${id}/`,
        }),
        // ✅ Создать новый результат теста (POST)
        createResult: builder.mutation({
            query: (newResult) => ({
                url: "tests/",
                method: "POST",
                body: newResult,
            }),
        }),
    }),
});

export const {
    useSendOtpMutation,
    useVerifyOtpMutation,
    useGetResultsQuery,
    useGetResultByIdQuery,
    useCreateResultMutation,
} = TestResultsApi;
