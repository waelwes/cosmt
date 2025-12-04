"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRTL } from '../../contexts/UnifiedLanguageContext';

interface MixedPromoBanner {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  link: string;
  buttonText?: string;
  size: 'large' | 'medium' | 'small';
}

interface MixedPromotionalBannersProps {
  banners: MixedPromoBanner[];
  fullWidth?: boolean;
}

const sanitizeImageSrc = (img: unknown) => {
  if (!img || typeof img !== 'string') return '/api/placeholder/1200/600';
  const s = img.trim();
  if (/^(https?:|data:|\/)/.test(s)) return s;
  return `/${s.replace(/^\/+/, '')}`;
};

const getSizeClasses = (size: string) => {
  switch (size) {
    case 'large':
      return {
        container: 'min-h-[400px]',
        title: 'text-4xl md:text-5xl lg:text-6xl',
        subtitle: 'text-lg md:text-xl',
        description: 'text-base md:text-lg',
        button: 'px-8 py-4 text-lg',
        padding: 'p-8 md:p-12',
        gradient: 'bg-gradient-to-r from-purple-900/70 via-pink-900/50 to-transparent',
      };
    case 'small':
      return {
        container: 'min-h-[250px]',
        title: 'text-xl md:text-2xl',
        subtitle: 'text-xs md:text-sm',
        description: 'text-xs md:text-sm',
        button: 'px-4 py-2 text-sm',
        padding: 'p-4 md:p-6',
        gradient: 'bg-gradient-to-t from-green-900/70 to-transparent',
      };
    default:
      return {
        container: 'min-h-[300px]',
        title: 'text-2xl md:text-3xl',
        subtitle: 'text-sm md:text-base',
        description: 'text-sm',
        button: 'px-6 py-3',
        padding: 'p-6 md:p-8',
        gradient: 'bg-gradient-to-b from-blue-900/60 via-indigo-900/40 to-transparent',
      };
  }
};

const getGridClasses = (count: number) => {
  if (count === 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-1 md:grid-cols-2';
  if (count === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
};

export const MixedPromotionalBanners: React.FC<MixedPromotionalBannersProps> = ({ banners, fullWidth = false }) => {
  const { isRTL, language } = useRTL();

  const mergedBanners = React.useMemo(() => {
    try {
      const hasSkincare = banners.some((b) => b.title === 'Skincare');
      if (hasSkincare) return banners;
      const maxId = banners.reduce((acc, b) => Math.max(acc, b.id), 0);
      return [
        ...banners,
        {
          id: maxId + 1,
          image: '/images/PROM/SKINCARE_BANNER.jpg',
          title: 'Skincare',
          subtitle: 'Daily Routine',
          description: 'Essential care products',
          link: '/categories',
          buttonText: 'Shop Now',
          size: 'small' as const,
        },
      ];
    } catch (error) {
      void error;
      return banners;
    }
  }, [banners]);

  return (
    <div
      className={fullWidth ? '' : 'py-2 space-y-4 lg:space-y-6'}
      style={fullWidth ? {} : { backgroundColor: 'var(--product-bg-color)' }}
    >
      <div className={`cosmt-container ${fullWidth ? '' : ''}`}>
        <div className={`grid ${getGridClasses(mergedBanners.length)} gap-4 md:gap-6`}>
          {mergedBanners.map((banner) => {
            const sizeClasses = getSizeClasses(banner.size);
            const isLarge = banner.size === 'large';

            return (
              <Link
                key={banner.id}
                href={banner.link}
                className={`group relative overflow-hidden rounded-2xl bg-white block ${
                  isLarge && mergedBanners.length > 1 ? 'md:col-span-2' : ''
                }`}
                style={{ textDecoration: 'none', outline: 'none', height: '100%' }}
                onFocus={(e) => e.currentTarget.style.setProperty('outline', 'none', 'important')}
              >
                <div className={`relative w-full h-full ${sizeClasses.container}`}>
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <Image
                      src={sanitizeImageSrc(banner.image)}
                      alt={banner.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes={isLarge ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
                      onError={(_e) => {
                        void _e;
                        console.warn('Image failed to load:', banner.image);
                      }}
                    />
                    <div className={`absolute inset-0 ${sizeClasses.gradient}`}></div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  </div>

                  <div
                    className={`absolute inset-0 flex flex-col ${isLarge ? 'justify-center' : 'justify-end'} ${sizeClasses.padding} ${
                      isRTL ? 'items-end text-right' : 'items-start text-left'
                    }`}
                  >
                    {banner.subtitle && (
                      <p className={`text-white ${sizeClasses.subtitle} font-medium mb-2 opacity-90`}>{banner.subtitle}</p>
                    )}
                    <h3 className={`${sizeClasses.title} font-bold text-white mb-3 ${isLarge ? 'mb-4' : 'mb-2'}`}>{banner.title}</h3>
                    {banner.description && isLarge && (
                      <p className={`text-white ${sizeClasses.description} mb-6 opacity-90 max-w-md`}>{banner.description}</p>
                    )}
                    {banner.description && !isLarge && (
                      <p className={`text-white ${sizeClasses.description} mb-4 opacity-90`}>{banner.description}</p>
                    )}
                    <div
                      className={`inline-block ${sizeClasses.button} text-white font-semibold rounded-lg transition-all duration-300`}
                      style={{ backgroundColor: '#003d38', transform: 'translateY(0)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#002a25';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#003d38';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {banner.buttonText || (language === 'ar' ? 'تسوق الآن' : language === 'tr' ? 'Alışverişe Başla' : 'Shop Now')}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MixedPromotionalBanners;
