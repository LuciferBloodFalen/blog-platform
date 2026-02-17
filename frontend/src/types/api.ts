// Base Types
export interface User {
  id: number;
  username: string;
  email: string;
  is_author: boolean;
  created_at: string;
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

export interface Comment {
  id: number;
  content: string;
  user: string; // Username as string
  post: number;
  created_at: string;
}

export interface Like {
  id: number;
  user: User;
  post: number;
  created_at: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  author: string; // Author username as string
  categories: Category[];
  tags: Tag[];
  comments?: Comment[];
  comments_count?: number;
  likes?: Like[];
  likes_count?: number;
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
  is_published?: boolean;
  category?: number;
  tags?: number[];
  tags_input?: number[];
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
