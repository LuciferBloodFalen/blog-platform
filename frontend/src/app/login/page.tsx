'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, isAuthenticated } = useAuth();
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData);
            router.push('/dashboard');
        } catch (err) {
            if (err instanceof Error) {
                // Check if it's an API error with validation details
                const apiError = err as any;
                if (apiError.response && apiError.response.data) {
                    const validationErrors = apiError.response.data;
                    // Format validation errors for display
                    if (typeof validationErrors === 'object') {
                        const errorMessages = [];
                        for (const [field, messages] of Object.entries(validationErrors)) {
                            if (Array.isArray(messages)) {
                                errorMessages.push(`${field}: ${(messages as string[]).join(', ')}`);
                            } else if (field === 'non_field_errors' && Array.isArray(validationErrors[field])) {
                                errorMessages.push((validationErrors[field] as string[]).join(', '));
                            }
                        }
                        setError(errorMessages.join('\n') || 'Login failed');
                    } else {
                        setError(apiError.message || 'Login failed');
                    }
                } else {
                    setError(err.message);
                }
            } else {
                setError('Login failed');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="max-w-md w-full space-y-8 p-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-black">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <a
                            href="/register"
                            className="font-medium text-black hover:text-gray-700 underline transition-colors"
                        >
                            create a new account
                        </a>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-black text-white px-4 py-3 rounded-lg border-l-4 border-red-500">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 border-2 border-gray-300 rounded-lg placeholder-gray-400 text-black bg-white focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 transition-all duration-200 hover:border-gray-400"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 border-2 border-gray-300 rounded-lg placeholder-gray-400 text-black bg-white focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 transition-all duration-200 hover:border-gray-400"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center items-center py-3 px-4 border-2 border-black text-sm font-semibold rounded-lg text-white bg-black hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/"
                            className="font-medium text-black hover:text-gray-700 underline transition-colors"
                        >
                            ← Back to home
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
