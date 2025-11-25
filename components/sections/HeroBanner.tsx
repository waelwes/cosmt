'use client';

import React from 'react';
import Link from 'next/link';
import { useRTL } from '../../contexts/UnifiedLanguageContext';

export const HeroBanner: React.FC = () => {
  const { isRTL, language } = useRTL();

  return (
    <div className="relative bg-gradient-to-r from-pink-50 via-purple-50 to-rose-50 py-4">
      <div className="cosmt-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`${isRTL ? 'lg:text-right' : 'lg:text-left'} text-center lg:text-left`}>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'اكتشفي عالم الجمال' : 
               language === 'tr' ? 'Güzelliği Keşfedin' : 
               'Discover Beauty'}
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {language === 'ar' 
                ? 'مجموعة واسعة من منتجات التجميل عالية الجودة من أشهر الماركات العالمية'
                : language === 'tr'
                ? 'Dünyanın en güvenilir markalarından premium güzellik ürünleri'
                : 'Premium beauty products from the world\'s most trusted brands'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/categories"
                className="text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 text-base"
                style={{ backgroundColor: '#003d38' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#002a25'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003d38'}
              >
                {language === 'ar' ? 'تسوق الآن' : 
                 language === 'tr' ? 'Alışverişe Başla' : 
                 'Shop Now'}
              </Link>
              <Link
                href="/about"
                className="border-2 font-semibold px-6 py-3 rounded-lg transition-colors duration-200 text-base"
                style={{ borderColor: '#003d38', color: '#003d38' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#003d38';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.color = '#003d38';
                }}
              >
                {language === 'ar' ? 'تعرف علينا' : 
                 language === 'tr' ? 'Daha Fazla Bilgi' : 
                 'Learn More'}
              </Link>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <div
                className="h-full w-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('/images/hero/fino-cover.jpg')`,
                }}
              >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
