'use client';

import { useState } from 'react';
import Link from 'next/link';

interface APIErrorProps {
  error: Error | string;
  onRetry?: () => void;
  showRetry?: boolean;
  className?: string;
}

interface APIErrorDetails {
  type: 'network' | 'auth' | 'validation' | 'server' | 'unknown';
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

function parseError(error: Error | string): APIErrorDetails {
  const errorMessage = typeof error === 'string' ? error : error.message;
  // const errorName = typeof error === 'string' ? '' : error.name;

  // Network errors
  if (
    errorMessage.includes('NetworkError') ||
    errorMessage.includes('Failed to fetch') ||
    errorMessage.includes('ERR_NETWORK')
  ) {
    return {
      type: 'network',
      title: 'Connection Error',
      message:
        'Unable to connect to the server. Please check your internet connection and try again.',
    };
  }

  // Authentication errors
  if (
    errorMessage.includes('401') ||
    errorMessage.includes('Unauthorized') ||
    errorMessage.includes('authentication')
  ) {
    return {
      type: 'auth',
      title: 'Authentication Required',
      message: 'You need to sign in to access this content.',
      actionLabel: 'Sign In',
      actionHref: '/login',
    };
  }

  // Validation errors
  if (
    errorMessage.includes('400') ||
    errorMessage.includes('validation') ||
    errorMessage.includes('Bad Request')
  ) {
    return {
      type: 'validation',
      title: 'Invalid Request',
      message:
        'The information provided is invalid. Please check your input and try again.',
    };
  }

  // Server errors
  if (
    errorMessage.includes('500') ||
    errorMessage.includes('502') ||
    errorMessage.includes('503') ||
    errorMessage.includes('Internal Server Error')
  ) {
    return {
      type: 'server',
      title: 'Server Error',
      message:
        'Our servers are experiencing issues. Please try again in a few moments.',
    };
  }

  // Rate limiting
  if (
    errorMessage.includes('429') ||
    errorMessage.includes('Too Many Requests')
  ) {
    return {
      type: 'server',
      title: 'Too Many Requests',
      message:
        'You are making requests too quickly. Please wait a moment before trying again.',
    };
  }

  // Forbidden
  if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
    return {
      type: 'auth',
      title: 'Access Denied',
      message: "You don't have permission to access this content.",
      actionLabel: 'Go Home',
      actionHref: '/',
    };
  }

  // Not found
  if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
    return {
      type: 'unknown',
      title: 'Content Not Found',
      message:
        "The content you're looking for doesn't exist or has been moved.",
      actionLabel: 'Go Home',
      actionHref: '/',
    };
  }

  // Default unknown error
  return {
    type: 'unknown',
    title: 'Something Went Wrong',
    message: errorMessage || 'An unexpected error occurred. Please try again.',
  };
}

export function APIError({
  error,
  onRetry,
  showRetry = true,
  className = '',
}: APIErrorProps) {
  const [retryCount, setRetryCount] = useState(0);
  const errorDetails = parseError(error);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    onRetry?.();
  };

  const getErrorIcon = () => {
    switch (errorDetails.type) {
      case 'network':
        return (
          <svg
            className="w-16 h-16 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'auth':
        return (
          <svg
            className="w-16 h-16 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        );
      case 'server':
        return (
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'validation':
        return (
          <svg
            className="w-16 h-16 text-orange-500"
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
        );
      default:
        return (
          <svg
            className="w-16 h-16 text-gray-500"
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
        );
    }
  };

  return (
    <div className={`text-center py-12 px-8 ${className}`}>
      {/* Error Icon */}
      <div className="mx-auto w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-8 border border-gray-100">
        {getErrorIcon()}
      </div>

      {/* Content */}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {errorDetails.title}
          </h3>
          <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
            {errorDetails.message}
          </p>
        </div>

        {/* Retry count indicator */}
        {retryCount > 0 && (
          <div className="text-sm text-gray-500">Attempts: {retryCount}</div>
        )}

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-left max-w-md mx-auto">
            <summary className="cursor-pointer font-semibold text-gray-900 mb-2">
              Debug Information
            </summary>
            <code className="text-xs text-gray-600 break-all">
              {typeof error === 'string'
                ? error
                : `${error.name}: ${error.message}`}
            </code>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {showRetry && onRetry && (
            <button
              onClick={handleRetry}
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-black text-white bg-black rounded-lg hover:bg-white hover:text-black transition-all duration-200 font-semibold"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
          )}

          {errorDetails.actionLabel && errorDetails.actionHref && (
            <Link
              href={errorDetails.actionHref}
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-black bg-white rounded-lg hover:border-black hover:bg-gray-50 transition-all duration-200 font-semibold"
            >
              {errorDetails.actionLabel}
            </Link>
          )}

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-black bg-white rounded-lg hover:border-black hover:bg-gray-50 transition-all duration-200 font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

// Toast notification for smaller errors
interface APIErrorToastProps {
  error: Error | string;
  onClose: () => void;
  duration?: number;
}

export function APIErrorToast({
  error,
  onClose,
  duration = 5000,
}: APIErrorToastProps) {
  const errorDetails = parseError(error);

  useState(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  });

  return (
    <div className="fixed top-4 right-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-xl max-w-md z-50">
      <div className="flex items-start">
        <svg
          className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex-1">
          <h4 className="font-semibold text-red-800 text-sm">
            {errorDetails.title}
          </h4>
          <p className="text-red-700 text-sm mt-1">{errorDetails.message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-red-500 hover:text-red-700 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
