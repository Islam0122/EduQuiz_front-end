import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Функция для обновления токена
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (refreshToken) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/token/refresh/`, {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      return data.access;  // возвращаем новый access_token
    } catch (error) {
      throw new Error('Ошибка обновления токена');
    }
  } else {
    throw new Error('Refresh token отсутствует');
  }
};

// Кастомный fetchBaseQuery с обработкой ошибки 401 и обновлением токена
const customBaseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    try {
      const newAccessToken = await refreshToken();
      // Обновляем access_token в localStorage
      localStorage.setItem('access_token', newAccessToken);

      // Повторяем запрос с новым access_token
      args.headers = {
        ...args.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };

      return await baseQuery(args, api, extraOptions); // повторно выполняем запрос
    } catch (error) {
      return { error: { status: 401, message: 'Ошибка обновления токена' } };
    }
  }

  return result;
};

export const quizApi = createApi({
  reducerPath: 'quizApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'login/', // эндпоинт для логина
        method: 'POST',
        body: credentials,
      }),
    }),
    // Вы можете добавить другие эндпоинты здесь
  }),
});

export const { useLoginMutation } = quizApi;
