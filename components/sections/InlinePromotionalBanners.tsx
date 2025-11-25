'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRTL } from '../../contexts/UnifiedLanguageContext';

interface InlinePromoBanner {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
  link: string;
  buttonText?: string;
}

const inlinePromotionalBanner: InlinePromoBanner = {
  id: 1,
  image: '/images/PROM/GIRL.png',
  title: 'Special Promotion',
  subtitle: 'Limited Time Offer',
  link: '/categories',
  buttonText: 'Shop Now'
};

export const InlinePromotionalBanners: React.FC = () => {
  const { isRTL, language } = useRTL();

  return (
    <div className="py-4" style={{ backgroundColor: '#fbfbfb' }}>
      <div className="cosmt-container">
        <Link
          href={inlinePromotionalBanner.link}
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
                src={inlinePromotionalBanner.image}
                alt={inlinePromotionalBanner.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="100vw"
                onError={(e) => {
                  console.error('Image failed to load:', inlinePromotionalBanner.image);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
            </div>
            
            {/* Content Overlay */}
            <div className={`absolute inset-0 flex flex-col justify-center p-8 md:p-12 ${
              isRTL ? 'items-end text-right' : 'items-start text-left'
            }`}>
              {inlinePromotionalBanner.subtitle && (
                <p className="text-white text-base md:text-lg font-medium mb-3 opacity-90">
                  {inlinePromotionalBanner.subtitle}
                </p>
              )}
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                {inlinePromotionalBanner.title}
              </h3>
              <div
                className="inline-block px-8 py-4 text-white font-semibold rounded-lg transition-all duration-300 text-lg"
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
                {inlinePromotionalBanner.buttonText || (language === 'ar' ? 'تسوق الآن' : language === 'tr' ? 'Alışverişe Başla' : 'Shop Now')}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
