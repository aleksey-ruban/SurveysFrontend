import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SurveyUserResult, SurveyUserState, SurveyWithStatus } from "../types/surveyUserTypes";
import api from "@/utils/api";
import axios, { HttpStatusCode } from "axios";
import { setFetchSurveyUser, setSubmitSurveyAnswerError } from "./errorSlice";
import { RootState } from "../store";

const initialState: SurveyUserState = {
    survey: null,
    isCompleted: null,
    loading: false,
};

const surveyUserSlice = createSlice({
    name: 'surveyUser',
    initialState,
    reducers: {
        setSurveyUser(state, action: PayloadAction<SurveyWithStatus>) {
            state.survey = action.payload.survey;
            state.isCompleted = action.payload.isCompleted;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSurveyUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSurveyUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchSurveyUser.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const fetchSurveyUser = createAsyncThunk(
    "surveyUser/fetchSurveyUser",
    async (
        url: string, 
        { rejectWithValue, dispatch, getState }
    ) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                throw new Error("Нет токена");
            }

            const response = await api.get(
                `/user/survey/${url}`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            dispatch(setSurveyUser(response.data));
            return response.data;
        } catch (error) {
            let errorMessage = "Ошибка загрузки опросов";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || "Ошибка сервера";
            }
            
            dispatch(setFetchSurveyUser(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

export const submitSurveyUser = createAsyncThunk(
    "surveyUser/submitSurveyUser",
    async (
        result: SurveyUserResult, 
        { rejectWithValue, dispatch, getState }
    ) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                throw new Error("Нет токена");
            }

            const response = await api.post(
                "/user/survey/submit-response",
                result,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            return response.status == HttpStatusCode.Created
        } catch (error) {
            let errorMessage = "Ошибка загрузки ответа";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || "Ошибка сервера";
            }
            
            dispatch(setSubmitSurveyAnswerError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

export const {
    setSurveyUser,
} = surveyUserSlice.actions;

export default surveyUserSlice.reducer;