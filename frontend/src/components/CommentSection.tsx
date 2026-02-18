'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CommentsService, CreateCommentRequest } from '@/services/comments.service';
import { Comment } from '@/types/api';
import Link from 'next/link';
import { NoCommentsEmptyState } from '@/components/EmptyState';

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
        <div className="border-t-2 border-gray-200 pt-8">
            <h3 className="text-2xl font-bold text-black mb-6">
                Comments ({commentsCount})
            </h3>

            {/* Comment Form */}
            {isAuthenticated ? (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-100">
                    <form onSubmit={handleSubmitComment}>
                        <div className="mb-4">
                            <label htmlFor="comment" className="block text-sm font-semibold text-black mb-2">
                                Add a comment
                            </label>
                            <textarea
                                id="comment"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts..."
                                rows={4}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 transition-all duration-200 hover:border-gray-400 resize-vertical"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !newComment.trim()}
                            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-black border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-w-[120px]"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Posting...</span>
                                </div>
                            ) : (
                                'Post Comment'
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <p className="text-black text-center">
                        <Link href="/login" className="font-medium hover:underline text-black">
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
                <NoCommentsEmptyState isAuthenticated={isAuthenticated} />
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