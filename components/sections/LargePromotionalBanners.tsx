'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRTL } from '../../contexts/UnifiedLanguageContext';

interface PromoBanner {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
  link: string;
  buttonText?: string;
}

const promotionalBanners: PromoBanner[] = [
  {
    id: 1,
    image: '/images/PROM/GIRL.png',
    title: 'Special Offer',
    subtitle: 'Up to 50% Off',
    link: '/categories',
    buttonText: 'Shop Now'
  },
  {
    id: 2,
    image: '/images/PROM/GIRL.png',
    title: 'New Arrivals',
    subtitle: 'Latest Collection',
    link: '/categories',
    buttonText: 'Explore'
  },
  {
    id: 3,
    image: '/images/PROM/GIRL.png',
    title: 'Best Sellers',
    subtitle: 'Top Products',
    link: '/categories',
    buttonText: 'View All'
  }
];

export const LargePromotionalBanners: React.FC = () => {
  const { isRTL, language } = useRTL();

  return (
    <div className="py-4" style={{ backgroundColor: '#ffffff' }}>
      <div className="cosmt-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {promotionalBanners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.link}
              className="group relative overflow-hidden rounded-2xl bg-gray-100 block"
              style={{
                textDecoration: 'none',
                outline: 'none',
                minHeight: '300px',
                height: '100%'
              }}
              onFocus={(e) => {
                e.currentTarget.style.setProperty('outline', 'none', 'important');
              }}
            >
              <div className="relative w-full h-full min-h-[300px]">
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={banner.id === 1}
                    onError={(e) => {
                      console.error('Image failed to load:', banner.image);
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                
                {/* Content Overlay */}
                <div className={`absolute inset-0 flex flex-col justify-center items-start p-6 md:p-8 ${
                  isRTL ? 'items-end' : 'items-start'
                }`}>
                  <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    {banner.subtitle && (
                      <p className="text-white text-sm md:text-base font-medium mb-2 opacity-90">
                        {banner.subtitle}
                      </p>
                    )}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      {banner.title}
                    </h3>
                    <div
                      className="inline-block px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300"
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
                      {banner.buttonText || (language === 'ar' ? 'تسوق الآن' : language === 'tr' ? 'Alışverişe Başla' : 'Shop Now')}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
