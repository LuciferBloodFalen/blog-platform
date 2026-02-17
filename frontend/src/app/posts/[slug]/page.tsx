import Link from 'next/link';
import type { Metadata } from 'next';
import { ServerApiClient } from '@/lib/server-api-client';
import { PostPageClient } from './PostPageClient';

interface PostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Metadata for SEO
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const resolvedParams = await params;

    try {
        const post = await ServerApiClient.fetchPostBySlug(resolvedParams.slug);

        return {
            title: `${post.title} | Blog Platform`,
            description: post.excerpt || post.content.substring(0, 160),
            openGraph: {
                title: post.title,
                description: post.excerpt || post.content.substring(0, 160),
                type: 'article',
                publishedTime: post.published_at || post.created_at,
                authors: post.author ? [post.author] : ['Unknown Author'],
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
        console.error('Error fetching post for metadata:', error);

        return {
            title: 'Post Not Found | Blog Platform',
            description: 'The requested post could not be found.',
        };
    }
}

export default async function PostPage({ params }: PostPageProps) {
    const resolvedParams = await params;

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
                <PostPageClient slug={resolvedParams.slug} />
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