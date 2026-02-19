import axios, { AxiosInstance, AxiosResponse } from 'axios';

// We'll import the auth hook functions dynamically to avoid circular dependencies
let getAccessToken: (() => string | null) | null = null;
let getRefreshToken: (() => string | null) | null = null;
let setTokens: ((access: string, refresh: string) => void) | null = null;
let clearTokens: (() => void) | null = null;

// Function to set auth functions from the auth hook
export function setAuthFunctions(authFunctions: {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;
}) {
  getAccessToken = authFunctions.getAccessToken;
  getRefreshToken = authFunctions.getRefreshToken;
  setTokens = authFunctions.setTokens;
  clearTokens = authFunctions.clearTokens;
}

// API Client Configuration
class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: string) => void;
    reject: (error: unknown) => void;
  }> = [];

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
        const token = getAccessToken ? getAccessToken() : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for handling token refresh
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If it's a validation error (400) or other non-401 error, reject immediately
        if (error.response?.status !== 401) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.instance(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshTokenValue = getRefreshToken
              ? getRefreshToken()
              : null;
            if (!refreshTokenValue) {
              throw new Error('No refresh token available');
            }

            // Call refresh endpoint
            const response = await this.instance.post('/auth/refresh/', {
              refresh: refreshTokenValue,
            });

            const { access, refresh } = response.data;

            // Update tokens
            if (setTokens) {
              setTokens(access, refresh);
            }

            // Process queued requests
            this.processQueue(null, access);

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return this.instance(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            this.processQueue(refreshError, null);

            if (clearTokens) {
              clearTokens();
            }

            // Clear localStorage as well for demo purposes
            if (typeof window !== 'undefined') {
              localStorage.removeItem('authToken');
              // Redirect to login page
              window.location.href = '/login';
            }

            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: unknown, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else if (token) {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  public setAuthToken(token: string): void {
    // This method is kept for backward compatibility
    // but tokens are now managed by the auth hook
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
