import React from 'react';
import Image from 'next/image';
import { MultiLanguageLogo } from './MultiLanguageLogo';

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
          {/* Static logo background */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full opacity-60 blur-md"></div>
          
          {/* Logo with enhanced glow effect */}
          <div className="relative z-10 p-2">
            <MultiLanguageLogo
              size={size}
              className="object-contain drop-shadow-2xl filter brightness-110"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.5)) drop-shadow(0 0 40px rgba(34, 197, 94, 0.3))'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`rounded-full border-2 border-gray-300 ${sizeClasses[size]}`}></div>
      {text && (
        <p className="text-cosmt-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};
