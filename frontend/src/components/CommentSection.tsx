'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CommentsService, CreateCommentRequest } from '@/services';
import { Comment } from '@/types/api';
import Link from 'next/link';

interface CommentSectionProps {
    postSlug: string;
    initialComments?: Comment[];
    initialCommentsCount?: number;
}

export function CommentSection({
    postSlug,
    initialComments = [],
    initialCommentsCount = 0
}: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const { user, isAuthenticated } = useAuth();

    // Load comments if not provided initially
    useEffect(() => {
        if (initialComments.length === 0 && initialCommentsCount > 0) {
            loadComments();
        }
    }, [postSlug]);

    const loadComments = async () => {
        setLoadingComments(true);
        try {
            const fetchedComments = await CommentsService.getPostComments(postSlug);
            setComments(fetchedComments);
            setCommentsCount(fetchedComments.length);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const commentData: CreateCommentRequest = {
                content: newComment.trim()
            };
            const comment = await CommentsService.createComment(postSlug, commentData);
            setComments([comment, ...comments]);
            setCommentsCount(prev => prev + 1);
            setNewComment('');
        } catch (error) {
            console.error('Error creating comment:', error);
            alert('Failed to post comment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="border-t border-gray-200 pt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Comments ({commentsCount})
            </h3>

            {/* Comment Form */}
            {isAuthenticated ? (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                    <form onSubmit={handleSubmitComment}>
                        <div className="mb-4">
                            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                                Add a comment
                            </label>
                            <textarea
                                id="comment"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !newComment.trim()}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Posting...' : 'Post Comment'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="mb-8 p-6 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-center">
                        <Link href="/login" className="font-medium hover:underline">
                            Sign in
                        </Link>
                        {' '}to leave a comment
                    </p>
                </div>
            )}

            {/* Comments List */}
            {loadingComments ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-6 animate-pulse">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                                    <div className="h-3 bg-gray-300 rounded w-32"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : commentsCount === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-6">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600 font-medium text-sm">
                                        {comment.user?.charAt(0)?.toUpperCase() || '?'}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {comment.user || 'Unknown User'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(comment.created_at)}
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}