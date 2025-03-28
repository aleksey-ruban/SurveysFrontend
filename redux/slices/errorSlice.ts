import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorState } from "../types/errorTypes";

const initialState: ErrorState = {
    loginError: null,
    resetPasswordError: null,
    registerError: null,
    fetchSurveysError: null,
    fetchSurveyResultError: null,
    closeSurveyError: null,
    deleteSurveyError: null,
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
        setFetchSurveyResultError(state, action: PayloadAction<string>) {
            state.fetchSurveyResultError = action.payload;
        },
        setCloseSurveyError(state, action: PayloadAction<string>) {
            state.closeSurveyError = action.payload;
        },
        setDeleteSurveyError(state, action: PayloadAction<string>) {
            state.deleteSurveyError = action.payload;
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
        clearFetchSurveyResultError(state) {
            state.fetchSurveyResultError = null;
        },
        clearCloseSurveyError(state) {
            state.closeSurveyError = null;
        },
        clearDeleteSurveyError(state) {
            state.deleteSurveyError = null;
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
    setFetchSurveyResultError,
    setCloseSurveyError,
    setDeleteSurveyError,
    clearLoginError,
    clearResetPasswordError,
    clearRegisterError,
    clearFetchSurveysError,
    clearFetchSurveyResultError,
    clearCloseSurveyError,
    clearDeleteSurveyError,
    clearAllErrors,
} = errorSlice.actions;

export default errorSlice.reducer;
