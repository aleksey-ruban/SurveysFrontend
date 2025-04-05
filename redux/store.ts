import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import surveysReducer from './slices/surveySlice';
import errorReducer from './slices/errorSlice';
import resultReducer from './slices/resultsSlice';
import surveyUserReducer from './slices/surveyUserSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        survey: surveysReducer,
        error: errorReducer,
        results: resultReducer,
        surveyUser: surveyUserReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
