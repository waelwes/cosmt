'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getMainCategories } from '../../data/categories';
import { useRTL } from '../../contexts/UnifiedLanguageContext';
import { getCategoryTranslation } from '../../lib/translations';

export const CategoryShowcase: React.FC = () => {
  const { isRTL, language } = useRTL();
  const mainCategories = getMainCategories(); // Show all categories

  return (
    <div 
      className="py-16"
      style={{ backgroundColor: 'var(--category-bg-color)' }}
    >
      <div className="cosmt-container">

        {/* Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {mainCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group flex flex-col items-center text-center p-2 rounded-lg active:bg-gray-50 transition-colors duration-200"
            >
              {/* RTL: Show image first, then title below */}
              {isRTL ? (
                <>
                  {/* Circular Image Container */}
                  <div className="relative mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 group-hover:border-green-500 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm sm:text-base md:text-lg font-semibold">
                        {category.name.charAt(0)}
                      </div>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-green-500 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-full"></div>
                  </div>
                  
                  {/* Category Name - Below image in RTL */}
                  <h3 className="text-cosmt-xs sm:text-cosmt-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-300 leading-tight">
                    {getCategoryTranslation(category.id, language)}
                  </h3>
                </>
              ) : (
                <>
                  {/* LTR: Show image first, then title */}
                  {/* Circular Image Container */}
                  <div className="relative mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 group-hover:border-green-500 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm sm:text-base md:text-lg font-semibold">
                        {category.name.charAt(0)}
                      </div>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-green-500 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-full"></div>
                  </div>

                  {/* Category Name */}
                  <h3 className="text-cosmt-xs sm:text-cosmt-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-300 leading-tight">
                    {getCategoryTranslation(category.id, language)}
                  </h3>
                </>
              )}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};
