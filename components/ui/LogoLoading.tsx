import React from 'react';
import Image from 'next/image';

interface LogoLoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
}

export const LogoLoading: React.FC<LogoLoadingProps> = ({ 
  size = 'md', 
  text = 'Loading...',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
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
        <p className={`text-gray-600 dark:text-gray-300 ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
};
