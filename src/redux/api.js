import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Функция для обновления токена
const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    throw new Error("Refresh token отсутствует");
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}token/refresh/`, {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }), // ❗ Исправлено на 'refresh'
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    localStorage.setItem("access_token", data.access);
    return data.access; // возвращаем новый access_token
  } catch (error) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    throw new Error("Ошибка обновления токена");
  }
};

// Кастомный fetchBaseQuery с обработкой 401 ошибки
const customBaseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    try {
      const newAccessToken = await refreshToken();

      result = await baseQuery(
          {
            ...args,
            headers: {
              ...args.headers,
              Authorization: `Bearer ${newAccessToken}`, // Используем новый токен
            },
          },
          api,
          extraOptions
      );
    } catch (error) {
      return { error: { status: 401, message: "Ошибка обновления токена" } };
    }
  }

  return result;
};

export const quizApi = createApi({
  reducerPath: "quizApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "login/",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: (refreshToken) => ({
        url: "logout/",
        method: "POST",
        body: { refresh: refreshToken },
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = quizApi;
