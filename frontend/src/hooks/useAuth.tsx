'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { AuthService } from '@/services';
import { User, LoginRequest, RegisterRequest } from '@/types/api';

// In-memory token storage
let accessToken: string | null = null;
let refreshToken: string | null = null;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Token management functions
  const getAccessToken = () => accessToken;
  const getRefreshToken = () => refreshToken;

  const setTokens = (access: string, refresh: string) => {
    accessToken = access;
    refreshToken = refresh;
  };

  const clearTokens = () => {
    accessToken = null;
    refreshToken = null;
  };

  // Check for existing authentication on mount
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      // For demo purposes, we could try to restore from localStorage on refresh
      // but for production security, tokens should be in memory only
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        accessToken = storedToken;
        const userData = await AuthService.getCurrentUser();
        setUser(userData);
      }
    } catch {
      // Token might be invalid, clear it
      clearTokens();
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await AuthService.login(credentials);
      setTokens(response.access, response.refresh);
      setUser(response.user);

      // For demo purposes, store in localStorage to persist across refreshes
      // In production, consider using httpOnly cookies or session storage
      localStorage.setItem('authToken', response.access);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const response = await AuthService.register(userData);
      setTokens(response.access, response.refresh);
      setUser(response.user);

      // For demo purposes, store in localStorage to persist across refreshes
      localStorage.setItem('authToken', response.access);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshTokenValue = getRefreshToken();
      await AuthService.logout(refreshTokenValue);
    } catch {
      // Even if logout fails on server, clear local state
    } finally {
      setUser(null);
      clearTokens();
      localStorage.removeItem('authToken');
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
    } catch {
      setUser(null);
      clearTokens();
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
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearTokens,
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
