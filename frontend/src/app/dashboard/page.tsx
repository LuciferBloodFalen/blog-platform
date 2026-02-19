'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PostForm } from '@/components/PostForm';
import { PostList } from '@/components/PostList';
import { DeleteModal } from '@/components/DeleteModal';
import { Post } from '@/types/api';

// Update page title
if (typeof window !== 'undefined') {
    document.title = 'Dashboard - StackJournal';
}

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

    // Update document title based on current view
    useEffect(() => {
        const pageTitles = {
            overview: 'Dashboard - StackJournal',
            posts: 'My Posts - StackJournal',
            'create-post': 'Create Post - StackJournal',
            'edit-post': 'Edit Post - StackJournal'
        };

        if (typeof window !== 'undefined') {
            document.title = pageTitles[currentView] || 'Dashboard - StackJournal';
        }
    }, [currentView]);

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
            <main className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
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
        <div className="space-y-6 sm:space-y-8">
            {/* User Info Card */}
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border-2 border-gray-100">
                <div className="px-4 py-6 sm:px-6 sm:py-8 lg:p-8">
                    <h3 className="text-lg sm:text-xl leading-6 font-bold text-black mb-4 sm:mb-6">
                        Account Information
                    </h3>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8">
                        <div>
                            <dt className="text-sm font-semibold text-black">
                                Username
                            </dt>
                            <dd className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-700">
                                {user?.username}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-semibold text-black">Email</dt>
                            <dd className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-700">{user?.email}</dd>
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
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                <button
                    onClick={onCreatePost}
                    className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 text-left group border-2 border-gray-100 hover:border-black hover:scale-[1.02] hover:-translate-y-1 transform-gpu"
                >
                    <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center group-hover:bg-white group-hover:border-2 group-hover:border-black transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-black transition-all duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg sm:text-xl font-bold text-black mb-1 sm:mb-2 transition-all duration-300 group-hover:text-gray-900 group-hover:tracking-wide">
                                Create New Post
                            </h4>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-gray-700">Write and publish a new blog post to share your thoughts</p>
                        </div>
                    </div>
                </button>

                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border-2 border-gray-100 transition-all duration-500 hover:shadow-xl hover:border-gray-200 hover:scale-[1.01] group transform-gpu">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 border-2 border-gray-300 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-gray-50 group-hover:border-gray-400 group-hover:scale-110">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg sm:text-xl font-bold text-black mb-1 sm:mb-2 transition-colors duration-300 group-hover:text-gray-800">
                                Manage Posts
                            </h4>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-gray-700">Edit, publish, or delete your existing posts</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border-2 border-gray-100 transition-all duration-500 hover:shadow-xl hover:border-gray-200 hover:scale-[1.01] group transform-gpu">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 border-2 border-gray-300 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-gray-50 group-hover:border-gray-400 group-hover:scale-110 group-hover:rotate-3">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg sm:text-xl font-bold text-black mb-1 sm:mb-2 transition-colors duration-300 group-hover:text-gray-800">
                                Analytics
                            </h4>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-gray-700">View your post statistics and insights</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Welcome Message */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 sm:p-8">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-full flex items-center justify-center">
                            <svg className="h-3 w-3 sm:h-5 sm:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="ml-3 sm:ml-4">
                        <h3 className="text-base sm:text-lg font-bold text-black mb-1 sm:mb-2">
                            Welcome to your dashboard!
                        </h3>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                            From here you can create new blog posts, manage your existing content, and track your writing progress.
                            Click "Create New Post" to get started with your first article.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
