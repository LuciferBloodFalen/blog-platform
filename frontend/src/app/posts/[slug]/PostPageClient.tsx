'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
        <div className="max-w-40xl mx-auto py-12 px-6 bg-white min-h-screen">
            <div className="animate-pulse">
                {/* Back button skeleton */}
                <div className="h-10 bg-gray-200 rounded-lg w-20 mb-8"></div>

                {/* Title skeleton */}
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>

                {/* Author skeleton */}
                <div className="flex items-center space-x-3 mb-8">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                </div>

                {/* Content skeleton */}
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
            </div>
        </div>
    );
}

export function PostPageClient({ slug }: PostPageClientProps) {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchPost = async () => {
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

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-4xl mx-auto py-12 px-6">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-black bg-white border-2 border-gray-200 rounded-lg hover:bg-black hover:text-white transition-all duration-200"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                </div>

                {/* Article Header */}
                <header className="mb-12">
                    {/* Title */}
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-4">
                            {post.title}
                        </h1>
                        {post.status === 'draft' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-black border border-gray-300">
                                Draft
                            </span>
                        )}
                    </div>

                    {/* Author and Meta */}
                    <div className="flex items-center justify-between flex-wrap gap-6 pb-8 border-b-2 border-gray-100">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    {post.author?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-black">
                                    {post.author || 'Unknown Author'}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {formatDate(post.published_at || post.created_at)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <LikeButton
                                postSlug={post.slug}
                                initialLikesCount={post.likes_count || 0}
                                initialIsLiked={false}
                            />

                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="text-gray-600 font-medium">{post.comments_count || 0}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                {post.featured_image && (
                    <div className="mb-12">
                        <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-auto rounded-lg border border-gray-200"
                        />
                    </div>
                )}

                {/* Article Content */}
                <article className="mb-16">
                    <div className="prose prose-lg max-w-none">
                        <div
                            className="text-black leading-relaxed text-lg whitespace-pre-wrap break-words"
                            style={{ lineHeight: '1.7' }}
                        >
                            {post.content}
                        </div>
                    </div>
                </article>

                {/* Categories and Tags */}
                {((post.categories && post.categories.length > 0) || (post.tags && post.tags.length > 0)) && (
                    <div className="mb-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
                        {post.categories && post.categories.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-base font-semibold text-black mb-3">Categories</h4>
                                <div className="flex flex-wrap gap-2">
                                    {post.categories.map((category) => (
                                        <span
                                            key={category.id}
                                            className="px-3 py-1 bg-black text-white text-sm font-medium rounded-full"
                                        >
                                            {category.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {post.tags && post.tags.length > 0 && (
                            <div>
                                <h4 className="text-base font-semibold text-black mb-3">Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag.id}
                                            className="px-3 py-1 bg-white text-black text-sm font-medium rounded-full border border-gray-300"
                                        >
                                            #{tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Comments Section */}
                <section className="pt-8">
                    <CommentSection
                        postSlug={post.slug}
                        initialComments={post.comments || []}
                        initialCommentsCount={post.comments_count || 0}
                    />
                </section>
            </div>
        </div>
    );
}