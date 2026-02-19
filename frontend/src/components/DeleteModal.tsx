'use client';

import { useState } from 'react';
import { Post } from '@/types/api';
import { PostsService } from '@/services';

interface DeleteModalProps {
    post: Post | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function DeleteModal({ post, isOpen, onClose, onSuccess }: DeleteModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        if (!post) return;

        try {
            setLoading(true);
            setError('');

            await PostsService.deletePost(post.slug);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete post');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setError('');
            onClose();
        }
    };

    if (!isOpen || !post) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Delete Post
                            </h3>
                        </div>

                        {!loading && (
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <p className="text-gray-600 mb-3">
                            Are you sure you want to delete this post? This action cannot be undone.
                        </p>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-1">
                                {post.title}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Status: {post.status}</span>
                                <span>
                                    Created: {new Date(post.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            {post.excerpt && (
                                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                    {post.excerpt}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-3">
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="px-6 py-3 text-sm font-semibold text-black bg-white border-2 border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="px-6 py-3 text-sm font-semibold text-white bg-red-600 border-2 border-red-600 rounded-lg hover:bg-red-700 hover:border-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Deleting...</span>
                                </div>
                            ) : (
                                'Delete Post'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}