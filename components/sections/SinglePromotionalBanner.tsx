'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRTL } from '../../contexts/UnifiedLanguageContext';

interface PromoBannerProps {
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  link: string;
  buttonText?: string;
  size?: 'large' | 'medium' | 'small';
}

export const SinglePromotionalBanner: React.FC<PromoBannerProps> = ({
  image,
  title,
  subtitle,
  description,
  link,
  buttonText,
  size = 'medium'
}) => {
  const { isRTL, language } = useRTL();

  const getSizeClasses = () => {
    switch (size) {
      case 'large':
        return {
          container: 'min-h-[400px]',
          title: 'text-4xl md:text-5xl lg:text-6xl',
          subtitle: 'text-lg md:text-xl',
          description: 'text-base md:text-lg',
          button: 'px-8 py-4 text-lg',
          padding: 'p-8 md:p-12'
        };
      case 'small':
        return {
          container: 'min-h-[250px]',
          title: 'text-xl md:text-2xl',
          subtitle: 'text-xs md:text-sm',
          description: 'text-xs md:text-sm',
          button: 'px-4 py-2 text-sm',
          padding: 'p-4 md:p-6'
        };
      default: // medium
        return {
          container: 'min-h-[300px]',
          title: 'text-2xl md:text-3xl',
          subtitle: 'text-sm md:text-base',
          description: 'text-sm',
          button: 'px-6 py-3',
          padding: 'p-6 md:p-8'
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const [hasImageError, setHasImageError] = useState(false);
  const [didLogImageError, setDidLogImageError] = useState(false);

  return (
    <div className="py-2 space-y-4 lg:space-y-6">
      <div className="cosmt-container">
        <Link
          href={link}
          className="group relative overflow-hidden rounded-2xl bg-gray-100 block"
          style={{
            textDecoration: 'none',
            outline: 'none',
            height: '100%'
          }}
          onFocus={(e) => {
            e.currentTarget.style.setProperty('outline', 'none', 'important');
          }}
        >
          <div className={`relative w-full h-full ${sizeClasses.container}`}>
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              {!hasImageError ? (
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="100vw"
                  onError={(e) => {
                    if (!didLogImageError) {
                      // Log once to help debugging, avoid spamming console
                      // Use warn instead of error to avoid treating this as a runtime error
                      // eslint-disable-next-line no-console
                      console.warn('Image failed to load:', image);
                      setDidLogImageError(true);
                    }
                    setHasImageError(true);
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-center px-4">
                    <div className="text-sm text-gray-600">Image unavailable</div>
                    <div className="text-xs text-gray-500">{title}</div>
                  </div>
                </div>
              )}
              <div className={`absolute inset-0 ${
                size === 'large' 
                  ? 'bg-gradient-to-r from-purple-900/70 via-pink-900/50 to-transparent'
                  : size === 'small'
                  ? 'bg-gradient-to-t from-green-900/70 to-transparent'
                  : 'bg-gradient-to-b from-blue-900/60 via-indigo-900/40 to-transparent'
              }`}></div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
            </div>
            
            <div className={`absolute inset-0 flex flex-col ${
              size === 'large' ? 'justify-center' : 'justify-end'
            } ${sizeClasses.padding} ${
              isRTL ? 'items-end text-right' : 'items-start text-left'
            }`}>
              {subtitle && (
                <p className={`text-white ${sizeClasses.subtitle} font-medium mb-2 opacity-90`}>
                  {subtitle}
                </p>
              )}
              <h3 className={`${sizeClasses.title} font-bold text-white mb-3 ${size === 'large' ? 'mb-4' : 'mb-2'}`}>
                {title}
              </h3>
              {description && size === 'large' && (
                <p className={`text-white ${sizeClasses.description} mb-6 opacity-90 max-w-md`}>
                  {description}
                </p>
              )}
              {description && size !== 'large' && (
                <p className={`text-white ${sizeClasses.description} mb-4 opacity-90`}>
                  {description}
                </p>
              )}
              <div
                className={`inline-block ${sizeClasses.button} text-white font-semibold rounded-lg transition-all duration-300`}
                style={{ 
                  backgroundColor: '#003d38',
                  transform: 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#002a25';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#003d38';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {buttonText || (language === 'ar' ? 'تسوق الآن' : language === 'tr' ? 'Alışverişe Başla' : 'Shop Now')}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
