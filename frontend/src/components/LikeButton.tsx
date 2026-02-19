'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LikesService } from '@/services';

interface LikeButtonProps {
    postSlug: string;
    initialLikesCount?: number;
    initialIsLiked?: boolean;
    onLikeChange?: (newCount: number, isLiked: boolean) => void;
}

export function LikeButton({
    postSlug,
    initialLikesCount = 0,
    initialIsLiked = false,
    onLikeChange,
}: LikeButtonProps) {
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [loading, setLoading] = useState(false);
    const [statusLoaded, setStatusLoaded] = useState(false);
    const { isAuthenticated } = useAuth();

    // Fetch current like status when component mounts (if authenticated)
    useEffect(() => {
        const fetchLikeStatus = async () => {
            if (!statusLoaded && isAuthenticated) {
                try {
                    const status = await LikesService.getLikeStatus(postSlug);
                    setLikesCount(status.likes_count);
                    setIsLiked(status.liked);
                } catch {
                } finally {
                    setStatusLoaded(true);
                }
            } else if (!isAuthenticated) {
                setStatusLoaded(true);
            }
        };

        fetchLikeStatus();
    }, [postSlug, isAuthenticated, statusLoaded]);

    const handleLikeToggle = async () => {
        if (!isAuthenticated) {
            alert('Please sign in to like posts');
            return;
        }

        setLoading(true);
        try {
            let response;
            if (isLiked) {
                response = await LikesService.unlikePost(postSlug);
            } else {
                response = await LikesService.likePost(postSlug);
            }

            // Use server response to update UI
            setLikesCount(response.likes_count);
            setIsLiked(response.liked);
            onLikeChange?.(response.likes_count, response.liked);
        } catch {
            alert('Failed to update like. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLikeToggle}
            disabled={loading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${isLiked
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 border-2 border-red-200 hover:border-red-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200 hover:border-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
        >
            <svg
                className={`w-5 h-5 transition-colors ${isLiked ? 'fill-current text-red-600' : 'stroke-current fill-none'
                    }`}
                viewBox="0 0 24 24"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
            <span className="font-medium">{likesCount}</span>
            {loading && (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            )}
        </button>
    );
}
