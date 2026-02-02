import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

let tokenFetcher: (() => Promise<string | null>) | null = null;

export const setTokenFetcher = (fetcher: () => Promise<string | null>) => {
    tokenFetcher = fetcher;
};

// Add token to requests automatically
api.interceptors.request.use(async (config) => {
    // Try to get fresh token from fetcher first
    if (tokenFetcher) {
        try {
            const token = await tokenFetcher();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                // Also update localStorage for backup/legacy
                localStorage.setItem('token', token);
                return config;
            }
        } catch (error) {
            console.error('Failed to fetch fresh token:', error);
        }
    }

    // Fallback to localStorage
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
