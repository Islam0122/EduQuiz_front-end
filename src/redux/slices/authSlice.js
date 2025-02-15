import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Создание асинхронного экшена для выхода из системы
export const logoutUser = () => async (dispatch) => {
    try {
        const refreshToken = localStorage.getItem("refresh_token");
        const token = localStorage.getItem("access_token");

        if (refreshToken && token) {
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}logout/`,
                { refresh: refreshToken },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        }
        dispatch(logout());
    } catch (error) {
        console.error("Ошибка при выходе:", error);
    }
};

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: localStorage.getItem("access_token") || null,
        user: null,
    },
    reducers: {
        setAuthData: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem("access_token", action.payload.token);
            localStorage.setItem("refresh_token", action.payload.refreshToken); // Сохраняем refresh_token
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        },
    },
});

export const { setAuthData, logout } = authSlice.actions;
export default authSlice.reducer;
