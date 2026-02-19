import apiClient from '@/lib/api-client';
import { Comment } from '@/types/api';

export interface CreateCommentRequest {
  content: string;
}

export class CommentsService {
  static async getPostComments(postSlug: string): Promise<Comment[]> {
    return await apiClient.get<Comment[]>(`/posts/${postSlug}/comments/`);
  }

  static async createComment(
    postSlug: string,
    commentData: CreateCommentRequest
  ): Promise<Comment> {
    return await apiClient.post<Comment>(
      `/posts/${postSlug}/comments/`,
      commentData
    );
  }

  static async deleteComment(commentId: number): Promise<void> {
    await apiClient.delete(`/posts/comments/${commentId}/`);
  }
}
