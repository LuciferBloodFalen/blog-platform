'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link
                            href="/"
                            className="flex items-center space-x-2 text-black hover:text-gray-700 transition-colors"
                            onClick={closeMenu}
                        >
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                            <span className="text-xl font-bold">StackJournal</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link
                                href="/"
                                className="text-black hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href="/posts"
                                className="text-black hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Posts
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center space-x-4">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="text-black hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                {user?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-black hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black transition-colors"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isMenuOpen ? (
                                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
                        <Link
                            href="/"
                            className="text-black hover:text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                            onClick={closeMenu}
                        >
                            Home
                        </Link>
                        <Link
                            href="/posts"
                            className="text-black hover:text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                            onClick={closeMenu}
                        >
                            Posts
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-black hover:text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                                    onClick={closeMenu}
                                >
                                    Dashboard
                                </Link>
                                <div className="px-3 py-2">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                {user?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-700">
                                            {user?.username || user?.email || 'User'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            closeMenu();
                                        }}
                                        className="w-full bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-black hover:text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                                    onClick={closeMenu}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-black text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors mx-3"
                                    onClick={closeMenu}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}