'use client';

import { Component } from 'react';
import Link from 'next/link';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: string;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo: errorInfo.componentStack || undefined,
        });
    }

    render() {
        if (this.state.hasError) {
            const reset = () => {
                this.setState({ hasError: false, error: undefined, errorInfo: undefined });
            };

            if (this.props.fallback) {
                const FallbackComponent = this.props.fallback;
                return <FallbackComponent error={this.state.error} reset={reset} />;
            }

            return <DefaultErrorFallback error={this.state.error} reset={reset} />;
        }

        return this.props.children;
    }
}

interface ErrorFallbackProps {
    error?: Error;
    reset: () => void;
}

function DefaultErrorFallback({ error, reset }: ErrorFallbackProps) {
    const isAPIError = error?.message?.includes('fetch') || error?.message?.includes('API');
    const isNetworkError = error?.message?.includes('NetworkError') || error?.message?.includes('Failed to fetch');

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                {/* Error Icon */}
                <div className="mb-8">
                    <div className="w-32 h-32 mx-auto border-4 border-red-500 rounded-full flex items-center justify-center bg-red-50">
                        <svg
                            className="w-16 h-16 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v3m0 3h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-black mb-2">
                            {isNetworkError ? 'Connection Error' : isAPIError ? 'Service Error' : 'Something went wrong'}
                        </h1>
                        <p className="text-gray-600 text-lg">
                            {isNetworkError
                                ? 'Please check your internet connection and try again.'
                                : isAPIError
                                    ? 'Our service is temporarily unavailable. Please try again in a moment.'
                                    : 'An unexpected error occurred. We apologize for the inconvenience.'
                            }
                        </p>
                    </div>

                    {/* Error Details (only in development) */}
                    {process.env.NODE_ENV === 'development' && error && (
                        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-left">
                            <h3 className="font-semibold text-gray-900 mb-2">Error Details:</h3>
                            <code className="text-sm text-red-600 break-all">
                                {error.message}
                            </code>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={reset}
                            className="inline-flex items-center justify-center px-6 py-3 border-2 border-black text-white bg-black rounded-lg hover:bg-white hover:text-black transition-all duration-200 font-semibold"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Try Again
                        </button>

                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-black bg-white rounded-lg hover:border-black hover:bg-gray-50 transition-all duration-200 font-semibold"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reload Page
                        </button>
                    </div>

                    {/* Help Links */}
                    <div className="pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-4">
                            Need help? Try these options:
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <Link
                                href="/"
                                className="text-sm text-black hover:underline px-2 py-1 rounded transition-colors"
                            >
                                Home Page
                            </Link>
                            <button
                                onClick={() => window.history.back()}
                                className="text-sm text-black hover:underline px-2 py-1 rounded transition-colors"
                            >
                                Go Back
                            </button>
                            <Link
                                href="/dashboard"
                                className="text-sm text-black hover:underline px-2 py-1 rounded transition-colors"
                            >
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Hook for using error boundary in functional components
export function useErrorHandler() {
    return (error: Error) => {
        throw error;
    };
}