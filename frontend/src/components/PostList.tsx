'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types/api';
import { PostsService } from '@/services';
import { LoadingList } from '@/components/Loading';
import { APIError } from '@/components/APIError';
import { NoPostsEmptyState } from '@/components/EmptyState';

interface PostListProps {
    onEditPost: (post: Post) => void;
    onDeletePost: (post: Post) => void;
    refreshTrigger?: number;
}

export function PostList({ onEditPost, onDeletePost, refreshTrigger }: PostListProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);

    const pageSize = 10;

    useEffect(() => {
        loadPosts();
    }, [currentPage, refreshTrigger]);

    const loadPosts = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await PostsService.getMyPosts({
                page: currentPage,
                page_size: pageSize,
            });

            setPosts(response.results);
            setTotalPages(Math.ceil(response.count / pageSize));
            setHasNext(!!response.next);
            setHasPrevious(!!response.previous);
        } catch (err: any) {
            // Handle 404 specifically when user has no posts
            if (err?.response?.status === 404) {
                setPosts([]);
                setTotalPages(0);
                setHasNext(false);
                setHasPrevious(false);
            } else {
                setError(err instanceof Error ? err.message : 'Failed to load posts');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading && posts.length === 0) {
        return (
            <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="border-b border-gray-100 py-8 last:border-b-0">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                    <div className="flex space-x-2">
                                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                                    <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                                    <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="px-8 py-6 border-b border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900">
                    My Posts ({posts.length > 0 ? `${posts.length} of many` : '0'})
                </h3>
            </div>

            {error && (
                <div className="px-8 py-6">
                    <APIError
                        error={error}
                        onRetry={() => {
                            setError('');
                            loadPosts();
                        }}
                        className="py-8"
                    />
                </div>
            )}

            {posts.length === 0 && !loading && !error && (
                <NoPostsEmptyState />
            )}

            {posts.length > 0 && !error && (
                <>
                    <div className="divide-y divide-gray-100">
                        {posts.map((post) => (
                            <div key={post.id} className="p-8 hover:bg-gray-50 transition-all duration-300 hover:shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <h4 className="text-2xl font-bold text-gray-900 truncate group-hover:text-black transition-colors">
                                                {post.title}
                                            </h4>
                                            <span
                                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${post.status === 'published'
                                                    ? 'bg-green-50 text-green-800 border border-green-200'
                                                    : post.status === 'draft'
                                                        ? 'bg-gray-50 text-gray-800 border border-gray-300'
                                                        : 'bg-gray-50 text-gray-800 border border-gray-300'
                                                    }`}
                                            >
                                                {post.status === 'published' && (
                                                    <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                {post.status === 'draft' && (
                                                    <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                                    </svg>
                                                )}
                                                {post.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                                            <span className="flex items-center space-x-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                Created {formatDate(post.created_at)}
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Updated {formatDate(post.updated_at)}
                                            </span>
                                            {post.published_at && (
                                                <span className="flex items-center space-x-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    Published {formatDate(post.published_at)}
                                                </span>
                                            )}
                                        </div>

                                        {post.excerpt && (
                                            <p className="text-gray-700 text-base mb-6 line-clamp-2 leading-relaxed">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-2">
                                            {post.categories.map((category) => (
                                                <span
                                                    key={category.id}
                                                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-black text-white"
                                                >
                                                    {category.name}
                                                </span>
                                            ))}
                                            {post.tags.slice(0, 3).map((tag) => (
                                                <span
                                                    key={tag.id}
                                                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                                                >
                                                    #{tag.name}
                                                </span>
                                            ))}
                                            {post.tags.length > 3 && (
                                                <span className="text-sm text-gray-500 font-medium">
                                                    +{post.tags.length - 3} more tags
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 ml-6">
                                        {/* View Post */}
                                        <a
                                            href={`/posts/${post.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center p-3 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200"
                                            title="View post"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </a>

                                        {/* Edit Post */}
                                        <button
                                            onClick={() => onEditPost(post)}
                                            className="inline-flex items-center p-3 text-gray-600 hover:text-white hover:bg-black rounded-lg transition-all duration-200"
                                            title="Edit post"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>

                                        {/* Delete Post */}
                                        <button
                                            onClick={() => onDeletePost(post)}
                                            className="inline-flex items-center p-3 text-gray-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200"
                                            title="Delete post"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <div className="text-sm text-gray-600 font-medium">
                                Page {currentPage} of {totalPages}
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={!hasPrevious || loading}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={!hasNext || loading}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-black border border-black rounded-lg hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
                                >
                                    Next
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}