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
        } catch { }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b-2 border-gray-100 shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                <div className="flex justify-between items-center h-14 sm:h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link
                            href="/"
                            className="flex items-center space-x-1 sm:space-x-2 text-black hover:text-gray-700 transition-all duration-300 group"
                            onClick={closeMenu}
                        >
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg">
                                <span className="text-white font-bold text-sm sm:text-lg transition-transform duration-300 group-hover:scale-110">
                                    S
                                </span>
                            </div>
                            <span className="text-lg sm:text-xl font-bold hidden xs:block transition-all duration-300 group-hover:tracking-wide">
                                StackJournal
                            </span>
                            <span className="text-lg sm:text-xl font-bold block xs:hidden transition-all duration-300 group-hover:tracking-wide">
                                SJ
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:block">
                        <div className="ml-8 flex items-baseline space-x-6">
                            <Link
                                href="/"
                                className="text-black hover:text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-gray-50 hover:scale-105 active:scale-95"
                            >
                                Home
                            </Link>
                            <Link
                                href="/#posts"
                                className="text-black hover:text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-gray-50 hover:scale-105 active:scale-95"
                            >
                                Posts
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden lg:block">
                        <div className="flex items-center space-x-3">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="text-black hover:text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-gray-50 hover:scale-105 active:scale-95"
                                    >
                                        Dashboard
                                    </Link>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg">
                                            <span className="text-white text-xs font-medium">
                                                {user?.username?.charAt(0)?.toUpperCase() ||
                                                    user?.email?.charAt(0)?.toUpperCase() ||
                                                    '?'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="bg-black text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-black hover:text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-gray-50 hover:scale-105 active:scale-95"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-black hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black transition-all duration-300 hover:scale-110 active:scale-95"
                            aria-expanded={isMenuOpen}
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            <span className="sr-only">
                                {isMenuOpen ? 'Close' : 'Open'} main menu
                            </span>
                            <div className="block h-5 w-5 sm:h-6 sm:w-6">
                                {!isMenuOpen ? (
                                    <svg
                                        className="h-full w-full"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-full w-full"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`lg:hidden border-t-2 border-gray-100 transition-all duration-300 ease-in-out ${isMenuOpen
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
            >
                <div className="px-3 pt-3 pb-4 space-y-1 bg-white shadow-xl">
                    <Link
                        href="/"
                        className="text-black hover:text-gray-700 hover:bg-gray-50 block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200"
                        onClick={closeMenu}
                    >
                        Home
                    </Link>
                    <Link
                        href="/#posts"
                        className="text-black hover:text-gray-700 hover:bg-gray-50 block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200"
                        onClick={closeMenu}
                    >
                        Posts
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="text-black hover:text-gray-700 hover:bg-gray-50 block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200"
                                onClick={closeMenu}
                            >
                                Dashboard
                            </Link>
                            <div className="px-4 py-3 border-t border-gray-100 mt-2">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                            {user?.username?.charAt(0)?.toUpperCase() ||
                                                user?.email?.charAt(0)?.toUpperCase() ||
                                                '?'}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {user?.username || user?.email || 'User'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        closeMenu();
                                    }}
                                    className="w-full bg-black text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-black hover:text-gray-700 hover:bg-gray-50 block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200"
                                onClick={closeMenu}
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="bg-black text-white hover:bg-gray-800 block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 mx-4 mt-2"
                                onClick={closeMenu}
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
