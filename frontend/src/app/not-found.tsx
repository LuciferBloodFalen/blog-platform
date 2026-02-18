'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <div className="relative">
                        <div className="text-9xl font-bold text-black opacity-10 select-none">
                            404
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 border-4 border-black rounded-full flex items-center justify-center">
                                <svg
                                    className="w-16 h-16 text-black"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12C18 6.477 13.523 2 8 2S-2 6.477-2 12c0 2.042.777 3.908 2.05 5.334L5 20l3.172-2.828z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-black mb-2">
                            Page Not Found
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Sorry, the page you're looking for doesn't exist or has been moved.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-black bg-white rounded-lg hover:border-black hover:bg-gray-50 transition-all duration-200 font-semibold"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Go Back
                        </button>

                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-6 py-3 border-2 border-black text-white bg-black rounded-lg hover:bg-white hover:text-black transition-all duration-200 font-semibold"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Back to Home
                        </Link>
                    </div>

                    {/* Help Text */}
                    <div className="pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-4">
                            Looking for something specific?
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <Link
                                href="/"
                                className="text-sm text-black hover:underline px-2 py-1 rounded transition-colors"
                            >
                                Browse Posts
                            </Link>
                            <Link
                                href="/login"
                                className="text-sm text-black hover:underline px-2 py-1 rounded transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="text-sm text-black hover:underline px-2 py-1 rounded transition-colors"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}