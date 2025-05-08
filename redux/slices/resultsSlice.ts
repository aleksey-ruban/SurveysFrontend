import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResultsState, SurveyResult } from "../types/resultsTypes";
import api from "@/utils/api";
import { setCloseSurveyError, setDeleteSurveyError, setFetchSurveyResultError } from "./errorSlice";
import axios from "axios";
import { closeSurveyRequest, deleteSurveyRequest } from "./surveySlice";
import { RootState } from "../store";

const initialState: ResultsState = {
    surveyResult: null,
    loading: false,
};

const restultsSlice = createSlice({
    name: 'results',
    initialState,
    reducers: {
        setResult(state, action: PayloadAction<SurveyResult>) {
            state.surveyResult = action.payload;
            state.loading = false;
        },
        closeSurvey(state, action: PayloadAction<{ id: number; isClosed: boolean }>) {
            if (action.payload.id !== -1 && state.surveyResult) {
                state.surveyResult.isClosed = action.payload.isClosed;
            }
        },
        deleteSurvey(state) {
            state.surveyResult = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchResults.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchResults.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchResults.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const fetchResults = createAsyncThunk(
    "surveys-result/fetchResults",
    async (
        id: number, 
        { rejectWithValue, dispatch, getState }
    ) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                throw new Error("Нет токена");
            }

            const response = await api.get(
                `creators/survey-result/${id}`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            dispatch(setResult(response.data));
            return response.data;
        } catch (error) {
            let errorMessage = "Ошибка загрузки результатов";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || "Ошибка сервера";
            }
            
            dispatch(setFetchSurveyResultError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

export const closeSurveyRequestFromResults = createAsyncThunk(
    "surveys-result/closeResults",
    async (
        params: { id: number, isClosed: boolean },
        { rejectWithValue, dispatch }
    ) => {
        try {
            dispatch(closeSurveyRequest({id: params.id, isClosed: params.isClosed}));
            
            return true;
        } catch (error) {
            let errorMessage = "Ошибка в запрсое к серверу";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || "Ошибка сервера";
            }
            
            dispatch(setCloseSurveyError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

export const deleteSurveyFromResults = createAsyncThunk(
    "surveys-result/deleteResults",
    async (
        id: number, 
        { rejectWithValue, dispatch }
    ) => {
        try { 
            const result = await dispatch(deleteSurveyRequest(id));
            if (deleteSurveyRequest.fulfilled.match(result)) {
                dispatch(deleteSurvey());
                return true;
            } else {
                return false;
            }
        } catch (error) {
            let errorMessage = "Ошибка удаления опроса";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || "Ошибка сервера";
            }
            
            dispatch(setDeleteSurveyError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

export const {
    setResult,
    closeSurvey,
    deleteSurvey,
} = restultsSlice.actions;

export default restultsSlice.reducer;