import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Client Configuration
class ApiClient {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor for adding auth token
        this.instance.interceptors.request.use(
            (config) => {
                const token = this.getAuthToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for handling errors
        this.instance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Handle unauthorized access
                    this.removeAuthToken();
                    // Optionally redirect to login
                }
                return Promise.reject(error);
            }
        );
    }

    private getAuthToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    }

    private removeAuthToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
        }
    }

    public setAuthToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', token);
        }
    }

    // HTTP Methods
    public async get<T>(
        url: string,
        params?: Record<string, unknown>
    ): Promise<T> {
        const response: AxiosResponse<T> = await this.instance.get(url, { params });
        return response.data;
    }

    public async post<T>(url: string, data?: unknown): Promise<T> {
        const response: AxiosResponse<T> = await this.instance.post(url, data);
        return response.data;
    }

    public async put<T>(url: string, data?: unknown): Promise<T> {
        const response: AxiosResponse<T> = await this.instance.put(url, data);
        return response.data;
    }

    public async patch<T>(url: string, data?: unknown): Promise<T> {
        const response: AxiosResponse<T> = await this.instance.patch(url, data);
        return response.data;
    }

    public async delete<T>(url: string): Promise<T> {
        const response: AxiosResponse<T> = await this.instance.delete(url);
        return response.data;
    }
}

// Export singleton instance
const apiClient = new ApiClient();
export default apiClient;
