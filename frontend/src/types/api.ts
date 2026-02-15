// Base Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  author: User;
  categories: Category[];
  tags: Tag[];
  created_at: string;
  updated_at: string;
  published_at?: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

// Post Types
export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
  status?: 'draft' | 'published';
  categories?: number[];
  tags?: number[];
  featured_image?: string;
}

export type UpdatePostRequest = Partial<CreatePostRequest>;

// Category Types
export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;

// Tag Types
export interface CreateTagRequest {
  name: string;
}

export type UpdateTagRequest = Partial<CreateTagRequest>;

// Error Types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status_code?: number;
}
