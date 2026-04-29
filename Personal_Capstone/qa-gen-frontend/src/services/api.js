import axios from 'axios';

// Create a centralized Axios instance using our environment variable

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// The Interceptor: Runs automatically right before any request leaves the frontend
api.interceptors.request.use(
    (config) => {
        // Look inside the browser's local storage for our saved token
        const token = localStorage.getItem('jwt_token');

        // If we found one, attach it as a Bearer token to satisfy Spring Security
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;