import React from 'react';
import Image from 'next/image';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  useLogo?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Loading...',
  useLogo = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const logoSizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-14 w-14'
  };

  if (useLogo) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className={`${logoSizeClasses[size]} relative`}>
          <Image
            src="/images/logos/COSMT.png"
            alt="COSMT Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-gray-400 rounded animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1 h-1 bg-gray-400 rounded animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1 h-1 bg-gray-400 rounded animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        {text && (
          <p className="text-cosmt-sm text-gray-600">{text}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`animate-spin rounded-full border-b-2 border-green-600 ${sizeClasses[size]}`}></div>
      {text && (
        <p className="text-cosmt-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};
