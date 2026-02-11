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
        // Handle Network Errors (Backend down)
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            console.error('Backend unavailable');
            // Optional: You could dispatch a global event here to show a toast
            return Promise.reject(new Error('Backend server is unreachable. Please try again later.'));
        }

        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
