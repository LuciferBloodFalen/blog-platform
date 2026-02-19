import apiClient from '@/lib/api-client';

export interface LikeResponse {
  message: string;
  liked: boolean;
  likes_count: number;
  was_created?: boolean;
  was_removed?: boolean;
}

export class LikesService {
  static async likePost(postSlug: string): Promise<LikeResponse> {
    return await apiClient.post<LikeResponse>(`/posts/${postSlug}/like/`);
  }

  static async unlikePost(postSlug: string): Promise<LikeResponse> {
    return await apiClient.post<LikeResponse>(`/posts/${postSlug}/unlike/`);
  }

  static async getLikeStatus(
    postSlug: string
  ): Promise<{ liked: boolean; likes_count: number }> {
    return await apiClient.get<{ liked: boolean; likes_count: number }>(
      `/posts/${postSlug}/like-status/`
    );
  }
}
