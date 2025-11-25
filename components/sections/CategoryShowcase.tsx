'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRTL } from '../../contexts/UnifiedLanguageContext';
import { ServiceContainer } from '../../lib/di/ServiceContainer';
import { ICategoryService } from '../../lib/factories/interfaces/ICategoryService';
import { CategoryWithSubcategories } from '../../lib/types/Category';
import { LogoLoading } from '../ui/LogoLoading';

export const CategoryShowcase: React.FC = () => {
  const { isRTL } = useRTL();
  const [mainCategories, setMainCategories] = useState<CategoryWithSubcategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get category service from container - uses real Supabase data
        const categoryService: ICategoryService = ServiceContainer
          .getInstance()
          .getServiceFactory()
          .createCategoryService();
        
        const categories = await categoryService.getCategoriesWithSubcategories();
        setMainCategories(categories);
      } catch (error) {
        setError('Failed to load categories');
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div
        className="py-4"
        style={{ backgroundColor: 'var(--category-bg-color)' }}
      >
        <div className="cosmt-container">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="flex flex-col items-center text-center p-2">
                <div className="relative mb-2 sm:mb-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-200 animate-pulse"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="py-4"
        style={{ backgroundColor: 'var(--category-bg-color)' }}
      >
        <div className="cosmt-container">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading categories: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 text-white rounded"
                style={{ backgroundColor: '#003d38' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#002a25'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003d38'}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="py-4"
      style={{ backgroundColor: 'var(--category-bg-color)' }}
    >
      <div className="cosmt-container">

        {/* Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {mainCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group flex flex-col items-center text-center p-2 active:bg-gray-50 transition-colors duration-200"
            >
              {/* RTL: Show image first, then title below */}
              {isRTL ? (
                <>
                  {/* Category Image Container */}
                  <div className="relative mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 overflow-hidden group-hover:bg-[#00514B] transition-colors duration-300">
                      {category.image && category.image.trim() !== '' ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                          <span className="text-2xl font-bold text-green-600">
                            {category.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#00514B] bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  </div>
                  
                  {/* Category Name - Below image in RTL */}
                  <h3 className="text-cosmt-xs sm:text-cosmt-sm font-medium text-gray-900 group-hover:text-[#00514B] transition-colors duration-300 leading-tight">
                    {category.name}
                  </h3>
                </>
              ) : (
                <>
                  {/* LTR: Show image first, then title */}
                  {/* Category Image Container */}
                  <div className="relative mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 overflow-hidden group-hover:bg-[#00514B] transition-colors duration-300">
                      {category.image && category.image.trim() !== '' ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                          <span className="text-2xl font-bold text-green-600">
                            {category.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#00514B] bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  </div>

                  {/* Category Name */}
                  <h3 className="text-cosmt-xs sm:text-cosmt-sm font-medium text-gray-900 group-hover:text-[#00514B] transition-colors duration-300 leading-tight">
                    {category.name}
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
