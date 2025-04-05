import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SurveyUserState, SurveyWithStatus } from "../types/surveyUserTypes";
import api from "@/utils/api";
import axios from "axios";
import { setFetchSurveyUser } from "./errorSlice";
import { surveys } from "./db";

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
        { rejectWithValue, dispatch }
    ) => {
        try {
            // const response = await api.get(`/user/surveys/${url}`);
            // dispatch(setSurveyUser(response.data));
            // return response.data;

            dispatch(setSurveyUser({survey: surveys.at(0)!, isCompleted: true}));
            return {survey: surveys.at(0)!, isCompleted: false};
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

export const {
    setSurveyUser,
} = surveyUserSlice.actions;

export default surveyUserSlice.reducer;