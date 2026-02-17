import Link from 'next/link';
import { PostCard } from '@/components/PostCard';
import { Pagination } from '@/components/Pagination';
import { ServerApiClient } from '@/lib/server-api-client';
import { Suspense } from 'react';

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
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
          <div className="aspect-video bg-gray-300 rounded-t-lg"></div>
          <div className="p-6 space-y-3">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ))}
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
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-600">
            {searchParams.search || searchParams.category || searchParams.tag
              ? 'Try adjusting your search criteria.'
              : 'Check back later for new posts.'}
          </p>
        </div>
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
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load posts</h3>
        <p className="text-gray-600 mb-4">There was an error loading the posts. Please try again later.</p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Refresh Page
        </Link>
      </div>
    );
  }
}

export default function Home({ searchParams }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Blog Platform
                </Link>
              </h1>
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
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
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

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Blog Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
