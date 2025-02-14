import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('access_token') || null,
        user: null,
    },
    reducers: {
        setAuthData: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem('access_token', action.payload.token);
            localStorage.setItem('refresh_token', action.payload.refreshToken); // Сохраняем refresh_token
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        },
    },
});

export const { setAuthData, logout } = authSlice.actions;
export default authSlice.reducer;
