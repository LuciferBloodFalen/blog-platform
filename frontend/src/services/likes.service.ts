import apiClient from '@/lib/api-client';

export interface LikeResponse {
    message: string;
}

export class LikesService {
    static async likePost(postSlug: string): Promise<LikeResponse> {
        return await apiClient.post<LikeResponse>(`/posts/${postSlug}/like/`);
    }

    static async unlikePost(postSlug: string): Promise<LikeResponse> {
        return await apiClient.post<LikeResponse>(`/posts/${postSlug}/unlike/`);
    }
}