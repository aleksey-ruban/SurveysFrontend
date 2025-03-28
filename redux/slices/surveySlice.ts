import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Survey, SurveysState } from "../types/surveysTypes";
import api from "@/utils/api";
import axios from "axios";
import { setCloseSurveyError, setDeleteSurveyError, setFetchSurveysError } from "./errorSlice";
import { surveys } from "./db";
import { closeSurvey as closeSurveyAction } from "./resultsSlice"

const initialState: SurveysState = {
    surveys: [],
    loading: false,
};

const surveysSlice = createSlice({
    name: 'surveys',
    initialState,
    reducers: {
        setSurveys(state, action: PayloadAction<Survey[]>) {
            Object.assign(state.surveys, action.payload);
        },
        addSurvey(state, action: PayloadAction<Survey>) {
            state.surveys.push(action.payload);
        },
        closeSurvey(state, action: PayloadAction<{ id: number; updatedSurvey: Partial<Survey> }>) {
            const index = state.surveys.findIndex(surveys => surveys.id === action.payload.id);
            if (index !== -1) {
                state.surveys[index] = { ...state.surveys[index], ...action.payload.updatedSurvey };
            }
        },
        deleteSurvey(state, action: PayloadAction<number>) {
            state.surveys = state.surveys.filter(surveys => surveys.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSurveys.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSurveys.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchSurveys.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const fetchSurveys = createAsyncThunk(
    "surveys/fetchSurveys",
    async (
        filters: { status?: string; search?: string; sort?: string }, 
        { rejectWithValue, dispatch }
    ) => {
        try {
            const queryParams = new URLSearchParams();
            
            if (filters.status) queryParams.append("status", filters.status);
            if (filters.search) queryParams.append("search", filters.search);
            if (filters.sort) queryParams.append("sort", filters.sort);

            // const response = await api.get(`/surveys?${queryParams.toString()}`);

            // dispatch(setSurveys(response.data));
            // return response.data;

            dispatch(setSurveys(surveys));
            return surveys;
        } catch (error) {
            let errorMessage = "Ошибка загрузки опросов";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || "Ошибка сервера";
            }
            
            dispatch(setFetchSurveysError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

export const closeSurveyRequest = createAsyncThunk(
    "surveys/closeSurvey",
    async (
        params: { id: number, isClosed: boolean },
        { rejectWithValue, dispatch }
    ) => {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append("isClosed", params.isClosed ? '1' : '0');
        
            // const response = await api.get(`/surveys/${params.id}?${queryParams.toString()}`);
            // dispatch(closeSurvey(response.data));
            // dispatch(closeSurveyAction({id: 1, updatedSurveyResult: { isClosed: params.isClosed }}));
            // return response.data;

            dispatch(closeSurvey({id: 1, updatedSurvey: { isClosed: !params.isClosed }}));
            dispatch(closeSurveyAction({id: 1, updatedSurveyResult: { isClosed: !params.isClosed }}));
            return {id: 1, updatedSurvey: { isClosed: true }};
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

export const deleteSurveyRequest = createAsyncThunk(
    "surveys/deleteSurvey",
    async (
        id: number,
        { rejectWithValue, dispatch }
    ) => {
        try {        
            // const response = await api.get(`/surveys/${id}`);
            // dispatch(deleteSurvey(response.data));
            // return response.data;

            dispatch(deleteSurvey(id));
            return {id: 1, updatedSurvey: { isClosed: true }};
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
    setSurveys,
    addSurvey,
    closeSurvey,
    deleteSurvey,
} = surveysSlice.actions;

export default surveysSlice.reducer;