import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import api from "../../utils/api";
import { AuthState, LoginPayload, RegisterPayload, User, UserRole } from "../types/authTypes";
import axios from "axios";
import { setDeleteAccountError, setLoginError, setRegisterError, setResetPasswordError } from "./errorSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        login(state, action: PayloadAction<{ token: string }>) {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.loading = false;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            state.loading = false;
            AsyncStorage.removeItem('authToken');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.loading = false;
                AsyncStorage.setItem('authToken', action.payload.token);
            })
            .addCase(loginUser.rejected, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.loading = false;
                AsyncStorage.removeItem('authToken');
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.loading = false;
                AsyncStorage.setItem('authToken', action.payload.token);
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
                state.loading = false;
                AsyncStorage.removeItem('authToken');
            })
            .addCase(getAccount.fulfilled, (state, action) => {
                let userRole: UserRole;
                if (action.payload.role == 'respondent') {
                    userRole = UserRole.USER;
                } else if (action.payload.role == 'creator') {
                    userRole = UserRole.CREATOR;
                } else {
                    return;
                }
                let user: User = {
                    id: action.payload.id,
                    email: action.payload.email,
                    name: action.payload.name,
                    role: userRole,
                };
                state.user = user;
            });
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

export const loadUserFromStorage = createAsyncThunk(
    "auth/loadUserFromStorage",
    async (_, { dispatch }) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            dispatch(login({ token }));
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData: LoginPayload, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post("/accounts/login", userData);
            return {
                token: response.data.token,
                email: userData.email,
            };
        } catch (error) {
            let errorMessage = "Ошибка авторизации";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data["error"] || "Ошибка сервера";
            }

            dispatch(setLoginError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                throw new Error("Нет токена");
            }

            const response = await api.post(
                "/accounts/logout",
                {},
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            let errorMessage = "Ошибка выхода из аккаунта";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data["error"] || "Ошибка сервера";
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
            const response = await api.post("accounts/register", formData);
            return {
                token: response.data.token,
                email: formData.email,
            };
        } catch (error) {
            let errorMessage = "Ошибка регистрации";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data["error"] || "Ошибка сервера";
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
            const response = await api.post("/accounts/request-password-reset", formData);
            return response.data;
        } catch (error) {
            let errorMessage = "Ошибка восстановления пароля";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data["email"] || "Ошибка сервера";
            }

            dispatch(setResetPasswordError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

export const deleteAccount = createAsyncThunk(
    "auth/deleteAccount",
    async (_, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                throw new Error("Нет токена");
            }

            const response = await api.delete(
                "/accounts/delete-account",
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            dispatch(logout());
            return response.data;
        } catch (error) {
            let errorMessage = "Ошибка удаления аккаунта";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data["error"] || "Ошибка сервера";
            }

            dispatch(setDeleteAccountError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

export const getAccount = createAsyncThunk(
    "auth/getAccount",
    async (_, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                throw new Error("Нет токена");
            }

            const response = await api.get(
                "/accounts/me",
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            return {
                id: response.data.id,
                email: response.data.email,
                name: response.data.name,
                role: response.data.role,
            };
        } catch (error) {
            let errorMessage = "Ошибка получения аккаунта";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data["error"] || "Ошибка сервера";
            }

            dispatch(setDeleteAccountError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

export const selectUser = (state: RootState) => state.auth.user;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;