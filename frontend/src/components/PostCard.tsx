import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types/api';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link href={`/posts/${post.slug}`}>
      <article className="group bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-xl hover:shadow-black/5 hover:border-gray-200 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden cursor-pointer transform-gpu">
        {post.featured_image && (
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          </div>
        )}

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Title */}
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight group-hover:text-black transition-colors duration-300 line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {post.excerpt || post.content.substring(0, 120) + '...'}
          </p>

          {/* Author and Date */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 group/author">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-full flex items-center justify-center transition-transform duration-300 group-hover/author:scale-110">
                <span className="text-white text-xs font-medium">
                  {post.author?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <span className="font-medium text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none transition-colors duration-300 group-hover/author:text-black">
                {post.author}
              </span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span className="text-xs sm:text-sm">
              {formatDate(post.published_at || post.created_at)}
            </span>
            {post.likes_count !== undefined && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center space-x-1 group/likes cursor-pointer">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 group-hover/likes:scale-125 group-hover/likes:text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm transition-colors duration-300 group-hover/likes:text-red-500">
                    {post.likes_count}
                  </span>
                </span>
              </>
            )}
            {post.comments_count !== undefined && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center space-x-1 group/comments cursor-pointer">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 group-hover/comments:scale-125 group-hover/comments:text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm transition-colors duration-300 group-hover/comments:text-blue-500">
                    {post.comments_count}
                  </span>
                </span>
              </>
            )}
          </div>

          {/* Tags and Categories */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {post.categories.slice(0, 1).map((category) => (
              <span
                key={category.id}
                className="px-2 sm:px-3 py-1 bg-black text-white text-xs font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-black/25 hover:scale-105 cursor-pointer transform-gpu"
              >
                {category.name}
              </span>
            ))}
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border transition-all duration-300 hover:bg-gray-900 hover:text-white hover:border-gray-900 hover:scale-105 hover:shadow-md cursor-pointer transform-gpu"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
