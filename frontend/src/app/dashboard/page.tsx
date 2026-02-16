'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PostsService } from '@/services';
import { Post } from '@/types/api';

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}

function DashboardContent() {
    const { user, logout } = useAuth();
    const [myPosts, setMyPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            // Load user's posts
            const postsResponse = await PostsService.getMyPosts({ page_size: 5 });
            setMyPosts(postsResponse.results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const testRefreshToken = async () => {
        try {
            // This will trigger a API call that might need token refresh
            await PostsService.getAllPosts({ page: 1, page_size: 1 });
            alert('Token refresh test successful!');
        } catch (error) {
            alert('Token refresh test failed: ' + (error as Error).message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-gray-600">
                                Welcome back, {user?.username}!
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={testRefreshToken}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Test Refresh Token
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {/* User Info Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                Account Information
                            </h3>
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        Username
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {user?.username}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        Member Since
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {user?.created_at
                                            ? new Date(user.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                            : 'N/A'}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* My Posts Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                My Recent Posts ({myPosts.length})
                            </h3>

                            {myPosts.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    <p>You haven&apos;t created any posts yet.</p>
                                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                        Create Your First Post
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {myPosts.map((post) => (
                                        <div
                                            key={post.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-lg font-medium text-gray-900">
                                                        {post.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Status: {post.status} • Created:{' '}
                                                        {new Date(post.created_at).toLocaleDateString()}
                                                    </p>
                                                    {post.excerpt && (
                                                        <p className="text-gray-700 mt-2">{post.excerpt}</p>
                                                    )}
                                                </div>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded ${post.status === 'published'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}
                                                >
                                                    {post.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                            <div className="text-center">
                                <h4 className="text-lg font-medium text-gray-900">
                                    Create Post
                                </h4>
                                <p className="text-gray-600 mt-2">Write a new blog post</p>
                            </div>
                        </button>

                        <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                            <div className="text-center">
                                <h4 className="text-lg font-medium text-gray-900">
                                    Manage Categories
                                </h4>
                                <p className="text-gray-600 mt-2">Organize your content</p>
                            </div>
                        </button>

                        <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                            <div className="text-center">
                                <h4 className="text-lg font-medium text-gray-900">
                                    View Analytics
                                </h4>
                                <p className="text-gray-600 mt-2">Track your progress</p>
                            </div>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
