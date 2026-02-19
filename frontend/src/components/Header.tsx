'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
    const { user, logout, isAuthenticated } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch { }
    };

    return (
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
                        {isAuthenticated ? (
                            <>
                                <span className="text-gray-600">Welcome, {user?.username}</span>
                                <Link
                                    href="/dashboard"
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
