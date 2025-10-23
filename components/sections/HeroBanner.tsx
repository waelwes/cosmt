'use client';

import React from 'react';
import Link from 'next/link';
import { useRTL } from '../../contexts/UnifiedLanguageContext';

export const HeroBanner: React.FC = () => {
  const { isRTL, language } = useRTL();

  return (
    <div className="relative bg-gradient-to-r from-pink-50 via-purple-50 to-rose-50 py-8">
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
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 text-base"
              >
                {language === 'ar' ? 'تسوق الآن' : 
                 language === 'tr' ? 'Alışverişe Başla' : 
                 'Shop Now'}
              </Link>
              <Link
                href="/about"
                className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 text-base"
              >
                {language === 'ar' ? 'تعرف علينا' : 
                 language === 'tr' ? 'Daha Fazla Bilgi' : 
                 'Learn More'}
              </Link>
            </div>
          </div>

          {/* Right Content - Image Placeholder */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-4xl">💄</span>
                </div>
                <p className="text-gray-600 text-lg">
                  {language === 'ar' ? 'صورة المنتجات' : 
                   language === 'tr' ? 'Güzellik Ürünleri Resmi' : 
                   'Beauty Products Image'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
