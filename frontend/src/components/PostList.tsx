'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types/api';
import { PostsService } from '@/services';

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
            <div className="bg-white shadow rounded-lg p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="border-b border-gray-200 py-4">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                    My Posts ({posts.length > 0 ? `${posts.length} of many` : '0'})
                </h3>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {posts.length === 0 && !loading ? (
                <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h4>
                    <p className="text-gray-600 mb-4">
                        You haven&apos;t created any posts yet. Start writing to share your thoughts with the world!
                    </p>
                </div>
            ) : (
                <>
                    <div className="divide-y divide-gray-200">
                        {posts.map((post) => (
                            <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h4 className="text-lg font-medium text-gray-900 truncate">
                                                {post.title}
                                            </h4>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === 'published'
                                                    ? 'bg-green-100 text-green-800'
                                                    : post.status === 'draft'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {post.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                            <span>Created: {formatDate(post.created_at)}</span>
                                            <span>Updated: {formatDate(post.updated_at)}</span>
                                            {post.published_at && (
                                                <span>Published: {formatDate(post.published_at)}</span>
                                            )}
                                        </div>

                                        {post.excerpt && (
                                            <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-2">
                                            {post.categories.map((category) => (
                                                <span
                                                    key={category.id}
                                                    className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800"
                                                >
                                                    {category.name}
                                                </span>
                                            ))}
                                            {post.tags.slice(0, 3).map((tag) => (
                                                <span
                                                    key={tag.id}
                                                    className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600"
                                                >
                                                    #{tag.name}
                                                </span>
                                            ))}
                                            {post.tags.length > 3 && (
                                                <span className="text-xs text-gray-500">
                                                    +{post.tags.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 ml-4">
                                        {/* View Post */}
                                        <a
                                            href={`/posts/${post.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
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
                                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                            title="Edit post"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>

                                        {/* Delete Post */}
                                        <button
                                            onClick={() => onDeletePost(post)}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
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
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Page {currentPage} of {totalPages}
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={!hasPrevious || loading}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={!hasNext || loading}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}