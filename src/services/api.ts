import axios from "axios";

const api = axios.create({
    //baseURL: 'https://api.thecrystalacademy.org/api',
    baseURL: import.meta.env.VITE_APP_API_URL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json'
    }
});

export default api;