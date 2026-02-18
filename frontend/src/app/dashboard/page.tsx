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
        <div className="min-h-screen bg-white">
            {/* Dashboard Header */}
            <div className="bg-white shadow-lg border-b-2 border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
                        <p className="text-gray-600 mt-2">
                            Welcome back, {user?.username}!
                        </p>
                    </div>

                    {/* Navigation */}
                    <nav className="border-t-2 border-gray-100">
                        <div className="flex space-x-8">
                            <button
                                onClick={() => setCurrentView('overview')}
                                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${currentView === 'overview'
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                                    }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setCurrentView('posts')}
                                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${currentView === 'posts'
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                                    }`}
                            >
                                My Posts
                            </button>
                            <button
                                onClick={handleCreatePost}
                                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${currentView === 'create-post' || currentView === 'edit-post'
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                                    }`}
                            >
                                {currentView === 'edit-post' ? 'Edit Post' : 'Create Post'}
                            </button>
                        </div>
                    </nav>
                </div>
            </div>

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
        <div className="space-y-8">
            {/* User Info Card */}
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border-2 border-gray-100">
                <div className="px-6 py-8 sm:p-8">
                    <h3 className="text-xl leading-6 font-bold text-black mb-6">
                        Account Information
                    </h3>
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm font-semibold text-black">
                                Username
                            </dt>
                            <dd className="mt-2 text-base text-gray-700">
                                {user?.username}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-semibold text-black">Email</dt>
                            <dd className="mt-2 text-base text-gray-700">{user?.email}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-semibold text-black">
                                Author Status
                            </dt>
                            <dd className="mt-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user?.is_author
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-black border border-gray-300'
                                    }`}>
                                    {user?.is_author ? 'Author' : 'Member'}
                                </span>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-semibold text-black">
                                Member Since
                            </dt>
                            <dd className="mt-2 text-base text-gray-700">
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
                    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-left group border-2 border-gray-100 hover:border-black"
                >
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center group-hover:bg-white group-hover:border-2 group-hover:border-black transition-all duration-200">
                                <svg className="w-6 h-6 text-white group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-black mb-2">
                                Create New Post
                            </h4>
                            <p className="text-gray-600 leading-relaxed">Write and publish a new blog post to share your thoughts</p>
                        </div>
                    </div>
                </button>

                <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-100">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gray-100 border-2 border-gray-300 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-black mb-2">
                                Manage Posts
                            </h4>
                            <p className="text-gray-600 leading-relaxed">Edit, publish, or delete your existing posts</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-100">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gray-100 border-2 border-gray-300 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-black mb-2">
                                Analytics
                            </h4>
                            <p className="text-gray-600 leading-relaxed">View your post statistics and insights</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Welcome Message */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-bold text-black mb-2">
                            Welcome to your dashboard!
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            From here you can create new blog posts, manage your existing content, and track your writing progress.
                            Click "Create New Post" to get started with your first article.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
