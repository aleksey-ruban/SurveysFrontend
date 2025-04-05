import axios from "axios";

const api = axios.create({
    baseURL: "https://10.0.1.69",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 4000,
    withCredentials: true,
});

export default api;