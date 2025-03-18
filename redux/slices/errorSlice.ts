import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorState } from "../types/errorTypes";

const initialState: ErrorState = {
    loginError: null,
    resetPasswordError: null,
    registerError: null,
    fetchSurveysError: null,
};

const errorSlice = createSlice({
    name: "error",
    initialState,
    reducers: {
        setLoginError(state, action: PayloadAction<string>) {
            state.loginError = action.payload;
        },
        setResetPasswordError(state, action: PayloadAction<string>) {
            state.resetPasswordError = action.payload;
        },
        setRegisterError(state, action: PayloadAction<string>) {
            state.registerError = action.payload;
        },
        setFetchSurveysError(state, action: PayloadAction<string>) {
            state.fetchSurveysError = action.payload;
        },
        clearLoginError(state) {
            state.loginError = null;
        },
        clearResetPasswordError(state) {
            state.resetPasswordError = null;
        },
        clearRegisterError(state) {
            state.registerError = null;
        },
        clearFetchSurveysError(state) {
            state.fetchSurveysError = null;
        },
        clearAllErrors(state) {
            Object.assign(state, initialState);
        },
    },
});

export const {
    setLoginError,
    setResetPasswordError,
    setRegisterError,
    setFetchSurveysError,
    clearLoginError,
    clearResetPasswordError,
    clearRegisterError,
    clearFetchSurveysError,
    clearAllErrors,
} = errorSlice.actions;

export default errorSlice.reducer;
