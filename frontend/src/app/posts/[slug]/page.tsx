import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ServerApiClient } from '@/lib/server-api-client';
import { Suspense } from 'react';
import type { Metadata } from 'next';

interface PostPageProps {
    params: {
        slug: string;
    };
}

// Metadata for SEO
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    try {
        const post = await ServerApiClient.fetchPostBySlug(params.slug);

        return {
            title: `${post.title} | Blog Platform`,
            description: post.excerpt || post.content.substring(0, 160),
            openGraph: {
                title: post.title,
                description: post.excerpt || post.content.substring(0, 160),
                type: 'article',
                publishedTime: post.published_at || post.created_at,
                authors: [post.author.username],
                images: post.featured_image ? [{ url: post.featured_image }] : [],
            },
            twitter: {
                card: 'summary_large_image',
                title: post.title,
                description: post.excerpt || post.content.substring(0, 160),
                images: post.featured_image ? [post.featured_image] : [],
            },
        };
    } catch (error) {
        return {
            title: 'Post Not Found | Blog Platform',
            description: 'The requested post could not be found.',
        };
    }
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

async function PostContent({ slug }: { slug: string }) {
    try {
        const post = await ServerApiClient.fetchPostBySlug(slug);

        // Check if post is published
        if (post.status !== 'published') {
            notFound();
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
                hour12: true,
            });
        };

        return (
            <>
                {/* Article Header */}
                <header className="mb-8">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Link href="/" className="hover:text-blue-600 transition-colors">
                            ← Back to posts
                        </Link>
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-y border-gray-200">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold text-lg">
                                        {post.author.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{post.author.username}</p>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(post.published_at || post.created_at)}
                                        {' at '}
                                        {formatTime(post.published_at || post.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                            {post.likes_count !== undefined && (
                                <div className="flex items-center space-x-1">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                    <span>{post.likes_count}</span>
                                </div>
                            )}
                            {post.comments_count !== undefined && (
                                <div className="flex items-center space-x-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span>{post.comments_count}</span>
                                </div>
                            )}
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
                        {post.content.includes('<') ? (
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        ) : (
                            <p>{post.content}</p>
                        )}
                    </div>
                </article>

                {/* Tags and Categories */}
                <div className="border-t border-gray-200 pt-8 mb-8">
                    <div className="flex flex-wrap gap-4">
                        {post.categories.length > 0 && (
                            <div className="flex items-center space-x-2">
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
                    </div>

                    {post.tags.length > 0 && (
                        <div className="flex items-center space-x-2 mt-4">
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

                {/* Comments Section Placeholder */}
                <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Comments ({post.comments_count || 0})
                    </h3>

                    {post.comments_count === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>No comments yet. Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {post.comments?.map((comment) => (
                                <div key={comment.id} className="bg-gray-50 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                            <span className="text-gray-600 font-medium text-sm">
                                                {comment.user.username.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{comment.user.username}</p>
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

                    {/* Comment Form Placeholder */}
                    <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                        <p className="text-blue-800 text-center">
                            <Link href="/login" className="font-medium hover:underline">
                                Sign in
                            </Link>
                            {' '}to leave a comment
                        </p>
                    </div>
                </div>
            </>
        );
    } catch (error) {
        console.error('Error fetching post:', error);
        notFound();
    }
}

export default function PostPage({ params }: PostPageProps) {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                                Blog Platform
                            </Link>
                        </div>
                        <nav className="flex space-x-4">
                            <Link
                                href="/login"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <Suspense fallback={<PostLoading />}>
                    <PostContent slug={params.slug} />
                </Suspense>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-gray-600">
                        <p>&copy; {new Date().getFullYear()} Blog Platform. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}