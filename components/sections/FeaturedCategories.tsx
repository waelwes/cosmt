'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRTL } from '../../contexts/UnifiedLanguageContext';
import { ServiceContainer } from '../../lib/di/ServiceContainer';
import { ICategoryService } from '../../lib/factories/interfaces/ICategoryService';
import { CategoryWithSubcategories } from '../../lib/types/Category';

export const FeaturedCategories: React.FC = () => {
  const { isRTL } = useRTL();
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryService: ICategoryService = ServiceContainer
          .getInstance()
          .getServiceFactory()
          .createCategoryService();
        
        const data = await categoryService.getCategoriesWithSubcategories();
        setCategories(data.slice(0, 6)); // Show only first 6 categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="py-8" style={{backgroundColor: '#fbfbfb'}}>
        <div className="cosmt-container">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8" style={{backgroundColor: '#fbfbfb'}}>
      <div className="cosmt-container">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {isRTL ? 'الفئات المميزة' : 'Featured Categories'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isRTL 
              ? 'اكتشفي مجموعتنا المتنوعة من منتجات التجميل والعناية'
              : 'Explore our diverse collection of beauty and skincare products'
            }
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg"
            >
              <div className="aspect-square relative">
                {category.image && category.image.trim() !== '' ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                    <span className="text-6xl font-bold text-green-600">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-gray-600 mt-2">
                  {category.subcategories?.length || 0} {isRTL ? 'فئة فرعية' : 'subcategories'}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 text-lg"
          >
            {isRTL ? 'عرض جميع الفئات' : 'View All Categories'}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};
