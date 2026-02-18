'use client';

import Link from 'next/link';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
    secondaryActionLabel?: string;
    secondaryActionHref?: string;
    onSecondaryAction?: () => void;
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    actionHref,
    onAction,
    secondaryActionLabel,
    secondaryActionHref,
    onSecondaryAction,
    className = ''
}: EmptyStateProps) {
    return (
        <div className={`text-center py-20 px-8 ${className}`}>
            {/* Icon */}
            <div className="mx-auto w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-8 border border-gray-100">
                {icon || (
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                )}
            </div>

            {/* Content */}
            <div className="space-y-6">
                <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">{title}</h4>
                    <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Actions */}
                {(actionLabel || secondaryActionLabel) && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {actionLabel && (
                            actionHref ? (
                                <Link
                                    href={actionHref}
                                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-black text-white bg-black rounded-lg hover:bg-white hover:text-black transition-all duration-200 font-semibold"
                                >
                                    {actionLabel}
                                </Link>
                            ) : (
                                <button
                                    onClick={onAction}
                                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-black text-white bg-black rounded-lg hover:bg-white hover:text-black transition-all duration-200 font-semibold"
                                >
                                    {actionLabel}
                                </button>
                            )
                        )}

                        {secondaryActionLabel && (
                            secondaryActionHref ? (
                                <Link
                                    href={secondaryActionHref}
                                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-black bg-white rounded-lg hover:border-black hover:bg-gray-50 transition-all duration-200 font-semibold"
                                >
                                    {secondaryActionLabel}
                                </Link>
                            ) : (
                                <button
                                    onClick={onSecondaryAction}
                                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-black bg-white rounded-lg hover:border-black hover:bg-gray-50 transition-all duration-200 font-semibold"
                                >
                                    {secondaryActionLabel}
                                </button>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Predefined empty states for common scenarios
export function NoPostsEmptyState({ onCreatePost }: { onCreatePost?: () => void }) {
    return (
        <EmptyState
            icon={
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            }
            title="No posts yet"
            description="You haven't created any posts yet. Start writing to share your thoughts with the world!"
            actionLabel="Create Your First Post"
            onAction={onCreatePost}
            secondaryActionLabel="Browse Posts"
            secondaryActionHref="/"
        />
    );
}

export function SearchEmptyState({ searchTerm, onClear }: { searchTerm?: string; onClear?: () => void }) {
    return (
        <EmptyState
            icon={
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            }
            title="No results found"
            description={searchTerm ? `No posts found matching "${searchTerm}". Try adjusting your search criteria.` : "No posts match your current filters. Try adjusting your search criteria."}
            actionLabel="Clear Search"
            onAction={onClear}
            secondaryActionLabel="Browse All Posts"
            secondaryActionHref="/"
        />
    );
}

export function NetworkErrorEmptyState({ onRetry }: { onRetry?: () => void }) {
    return (
        <EmptyState
            icon={
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            }
            title="Connection Error"
            description="Unable to load content. Please check your internet connection and try again."
            actionLabel="Try Again"
            onAction={onRetry}
            secondaryActionLabel="Go Home"
            secondaryActionHref="/"
        />
    );
}

export function LoadingErrorEmptyState({ onRetry }: { onRetry?: () => void }) {
    return (
        <EmptyState
            icon={
                <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 3h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            }
            title="Failed to load posts"
            description="There was an error loading the posts. Please try again later."
            actionLabel="Try Again"
            onAction={onRetry}
            secondaryActionLabel="Go Home"
            secondaryActionHref="/"
        />
    );
}

export function NoCommentsEmptyState({ isAuthenticated }: { isAuthenticated?: boolean }) {
    return (
        <div className="text-center py-12 px-8">
            <div className="mx-auto w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </div>

            <h4 className="text-lg font-semibold text-gray-900 mb-2">No comments yet</h4>
            <p className="text-gray-600 mb-4">
                {isAuthenticated
                    ? "Be the first to share your thoughts on this post!"
                    : "Sign in to be the first to comment on this post."
                }
            </p>

            {!isAuthenticated && (
                <Link
                    href="/login"
                    className="inline-flex items-center px-4 py-2 border-2 border-black text-white bg-black rounded-lg hover:bg-white hover:text-black transition-all duration-200 font-medium"
                >
                    Sign in to comment
                </Link>
            )}
        </div>
    );
}