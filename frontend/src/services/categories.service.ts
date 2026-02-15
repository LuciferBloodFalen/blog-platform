import apiClient from '@/lib/api-client';
import {
  Category,
  PaginatedResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/api';

export class CategoriesService {
  private static readonly BASE_PATH = '/categories';

  static async getAllCategories(params?: {
    page?: number;
    page_size?: number;
    search?: string;
  }): Promise<PaginatedResponse<Category>> {
    return await apiClient.get<PaginatedResponse<Category>>(
      `${this.BASE_PATH}/`,
      params
    );
  }

  static async getCategoryById(id: number): Promise<Category> {
    return await apiClient.get<Category>(`${this.BASE_PATH}/${id}/`);
  }

  static async getCategoryBySlug(slug: string): Promise<Category> {
    return await apiClient.get<Category>(`${this.BASE_PATH}/slug/${slug}/`);
  }

  static async createCategory(
    categoryData: CreateCategoryRequest
  ): Promise<Category> {
    return await apiClient.post<Category>(`${this.BASE_PATH}/`, categoryData);
  }

  static async updateCategory(
    id: number,
    categoryData: UpdateCategoryRequest
  ): Promise<Category> {
    return await apiClient.patch<Category>(
      `${this.BASE_PATH}/${id}/`,
      categoryData
    );
  }

  static async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${id}/`);
  }

  static async getCategoriesWithPostCount(): Promise<
    (Category & { post_count: number })[]
  > {
    return await apiClient.get<(Category & { post_count: number })[]>(
      `${this.BASE_PATH}/with-counts/`
    );
  }
}
