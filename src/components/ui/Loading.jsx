import React from 'react';
import { cn } from '../../utils/cn';

const Loading = ({
  size = 'medium',
  variant = 'inline',
  message = 'Loading...',
  className,
}) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };
  
  const Spinner = () => (
    <svg
      className={cn('animate-spin text-primary', sizes[size])}
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
  
  if (variant === 'fullscreen') {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 animate-fade-in">
        <div className="flex flex-col items-center space-y-16">
          <Spinner />
          <p className="text-lg font-inter text-secondary font-medium">{message}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn('flex items-center space-x-8', className)}>
      <Spinner />
      {message && (
        <span className="text-body font-inter text-gray-600">{message}</span>
      )}
    </div>
  );
};

export default Loading;