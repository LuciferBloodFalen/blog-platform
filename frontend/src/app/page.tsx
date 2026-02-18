import Link from 'next/link';
import { PostCard } from '@/components/PostCard';
import { Pagination } from '@/components/Pagination';
import { ServerApiClient } from '@/lib/server-api-client';
import { Suspense } from 'react';
import { HomePageClient } from '@/components/HomePageClient';
import { LoadingCard } from '@/components/Loading';
import { APIError } from '@/components/APIError';
import { SearchEmptyState } from '@/components/EmptyState';

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
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsData.results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8">
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
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Welcome to <span className="text-white">StackJournal</span>
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            A modern platform for developers and tech enthusiasts to share knowledge,
            insights, and stories through well-crafted articles.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-black px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Start Writing
            </Link>
            <Link
              href="#posts"
              className="border border-white text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-white hover:text-black transition-colors"
            >
              Explore Posts
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main id="posts" className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Latest Posts
          </h2>
          <p className="mt-4 text-xl text-gray-600">
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
