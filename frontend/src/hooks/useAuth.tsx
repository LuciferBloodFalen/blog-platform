'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { AuthService } from '@/services';
import { User, LoginRequest, RegisterRequest } from '@/types/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check for existing authentication on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                const userData = await AuthService.getCurrentUser();
                setUser(userData);
            }
        } catch {
            // Token might be invalid, remove it
            localStorage.removeItem('authToken');
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: LoginRequest) => {
        try {
            const response = await AuthService.login(credentials);
            setUser(response.user);
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData: RegisterRequest) => {
        try {
            const response = await AuthService.register(userData);
            setUser(response.user);
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AuthService.logout();
        } catch (error) {
            // Even if logout fails on server, clear local state
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('authToken');
        }
    };

    const refreshUser = async () => {
        try {
            const userData = await AuthService.getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error('Failed to refresh user:', error);
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
