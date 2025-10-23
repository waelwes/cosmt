import React from 'react';
import Image from 'next/image';
import { MultiLanguageLogo } from './MultiLanguageLogo';

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
};
