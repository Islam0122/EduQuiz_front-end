import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Базовый запрос с добавлением заголовков авторизации
export const baseQuery = fetchBaseQuery({
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
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    throw new Error("Refresh token отсутствует");
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}token/refresh/`, {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Ошибка обновления токена");
    }

    localStorage.setItem("access_token", data.access);  // Сохраняем новый access_token
    return data.access;  // Возвращаем новый токен
  } catch (error) {
    // Удаляем токены и перенаправляем на страницу входа
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";  // Перенаправляем на страницу логина
    throw new Error("Ошибка обновления токена");
  }
};

// Кастомный базовый запрос с обработкой ошибки 401
export const customBaseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    try {
      const newAccessToken = await refreshToken();

      // Перезапрос с новым токеном
      result = await baseQuery(
          {
            ...args,
            headers: {
              ...args.headers,
              Authorization: `Bearer ${newAccessToken}`,  // Добавляем новый токен
            },
          },
          api,
          extraOptions
      );
    } catch (error) {
      // Если обновление токена не удалось, возвращаем ошибку
      return { error: { status: 401, message: "Ошибка обновления токена" } };
    }
  }

  return result;
};

// Создание API с Redux Toolkit
export const quizApi = createApi({
  reducerPath: "quizApi",
  baseQuery: customBaseQuery,  // Используем кастомный базовый запрос
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "login/",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          return {
            url: "logout/",
            method: "POST",
            body: { refresh: refreshToken },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Добавляем токен
            },
          };
        }
        return {
          url: "logout/",
          method: "POST",
        };
      },
    }),
  }),
});

// Экспорт хуков для работы с мутациями
export const { useLoginMutation, useLogoutMutation } = quizApi;
