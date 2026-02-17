'use client';

import { Header } from './Header';

interface HomePageClientProps {
    children: React.ReactNode;
}

export function HomePageClient({ children }: HomePageClientProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header />
            {children}
        </div>
    );
}