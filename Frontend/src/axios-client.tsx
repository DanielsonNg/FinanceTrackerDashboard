import axios, { type AxiosResponse, AxiosError } from 'axios';
import { type ApiError } from './types/auth';

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    withCredentials: true,
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosClient.interceptors.request.use(
    (config) => {
        // You can add auth headers here if needed
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ApiError>) => {
        const { response } = error;

        if (response?.status === 401) {
            // Don't redirect here, let the auth hook handle it
            console.log('Unauthorized access detected');
        } else if (response?.status === 404) {
            console.log('Resource not found');
        } else if (response?.status === 500) {
            console.error('Server error:', response?.data?.message || 'Internal server error');
        }

        return Promise.reject(error);
    }
);

export default axiosClient;