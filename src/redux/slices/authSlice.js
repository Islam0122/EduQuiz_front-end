import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token') || null, // Прочитать токен из localStorage при инициализации
        user: null,
    },
    reducers: {
        setAuthData: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            // Сохранить токен в localStorage
            localStorage.setItem('token', action.payload.token);
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            // Удалить токен из localStorage при выходе
            localStorage.removeItem('token');
        },
    },
});

export const { setAuthData, logout } = authSlice.actions;
export default authSlice.reducer;
