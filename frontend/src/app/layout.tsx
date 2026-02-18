import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import AuthInitializer from '@/components/AuthInitializer';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StackJournal',
  description: 'A modern platform for developers and tech enthusiasts to share knowledge and insights',
  openGraph: {
    title: 'StackJournal',
    description: 'A modern platform for developers and tech enthusiasts to share knowledge and insights',
    siteName: 'StackJournal',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StackJournal',
    description: 'A modern platform for developers and tech enthusiasts to share knowledge and insights',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <AuthInitializer>
            <ErrorBoundary>
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </ErrorBoundary>
          </AuthInitializer>
        </AuthProvider>
      </body>
    </html>
  );
}
