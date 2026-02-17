'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PostForm } from '@/components/PostForm';
import { PostList } from '@/components/PostList';
import { DeleteModal } from '@/components/DeleteModal';
import { Post } from '@/types/api';

type DashboardView = 'overview' | 'posts' | 'create-post' | 'edit-post';

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}

function DashboardContent() {
    const { user, logout } = useAuth();
    const [currentView, setCurrentView] = useState<DashboardView>('overview');
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [deletingPost, setDeletingPost] = useState<Post | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleCreatePost = () => {
        setEditingPost(null);
        setCurrentView('create-post');
    };

    const handleEditPost = (post: Post) => {
        setEditingPost(post);
        setCurrentView('edit-post');
    };

    const handleDeletePost = (post: Post) => {
        setDeletingPost(post);
    };

    const handlePostSuccess = (post: Post) => {
        setCurrentView('posts');
        setEditingPost(null);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleDeleteSuccess = () => {
        setDeletingPost(null);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleCancelForm = () => {
        setEditingPost(null);
        setCurrentView('posts');
    };

    const renderCurrentView = () => {
        switch (currentView) {
            case 'create-post':
                return (
                    <PostForm
                        post={null}
                        onSuccess={handlePostSuccess}
                        onCancel={handleCancelForm}
                    />
                );
            case 'edit-post':
                return (
                    <PostForm
                        post={editingPost}
                        onSuccess={handlePostSuccess}
                        onCancel={handleCancelForm}
                    />
                );
            case 'posts':
                return (
                    <PostList
                        onEditPost={handleEditPost}
                        onDeletePost={handleDeletePost}
                        refreshTrigger={refreshTrigger}
                    />
                );
            case 'overview':
            default:
                return <DashboardOverview onCreatePost={handleCreatePost} user={user} />;
        }
    };

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
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="border-t border-gray-200">
                        <div className="flex space-x-8">
                            <button
                                onClick={() => setCurrentView('overview')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${currentView === 'overview'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setCurrentView('posts')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${currentView === 'posts'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                My Posts
                            </button>
                            <button
                                onClick={handleCreatePost}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${currentView === 'create-post' || currentView === 'edit-post'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {currentView === 'edit-post' ? 'Edit Post' : 'Create Post'}
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {renderCurrentView()}
            </main>

            {/* Delete Modal */}
            <DeleteModal
                post={deletingPost}
                isOpen={!!deletingPost}
                onClose={() => setDeletingPost(null)}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    );
}

function DashboardOverview({ onCreatePost, user }: { onCreatePost: () => void; user: any }) {
    return (
        <div className="space-y-6">
            {/* User Info Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
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
                                Author Status
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {user?.is_author ? 'Author' : 'Member'}
                            </dd>
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

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <button
                    onClick={onCreatePost}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-left group"
                >
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-medium text-gray-900">
                                Create New Post
                            </h4>
                            <p className="text-gray-600 mt-1">Write and publish a new blog post</p>
                        </div>
                    </div>
                </button>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-medium text-gray-900">
                                Manage Posts
                            </h4>
                            <p className="text-gray-600 mt-1">Edit, publish, or delete your posts</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-medium text-gray-900">
                                Analytics
                            </h4>
                            <p className="text-gray-600 mt-1">View your post statistics</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Welcome Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                            Welcome to your dashboard!
                        </h3>
                        <p className="mt-2 text-sm text-blue-700">
                            From here you can create new blog posts, manage your existing content, and track your writing progress.
                            Click &quot;Create New Post&quot; to get started with your first article.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
