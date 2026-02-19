'use client';

interface HomePageClientProps {
  children: React.ReactNode;
}

export function HomePageClient({ children }: HomePageClientProps) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
