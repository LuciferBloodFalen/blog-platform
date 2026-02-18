import { LoadingSpinner } from '@/components/Loading';

export default function Loading() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
            <div className="text-center">
                {/* Logo or App Name */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-black mb-2">StackJournal</h1>
                    <div className="w-16 h-1 bg-black mx-auto rounded-full"></div>
                </div>

                {/* Loading Spinner */}
                <div className="mb-6">
                    <LoadingSpinner size="xl" color="black" />
                </div>

                {/* Loading Text */}
                <div className="space-y-2">
                    <p className="text-lg font-medium text-black">
                        Loading...
                    </p>
                    <p className="text-gray-600 text-sm">
                        Please wait while we prepare your content
                    </p>
                </div>

                {/* Progress Bar Animation */}
                <div className="mt-8 w-48 mx-auto">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                        <div className="h-1 bg-black rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}