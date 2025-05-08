import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Survey, SurveysState } from "../types/surveysTypes";
import api from "@/utils/api";
import axios, { HttpStatusCode } from "axios";
import { setCloseSurveyError, setCreateSurveyError, setDeleteSurveyError, setFetchSurveysError, setFetchUserSurveysError } from "./errorSlice";
import { surveys } from "./db";
import { closeSurvey as closeSurveyAction } from "./resultsSlice"
import { RootState } from "../store";
import { useDispatch } from "react-redux";

const initialState: SurveysState = {
    surveys: [],
    userSurveys: [],
    loading: false,
};

const surveysSlice = createSlice({
    name: 'surveys',
    initialState,
    reducers: {
        setSurveys(state, action: PayloadAction<Survey[]>) {
            state.surveys = action.payload;
        },
        setUserSurveys(state, aciton: PayloadAction<Survey[]>) {
            state.userSurveys = aciton.payload;
        },
        closeSurvey(state, action: PayloadAction<{ id: number; isClosed: boolean }>) {
            const index = state.surveys.findIndex(survey => survey.id === action.payload.id);
            if (index !== -1) {
                state.surveys[index].isClosed = action.payload.isClosed;
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
            })
            .addCase(fetchUserSurveys.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserSurveys.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchUserSurveys.rejected, (state) => {
                state.loading = false;
            })
            .addCase(createSurveyRequest.fulfilled, (state, action: PayloadAction<Survey | null>) => {
                if (action.payload) {
                    state.surveys.push(action.payload);
                }
            });
    },
});

export const fetchSurveys = createAsyncThunk(
    "surveys/fetchSurveys",
    async (
        filters: { status?: string; search?: string; sort?: string },
        { rejectWithValue, dispatch, getState }
    ) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                throw new Error("Нет токена");
            }

            const queryParams = new URLSearchParams();

            if (filters.status) queryParams.append("status", filters.status);
            if (filters.search) queryParams.append("search", filters.search);
            if (filters.sort) queryParams.append("sort", filters.sort);

            const response = await api.get(
                `/surveys?${queryParams.toString()}`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            dispatch(setSurveys(response.data));
            return response.data;
        } catch (error) {
            let errorMessage = "Ошибка загрузки опросов";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data["error"] || "Ошибка сервера";
            }

            dispatch(setFetchSurveysError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

export const fetchUserSurveys = createAsyncThunk(
    "surveys/fetchUserSurveys",
    async (
        _,
        { rejectWithValue, dispatch, getState }
    ) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                throw new Error("Нет токена");
            }

            const response = await api.get(
                `/user/surveys`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            dispatch(setUserSurveys(response.data));
            return response.data;
        } catch (error) {
            let errorMessage = "Ошибка загрузки опросов";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data["error"] || "Ошибка сервера";
            }

            dispatch(setFetchUserSurveysError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

export const closeSurveyRequest = createAsyncThunk(
    "surveys/closeSurvey",
    async (
        params: { id: number, isClosed: boolean },
        { rejectWithValue, dispatch, getState }
    ) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                throw new Error("Нет токена");
            }

            const response = await api.patch(
                `creators/toggle-survey/${params.id}`,
                {},
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            dispatch(closeSurvey(response.data));
            dispatch(closeSurveyAction(response.data));
            return response.data;
        } catch (error) {
            let errorMessage = "Ошибка в запрсое к серверу";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data["error"] || "Ошибка сервера";
            }

            dispatch(setCloseSurveyError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

export const createSurveyRequest = createAsyncThunk(
    "surveys/createSurvey",
    async (
        survey: Survey,
        { rejectWithValue, dispatch, getState }
    ) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                throw new Error("Нет токена");
            }

            const response = await api.post(
                "/creators/create-survey",
                survey,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            if (response.status == HttpStatusCode.Created) {
                return survey;
            }
            return null;
        } catch (error) {
            let errorMessage = "Ошибка создания опроса";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data["error"] || 
                error.response.data["nonFieldErrors"]|| "Ошибка сервера";
            }

            dispatch(setCreateSurveyError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

export const deleteSurveyRequest = createAsyncThunk(
    "surveys/deleteSurvey",
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

            const response = await api.delete(
                `creators/delete-survey/${id}`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            dispatch(deleteSurvey(id));
            return response.data;
        } catch (error) {
            let errorMessage = "Ошибка удаления опроса";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data["error"] || "Ошибка сервера";
            }

            dispatch(setDeleteSurveyError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

export const {
    setSurveys,
    setUserSurveys,
    closeSurvey,
    deleteSurvey,
} = surveysSlice.actions;

export default surveysSlice.reducer;