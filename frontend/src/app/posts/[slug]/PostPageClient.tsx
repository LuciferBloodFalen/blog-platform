'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ServerApiClient } from '@/lib/server-api-client';
import { CommentSection } from '@/components/CommentSection';
import { LikeButton } from '@/components/LikeButton';
import { Post } from '@/types/api';

interface PostPageClientProps {
    slug: string;
}

function PostLoading() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
                <div className="aspect-video bg-gray-300 rounded-lg mb-8"></div>
                <div className="space-y-4">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                </div>
            </div>
        </div>
    );
}

export function PostPageClient({ slug }: PostPageClientProps) {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            console.log('Fetching post:', slug);

            try {
                const postData = await ServerApiClient.fetchPostBySlug(slug);
                setPost(postData);
            } catch (error) {
                console.error('Error fetching post:', error);
                notFound();
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (loading) {
        return <PostLoading />;
    }

    if (!post) {
        notFound();
        return null;
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    return (
        <>
            {/* Article Header */}
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-4xl font-bold text-gray-900">
                        {post.title}
                    </h1>
                    {post.status === 'draft' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Draft
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-y border-gray-200">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-lg">
                                    {post.author?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{post.author || 'Unknown Author'}</p>
                                <p className="text-sm text-gray-500">
                                    {formatDate(post.published_at || post.created_at)}
                                    {' at '}
                                    {formatTime(post.published_at || post.created_at)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Like Button */}
                        <LikeButton
                            postSlug={post.slug}
                            initialLikesCount={post.likes_count || 0}
                            initialIsLiked={false} // You might want to check if user has liked this post
                        />

                        {/* Comments Count Display */}
                        <div className="flex items-center space-x-2 text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="font-medium">{post.comments_count || 0}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            {post.featured_image && (
                <div className="mb-8">
                    <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-auto rounded-lg shadow-lg"
                    />
                </div>
            )}

            {/* Article Content */}
            <article className="prose prose-lg max-w-none mb-8">
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </div>
            </article>

            {/* Categories and Tags */}
            <div className="mb-8">
                {post.categories && post.categories.length > 0 && (
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="text-sm font-medium text-gray-700">Categories:</span>
                        <div className="flex flex-wrap gap-2">
                            {post.categories.map((category) => (
                                <span
                                    key={category.id}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                >
                                    {category.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {post.tags && post.tags.length > 0 && (
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Tags:</span>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Comments Section */}
            <CommentSection
                postSlug={post.slug}
                initialComments={post.comments || []}
                initialCommentsCount={post.comments_count || 0}
            />
        </>
    );
}