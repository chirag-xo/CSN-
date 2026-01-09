import api from './api';
import type { User, RegisterData, LoginData, AuthResponse, UpdateProfileData } from '../types/user';

export const authService = {
    // Register new user
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', data);
        if (response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
        }
        return response.data;
    },

    // Login user
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', data);
        if (response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
        }
        return response.data;
    },

    // Get current user
    async getCurrentUser(): Promise<User> {
        const response = await api.get<{ success: boolean; data: User }>('/auth/me');
        return response.data.data;
    },

    // Update user profile
    async updateProfile(data: UpdateProfileData): Promise<User> {
        const response = await api.put<{ success: boolean; data: User }>('/users/profile', data);
        return response.data.data;
    },

    // Logout
    logout() {
        localStorage.removeItem('token');
    },

    // Get token
    getToken(): string | null {
        return localStorage.getItem('token');
    },

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    },
};
