import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import type { User, RegisterData } from '../types/user';
import { authService } from '../services/authService';
import { setTokenFetcher } from '../services/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { isSignedIn, getToken, signOut, isLoaded } = useClerkAuth();

    const loadUser = useCallback(async () => {
        if (authService.isAuthenticated()) {
            try {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Failed to load user:', error);
                // If backend fails, we don't necessarily want to kill the auth state 
                // if we are trusting Clerk. But for now, let's just properly set user to null 
                // WITHOUT calling authService.logout() which might clear tokens aggressively.
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    // Initial load check
    useEffect(() => {
        loadUser();
    }, [loadUser]);

    // Sync Clerk Auth
    useEffect(() => {
        if (!isLoaded) return;

        // Connect API to Clerk token refresh
        setTokenFetcher(getToken);

        if (isSignedIn) {
            getToken().then(token => {
                if (token) {
                    localStorage.setItem('token', token);
                    loadUser();
                }
            });
        }
    }, [isSignedIn, isLoaded, getToken, loadUser]);

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        setUser(response.data.user);
    };

    const register = async (data: RegisterData) => {
        const response = await authService.register(data);
        setUser(response.data.user);
    };

    const logout = () => {
        authService.logout();
        signOut();
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        loading: loading || !isLoaded, // Wait for both
        login,
        register,
        logout,
        isAuthenticated: !!user || !!isSignedIn, // Allow Clerk session to count as authenticated
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

