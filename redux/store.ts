import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import surveysReducer from './slices/surveySlice';
import errorReducer from './slices/errorSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        survey: surveysReducer,
        error: errorReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
