import axios from "axios";

const domain = "http://10.0.1.28";
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