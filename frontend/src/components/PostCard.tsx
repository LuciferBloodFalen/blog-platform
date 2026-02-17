import Link from 'next/link';
import { Post } from '@/types/api';

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            {post.featured_image && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}

            <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span>{formatDate(post.published_at || post.created_at)}</span>
                    <span>by {post.author.username}</span>
                    {post.likes_count !== undefined && (
                        <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            <span>{post.likes_count}</span>
                        </span>
                    )}
                    {post.comments_count !== undefined && (
                        <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>{post.comments_count}</span>
                        </span>
                    )}
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                    <Link href={`/posts/${post.slug}`}>
                        {post.title}
                    </Link>
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt || post.content.substring(0, 150) + '...'}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {post.categories.map((category) => (
                            <span
                                key={category.id}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                                {category.name}
                            </span>
                        ))}
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag.id}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                                #{tag.name}
                            </span>
                        ))}
                    </div>

                    <Link
                        href={`/posts/${post.slug}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                    >
                        Read more →
                    </Link>
                </div>
            </div>
        </article>
    );
}