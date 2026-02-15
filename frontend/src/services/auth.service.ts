import apiClient from '@/lib/api-client';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/api';

export class AuthService {
    private static readonly BASE_PATH = '/auth';

    static async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(
            `${this.BASE_PATH}/login/`,
            credentials
        );

        // Store the token
        if (response.access) {
            apiClient.setAuthToken(response.access);
        }

        return response;
    }

    static async register(userData: RegisterRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(
            `${this.BASE_PATH}/register/`,
            userData
        );

        // Store the token
        if (response.access) {
            apiClient.setAuthToken(response.access);
        }

        return response;
    }

    static async logout(): Promise<void> {
        await apiClient.post(`${this.BASE_PATH}/logout/`);
        // Remove token from storage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
        }
    }

    static async refreshToken(refreshToken: string): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(
            `${this.BASE_PATH}/refresh/`,
            { refresh: refreshToken }
        );

        if (response.access) {
            apiClient.setAuthToken(response.access);
        }

        return response;
    }

    static async getCurrentUser(): Promise<User> {
        return await apiClient.get<User>(`${this.BASE_PATH}/user/`);
    }

    static async updateProfile(userData: Partial<User>): Promise<User> {
        return await apiClient.patch<User>(`${this.BASE_PATH}/user/`, userData);
    }

    static async changePassword(data: {
        old_password: string;
        new_password: string;
    }): Promise<{ message: string }> {
        return await apiClient.post(`${this.BASE_PATH}/change-password/`, data);
    }
}
