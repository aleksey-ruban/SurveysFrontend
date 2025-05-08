import axios from "axios";
import Constants from 'expo-constants';

const domain = Constants.expoConfig?.extra?.API_DOMAIN;
export const baseURL = `${domain}:8000/api/`;
export const mediaURL: string = `${domain}:8000/media/uploads/`;

const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 4000,
    withCredentials: true,
});

export default api;