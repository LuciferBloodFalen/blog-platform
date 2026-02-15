'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { setAuthFunctions } from '@/lib/api-client';

interface AuthInitializerProps {
    children: React.ReactNode;
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
    const { getAccessToken, getRefreshToken, setTokens, clearTokens } = useAuth();

    useEffect(() => {
        // Connect auth hook functions with API client
        setAuthFunctions({
            getAccessToken,
            getRefreshToken,
            setTokens,
            clearTokens,
        });
    }, [getAccessToken, getRefreshToken, setTokens, clearTokens]);

    return <>{children}</>;
}
