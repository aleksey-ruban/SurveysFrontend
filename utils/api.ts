import axios from "axios";
import Constants from 'expo-constants';

const domain = Constants.expoConfig?.extra?.API_DOMAIN;
const frontDomain = Constants.expoConfig?.extra?.FRONT_DOMAIN;
export const baseURL = `${domain}/api/`;
export const mediaURL: string = `${frontDomain}/media/uploads/`;

const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 4000,
    withCredentials: true,
});

export default api;