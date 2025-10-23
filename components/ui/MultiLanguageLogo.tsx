'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRTL } from '../../contexts/UnifiedLanguageContext';

interface MultiLanguageLogoProps {
  width?: number;
  height?: number;
  className?: string;
  href?: string;
  priority?: boolean;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const MultiLanguageLogo: React.FC<MultiLanguageLogoProps> = ({
  width = 90,
  height = 30,
  className = '',
  href = '/',
  priority = false,
  showText = false,
  size = 'md'
}) => {
  const [imageError, setImageError] = React.useState(false);
  
  // Debug: Log the current state
  React.useEffect(() => {
    console.log('Logo component rendered, imageError:', imageError);
  }, [imageError]);
  
  // Always call the hook - it has built-in fallback handling
  const context = useRTL();
  const { isRTL, language } = context;

  // Size configurations
  const sizeConfig = {
    sm: { width: 80, height: 30, textSize: 'text-xs' },
    md: { width: 130, height: 40, textSize: 'text-sm' },
    lg: { width: 160, height: 50, textSize: 'text-base' },
    xl: { width: 190, height: 60, textSize: 'text-lg' }
  };

  const config = sizeConfig[size];
  const finalWidth = width || config.width;
  const finalHeight = height || config.height;

  // Language-specific alt text
  const getAltText = () => {
    switch (language) {
      case 'ar':
        return 'شعار COSMT';
      case 'tr':
        return 'COSMT Logosu';
      case 'de':
        return 'COSMT Logo';
      case 'fr':
        return 'Logo COSMT';
      case 'es':
        return 'Logo COSMT';
      default:
        return 'COSMT Logo';
    }
  };

  // Language-specific brand text
  const getBrandText = () => {
    switch (language) {
      case 'ar':
        return 'سوق التجميل';
      case 'tr':
        return 'Kozmetik Pazarı';
      case 'de':
        return 'Kosmetikmarkt';
      case 'fr':
        return 'Marché Cosmétique';
      case 'es':
        return 'Mercado Cosmético';
      default:
        return 'Cosmetic Market';
    }
  };

  const logoElement = (
    <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'} ${className}`}>
      {/* Use the actual logo image */}
      <img
        src="/images/logos/COSMT.png"
        alt={getAltText()}
        width={finalWidth}
        height={finalHeight}
        className={`h-auto hover:opacity-80 transition-opacity duration-200 ${
          isRTL ? 'ml-2' : 'mr-2'
        }`}
        onError={(e) => {
          console.error('Logo failed to load:', e);
          setImageError(true);
        }}
        onLoad={() => {
          console.log('Logo loaded successfully');
        }}
        style={{
          // Ensure logo doesn't get flipped in RTL
          transform: 'none',
          direction: 'ltr'
        }}
      />
      
      {showText && (
        <span className={`font-semibold text-gray-800 dark:text-gray-200 ${config.textSize}`}>
          {getBrandText()}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
};

export default MultiLanguageLogo;
