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
    deleteAccountError: null,
    fetchUserSurveysError: null,
    fetchSurveyUser: null,
    createSurveyError: null,
    submitSurveyAnswerError: null,
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
        setDeleteAccountError(state, action: PayloadAction<string>) {
            state.deleteAccountError = action.payload;
        },
        setFetchUserSurveysError(state, action: PayloadAction<string>) {
            state.fetchUserSurveysError = action.payload;
        },
        setFetchSurveyUser(state, action: PayloadAction<string>) {
            state.fetchSurveyUser = action.payload;
        },
        setCreateSurveyError(state, action: PayloadAction<string>) {
            state.createSurveyError = action.payload;
        },
        setSubmitSurveyAnswerError(state, action: PayloadAction<string>) {
            state.submitSurveyAnswerError = action.payload;
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
        clearDeleteAccountError(state) {
            state.deleteAccountError = null;
        },
        clearFetchUserSurveysError(state) {
            state.fetchUserSurveysError = null;
        },
        clearFetchSurveyUser(state) {
            state.fetchSurveyUser = null;
        },
        clearAllErrors(state) {
            Object.assign(state, initialState);
        },
        clearCreateSurveyError(state) {
            state.createSurveyError = null;
        },
        clearSubmitSurveyAnswerError(state) {
            state.submitSurveyAnswerError = null;
        }
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
    setDeleteAccountError,
    setFetchUserSurveysError,
    setFetchSurveyUser,
    setCreateSurveyError,
    setSubmitSurveyAnswerError,
    clearLoginError,
    clearResetPasswordError,
    clearRegisterError,
    clearFetchSurveysError,
    clearFetchSurveyResultError,
    clearCloseSurveyError,
    clearDeleteSurveyError,
    clearDeleteAccountError,
    clearFetchUserSurveysError,
    clearFetchSurveyUser,
    clearAllErrors,
    clearCreateSurveyError,
    clearSubmitSurveyAnswerError,
} = errorSlice.actions;

export default errorSlice.reducer;
