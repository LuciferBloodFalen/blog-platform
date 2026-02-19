/**
 * Example usage of the API services
 * This file demonstrates how to use the configured API services
 * in your Next.js components.
 */

'use client';

import { useState, useEffect } from 'react';
import { PostsService, CategoriesService, TagsService } from '@/services';
import { Post, Category, Tag } from '@/types/api';

// Update page title
if (typeof window !== 'undefined') {
  document.title = 'API Examples - StackJournal';
}

export default function ApiExamplePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Example: Load posts, categories, and tags
      const [postsResponse, categoriesResponse, tagsResponse] =
        await Promise.all([
          PostsService.getAllPosts({ page_size: 10 }),
          CategoriesService.getAllCategories({ page_size: 20 }),
          TagsService.getAllTags({ page_size: 20 }),
        ]);

      setPosts(postsResponse.results);
      setCategories(categoriesResponse.results);
      setTags(tagsResponse.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <h2>Error</h2>
        <p>{error}</p>
        <button
          onClick={loadData}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Integration Example</h1>

      {/* Posts Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Recent Posts ({posts.length})
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4">
              <h3 className="font-medium text-lg">{post.title}</h3>
              <p className="text-gray-600 text-sm mb-2">
                by {post.author} •{' '}
                {new Date(post.created_at).toLocaleDateString()}
              </p>
              {post.excerpt && <p className="text-gray-700">{post.excerpt}</p>}
              <div className="mt-2 flex flex-wrap gap-1">
                {post.categories.map((category) => (
                  <span
                    key={category.id}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {category.name}
                  </span>
                ))}
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Categories ({categories.length})
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg"
            >
              {category.name}
            </div>
          ))}
        </div>
      </section>

      {/* Tags Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Tags ({tags.length})</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg"
            >
              #{tag.name}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
