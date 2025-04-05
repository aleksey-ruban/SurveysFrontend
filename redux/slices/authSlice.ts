import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import api from "../../utils/api";
import { AuthState, LoginPayload, RegisterPayload } from "../types/authTypes";
import axios from "axios";
import { setDeleteAccountError, setLoginError, setRegisterError, setResetPasswordError } from "./errorSlice";

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<any>) {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.token = action.payload.token;
            state.loading = false;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.loading = false;
            })
            .addCase(loginUser.rejected, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.loading = false;
            });
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData: LoginPayload, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post("/login", userData);
            return response.data;
        } catch (error) {
            let errorMessage = "Ошибка авторизации";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || "Ошибка сервера";
            }

            dispatch(setLoginError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/register",
    async (formData: RegisterPayload, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post("/register", formData);
            return response.data;
        } catch (error) {
            let errorMessage = "Ошибка регистрации";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || "Ошибка сервера";
            }

            dispatch(setRegisterError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (formData: { email: string }, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post("/reset-password", formData);
            return response.data;
        } catch (error) {
            let errorMessage = "Ошибка восстановления пароля";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || "Ошибка сервера";
            }

            dispatch(setResetPasswordError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

export const deleteAccount = createAsyncThunk(
    "auth/deleteAccount",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.delete("/delete-account");
            dispatch(logout());
            return response.data;
        } catch (error) {
            let errorMessage = "Ошибка удаления аккаунта";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || "Ошибка сервера";
            }
            
            dispatch(setDeleteAccountError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

export const selectUser = (state: RootState) => state.auth.user;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;