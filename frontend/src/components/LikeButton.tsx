'use client';

import { useState } from 'react';
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
    onLikeChange
}: LikeButtonProps) {
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const handleLikeToggle = async () => {
        if (!isAuthenticated) {
            alert('Please sign in to like posts');
            return;
        }

        setLoading(true);
        try {
            if (isLiked) {
                await LikesService.unlikePost(postSlug);
                const newCount = Math.max(0, likesCount - 1);
                setLikesCount(newCount);
                setIsLiked(false);
                onLikeChange?.(newCount, false);
            } else {
                await LikesService.likePost(postSlug);
                const newCount = likesCount + 1;
                setLikesCount(newCount);
                setIsLiked(true);
                onLikeChange?.(newCount, true);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            alert('Failed to update like. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLikeToggle}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isLiked
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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