import Link from 'next/link';
import { PostCard } from '@/components/PostCard';
import { Pagination } from '@/components/Pagination';
import { ServerApiClient } from '@/lib/server-api-client';
import { Suspense } from 'react';
import { HomePageClient } from '@/components/HomePageClient';
import { LoadingCard } from '@/components/Loading';
import { APIError } from '@/components/APIError';
import { SearchEmptyState } from '@/components/EmptyState';
import { Metadata } from 'next';

export const metadata: Metadata = {
  description: 'Discover the latest articles, insights, and stories from our community of developers and tech enthusiasts.',
};

interface HomePageProps {
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
    tag?: string;
  };
}

function PostsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <LoadingCard count={6} />
    </div>
  );
}

async function PostsList({ searchParams }: { searchParams: HomePageProps['searchParams'] }) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  const pageSize = 12;

  try {
    const postsData = await ServerApiClient.fetchPublishedPosts({
      page: currentPage,
      page_size: pageSize,
      search: searchParams.search,
      category: searchParams.category,
      tag: searchParams.tag,
    });

    const totalPages = Math.ceil(postsData.count / pageSize);

    if (postsData.results.length === 0) {
      return (
        <SearchEmptyState
          searchTerm={searchParams.search || searchParams.category || searchParams.tag}
        />
      );
    }

    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {postsData.results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 sm:mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNext={!!postsData.next}
              hasPrevious={!!postsData.previous}
            />
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching posts:', error);

    return (
      <APIError
        error={error instanceof Error ? error : new Error('Failed to load posts')}
      />
    );
  }
}

export default function Home({ searchParams }: HomePageProps) {
  return (
    <HomePageClient>
      {/* Hero Section */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight animate-fade-in-up">
            Welcome to <span className="text-white bg-gradient-to-r from-white to-gray-200 bg-clip-text">StackJournal</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            A modern platform for developers and tech enthusiasts to share knowledge,
            insights, and stories through well-crafted articles.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto animate-fade-in-up animation-delay-400">
            <Link
              href="/register"
              className="bg-white text-black px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 hover:bg-gray-100 hover:scale-105 hover:shadow-2xl hover:shadow-white/25 active:scale-95 group"
            >
              <span className="transition-transform duration-300 group-hover:tracking-wide">Start Writing</span>
            </Link>
            <Link
              href="#posts"
              className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 hover:shadow-2xl hover:shadow-white/25 active:scale-95 group"
            >
              <span className="transition-transform duration-300 group-hover:tracking-wide">Explore Posts</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main id="posts" className="max-w-7xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">
            Latest Posts
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover articles, insights, and stories from our community
          </p>
        </div>

        {/* Posts Section */}
        <Suspense fallback={<PostsLoading />}>
          <PostsList searchParams={searchParams} />
        </Suspense>
      </main>
    </HomePageClient>
  );
}
