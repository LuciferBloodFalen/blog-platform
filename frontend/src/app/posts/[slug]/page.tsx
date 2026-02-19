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
            title: post.title,
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
            title: 'Post Not Found',
            description: 'The requested post could not be found.',
        };
    }
}

export default async function PostPage({ params }: PostPageProps) {
    const resolvedParams = await params;

    return (
        <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <PostPageClient slug={resolvedParams.slug} />
        </main>
    );
}