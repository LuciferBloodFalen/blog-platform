'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'black' | 'white' | 'gray';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colorClasses = {
  black: 'text-black',
  white: 'text-white',
  gray: 'text-gray-600',
};

export function LoadingSpinner({
  size = 'md',
  color = 'black',
  className = '',
}: LoadingSpinnerProps) {
  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

interface LoadingCardProps {
  count?: number;
  className?: string;
}

export function LoadingCard({ count = 1, className = '' }: LoadingCardProps) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`bg-white rounded-lg shadow-lg animate-pulse ${className}`}
        >
          <div className="aspect-video bg-gray-300 rounded-t-lg"></div>
          <div className="p-6 space-y-3">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6"></div>
              <div className="h-3 bg-gray-300 rounded w-4/5"></div>
            </div>
            <div className="flex space-x-2 pt-2">
              <div className="h-6 bg-gray-300 rounded-full w-16"></div>
              <div className="h-6 bg-gray-300 rounded-full w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

interface LoadingListProps {
  count?: number;
  className?: string;
}

export function LoadingList({ count = 5, className = '' }: LoadingListProps) {
  return (
    <div
      className={`bg-white shadow-lg rounded-lg border-2 border-gray-100 ${className}`}
    >
      <div className="px-8 py-6 border-b border-gray-100">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      </div>

      <div className="divide-y divide-gray-100">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="p-8 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LoadingButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const buttonSizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const buttonVariantClasses = {
  primary:
    'text-white bg-black border-2 border-black hover:bg-white hover:text-black',
  secondary:
    'text-black bg-white border-2 border-gray-300 hover:border-black hover:bg-gray-50',
};

export function LoadingButton({
  children,
  loading = false,
  disabled = false,
  size = 'md',
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
}: LoadingButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
                inline-flex items-center justify-center font-semibold rounded-lg 
                transition-all duration-200 min-w-[100px]
                ${buttonSizeClasses[size]} 
                ${buttonVariantClasses[variant]}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${className}
            `}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <LoadingSpinner
            size="sm"
            color={variant === 'primary' ? 'white' : 'black'}
          />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
