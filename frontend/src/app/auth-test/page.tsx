'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { PostsService } from '@/services';

export default function AuthTestPage() {
    const {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        getAccessToken,
        getRefreshToken,
    } = useAuth();

    const [testResults, setTestResults] = useState<string[]>([]);
    const [testCredentials] = useState({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass123',
    });

    const addTestResult = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setTestResults((prev) => [...prev, `[${timestamp}] ${message}`]);
    };

    const clearResults = () => setTestResults([]);

    const testLogin = async () => {
        try {
            addTestResult('🔄 Testing login...');
            await login({
                username: testCredentials.username,
                password: testCredentials.password,
            });
            addTestResult('✅ Login successful');
        } catch (error) {
            addTestResult(`❌ Login failed: ${(error as Error).message}`);
        }
    };

    const testRegister = async () => {
        try {
            addTestResult('🔄 Testing registration...');
            await register({
                username: testCredentials.username,
                email: testCredentials.email,
                password: testCredentials.password,
                first_name: 'Test',
                last_name: 'User',
            });
            addTestResult('✅ Registration successful');
        } catch (error) {
            addTestResult(`❌ Registration failed: ${(error as Error).message}`);
        }
    };

    const testLogout = async () => {
        try {
            addTestResult('🔄 Testing logout...');
            await logout();
            addTestResult('✅ Logout successful');
        } catch (error) {
            addTestResult(`❌ Logout failed: ${(error as Error).message}`);
        }
    };

    const testTokenRefresh = async () => {
        try {
            addTestResult('🔄 Testing token refresh by making API call...');
            await PostsService.getAllPosts({ page: 1, page_size: 1 });
            addTestResult('✅ Token refresh test successful (API call completed)');
        } catch (error) {
            addTestResult(
                `❌ Token refresh test failed: ${(error as Error).message}`
            );
        }
    };

    const testProtectedRoute = () => {
        addTestResult('🔄 Testing protected route access...');
        if (isAuthenticated) {
            addTestResult('✅ Protected route access: ALLOWED (user authenticated)');
        } else {
            addTestResult(
                '❌ Protected route access: BLOCKED (user not authenticated)'
            );
        }
    };

    const showTokenInfo = () => {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();

        addTestResult('📋 Token Information:');
        addTestResult(`  Access Token: ${accessToken ? 'Present' : 'Not found'}`);
        addTestResult(`  Refresh Token: ${refreshToken ? 'Present' : 'Not found'}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Authentication System Test
                </h1>

                {/* Current Status */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Current Status</h2>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <span
                                className={`w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}
                            ></span>
                            <span className="font-medium">
                                Status:{' '}
                                {loading
                                    ? 'Loading...'
                                    : isAuthenticated
                                        ? 'Authenticated'
                                        : 'Not Authenticated'}
                            </span>
                        </div>
                        {user && (
                            <div className="ml-5 text-sm text-gray-600">
                                <p>
                                    User: {user.username} ({user.email})
                                </p>
                                <p>
                                    Name: {user.first_name} {user.last_name}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Test Credentials */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-blue-900 mb-2">Test Credentials</h3>
                    <div className="text-sm text-blue-800">
                        <p>Username: {testCredentials.username}</p>
                        <p>Email: {testCredentials.email}</p>
                        <p>Password: {testCredentials.password}</p>
                        <p className="mt-2 text-blue-600">
                            <strong>Note:</strong> These are mock credentials for testing. The
                            actual authentication will depend on your backend setup.
                        </p>
                    </div>
                </div>

                {/* Test Controls */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                            onClick={testRegister}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            disabled={loading}
                        >
                            Test Register
                        </button>

                        <button
                            onClick={testLogin}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            disabled={loading}
                        >
                            Test Login
                        </button>

                        <button
                            onClick={testLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            disabled={loading || !isAuthenticated}
                        >
                            Test Logout
                        </button>

                        <button
                            onClick={testTokenRefresh}
                            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                            disabled={loading || !isAuthenticated}
                        >
                            Test Refresh
                        </button>

                        <button
                            onClick={testProtectedRoute}
                            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                            disabled={loading}
                        >
                            Test Protected
                        </button>

                        <button
                            onClick={showTokenInfo}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                            Show Tokens
                        </button>

                        <button
                            onClick={clearResults}
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                        >
                            Clear Results
                        </button>
                    </div>
                </div>

                {/* Test Results */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Test Results</h2>
                        <span className="text-sm text-gray-500">
                            {testResults.length} test{testResults.length !== 1 ? 's' : ''} run
                        </span>
                    </div>

                    <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
                        {testResults.length === 0 ? (
                            <p className="text-gray-500">
                                No tests run yet. Click a test button above.
                            </p>
                        ) : (
                            testResults.map((result, index) => (
                                <div key={index} className="mb-1">
                                    {result}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 flex justify-center space-x-4">
                    <Link
                        href="/"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Back to Home
                    </Link>
                    {isAuthenticated && (
                        <Link
                            href="/dashboard"
                            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                        >
                            Go to Dashboard
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
