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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <a
                            href="/register"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            create a new account
                        </a>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Email Address"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            ← Back to home
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
