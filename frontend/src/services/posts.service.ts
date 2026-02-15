import apiClient from '@/lib/api-client';
import {
    Post,
    PaginatedResponse,
    CreatePostRequest,
    UpdatePostRequest,
} from '@/types/api';

export class PostsService {
    private static readonly BASE_PATH = '/posts';

    static async getAllPosts(params?: {
        page?: number;
        page_size?: number;
        search?: string;
        category?: string;
        tag?: string;
        status?: string;
        author?: string;
    }): Promise<PaginatedResponse<Post>> {
        return await apiClient.get<PaginatedResponse<Post>>(
            `${this.BASE_PATH}/`,
            params
        );
    }

    static async getPostById(id: number): Promise<Post> {
        return await apiClient.get<Post>(`${this.BASE_PATH}/${id}/`);
    }

    static async getPostBySlug(slug: string): Promise<Post> {
        return await apiClient.get<Post>(`${this.BASE_PATH}/slug/${slug}/`);
    }

    static async createPost(postData: CreatePostRequest): Promise<Post> {
        return await apiClient.post<Post>(`${this.BASE_PATH}/`, postData);
    }

    static async updatePost(
        id: number,
        postData: UpdatePostRequest
    ): Promise<Post> {
        return await apiClient.patch<Post>(`${this.BASE_PATH}/${id}/`, postData);
    }

    static async deletePost(id: number): Promise<void> {
        await apiClient.delete(`${this.BASE_PATH}/${id}/`);
    }

    static async publishPost(id: number): Promise<Post> {
        return await apiClient.patch<Post>(`${this.BASE_PATH}/${id}/publish/`);
    }

    static async unpublishPost(id: number): Promise<Post> {
        return await apiClient.patch<Post>(`${this.BASE_PATH}/${id}/unpublish/`);
    }

    static async getFeaturedPosts(): Promise<Post[]> {
        return await apiClient.get<Post[]>(`${this.BASE_PATH}/featured/`);
    }

    static async getMyPosts(params?: {
        page?: number;
        page_size?: number;
        status?: string;
    }): Promise<PaginatedResponse<Post>> {
        return await apiClient.get<PaginatedResponse<Post>>(
            `${this.BASE_PATH}/my-posts/`,
            params
        );
    }
}
