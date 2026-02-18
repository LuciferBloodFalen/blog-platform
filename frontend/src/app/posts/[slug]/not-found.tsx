'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PostNotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                {/* Post Not Found Illustration */}
                <div className="mb-8">
                    <div className="w-32 h-32 mx-auto border-4 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                        <svg
                            className="w-16 h-16 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-black mb-2">
                            Post Not Found
                        </h1>
                        <p className="text-gray-600 text-lg">
                            The blog post you're looking for doesn't exist or has been removed.
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16l4-4m0 0l4 4m-4-4v12" />
                            </svg>
                            Browse Posts
                        </Link>
                    </div>

                    {/* Suggestions */}
                    <div className="pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-4">
                            You might be interested in:
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <Link
                                href="/?category=technology"
                                className="text-sm text-black hover:underline px-3 py-1 bg-gray-50 rounded-full border border-gray-200 hover:border-black transition-colors"
                            >
                                Technology Posts
                            </Link>
                            <Link
                                href="/?category=programming"
                                className="text-sm text-black hover:underline px-3 py-1 bg-gray-50 rounded-full border border-gray-200 hover:border-black transition-colors"
                            >
                                Programming Tips
                            </Link>
                            <Link
                                href="/dashboard"
                                className="text-sm text-black hover:underline px-3 py-1 bg-gray-50 rounded-full border border-gray-200 hover:border-black transition-colors"
                            >
                                My Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}