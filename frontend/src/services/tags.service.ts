import apiClient from '@/lib/api-client';
import {
  Tag,
  PaginatedResponse,
  CreateTagRequest,
  UpdateTagRequest,
} from '@/types/api';

export class TagsService {
  private static readonly BASE_PATH = '/tags';

  static async getAllTags(params?: {
    page?: number;
    page_size?: number;
    search?: string;
  }): Promise<PaginatedResponse<Tag>> {
    return await apiClient.get<PaginatedResponse<Tag>>(
      `${this.BASE_PATH}/`,
      params
    );
  }

  static async getTagById(id: number): Promise<Tag> {
    return await apiClient.get<Tag>(`${this.BASE_PATH}/${id}/`);
  }

  static async getTagBySlug(slug: string): Promise<Tag> {
    return await apiClient.get<Tag>(`${this.BASE_PATH}/slug/${slug}/`);
  }

  static async createTag(tagData: CreateTagRequest): Promise<Tag> {
    return await apiClient.post<Tag>(`${this.BASE_PATH}/`, tagData);
  }

  static async updateTag(id: number, tagData: UpdateTagRequest): Promise<Tag> {
    return await apiClient.patch<Tag>(`${this.BASE_PATH}/${id}/`, tagData);
  }

  static async deleteTag(id: number): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${id}/`);
  }

  static async getTagsWithPostCount(): Promise<
    (Tag & { post_count: number })[]
  > {
    return await apiClient.get<(Tag & { post_count: number })[]>(
      `${this.BASE_PATH}/with-counts/`
    );
  }

  static async getPopularTags(limit?: number): Promise<Tag[]> {
    return await apiClient.get<Tag[]>(`${this.BASE_PATH}/popular/`, { limit });
  }
}
