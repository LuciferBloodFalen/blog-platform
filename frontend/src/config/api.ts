// API Configuration Constants
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    LOGOUT: '/auth/logout/',
    REFRESH: '/auth/refresh/',
    PROFILE: '/auth/profile/',
    CHANGE_PASSWORD: '/auth/change-password/',
  },
  POSTS: {
    LIST: '/posts/',
    DETAIL: (id: number) => `/posts/${id}/`,
    BY_SLUG: (slug: string) => `/posts/slug/${slug}/`,
    PUBLISH: (id: number) => `/posts/${id}/publish/`,
    UNPUBLISH: (id: number) => `/posts/${id}/unpublish/`,
    FEATURED: '/posts/featured/',
    MY_POSTS: '/posts/my-posts/',
  },
  CATEGORIES: {
    LIST: '/categories/',
    DETAIL: (id: number) => `/categories/${id}/`,
    BY_SLUG: (slug: string) => `/categories/slug/${slug}/`,
    WITH_COUNTS: '/categories/with-counts/',
  },
  TAGS: {
    LIST: '/tags/',
    DETAIL: (id: number) => `/tags/${id}/`,
    BY_SLUG: (slug: string) => `/tags/slug/${slug}/`,
    WITH_COUNTS: '/tags/with-counts/',
    POPULAR: '/tags/popular/',
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
} as const;
