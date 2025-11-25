'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRTL } from '../../contexts/UnifiedLanguageContext';
import { ServiceContainer } from '../../lib/di/ServiceContainer';
import { ICategoryService } from '../../lib/factories/interfaces/ICategoryService';
import { CategoryWithSubcategories } from '../../lib/types/Category';
import { LogoLoading } from '../ui/LogoLoading';

export const PromotionalBanners: React.FC = () => {
  const { isRTL } = useRTL();
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
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
        
        const allCategories = await categoryService.getCategoriesWithSubcategories();
        // Take first 5 categories for banners
        setCategories(allCategories.slice(0, 5));
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
      <div className="py-2">
        <div className="cosmt-container">
          <div className="bg-white rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="mb-3">
                    <div
                      className="bg-gray-200 animate-pulse rounded-full"
                      style={{
                        width: '96px',
                        height: '96px'
                      }}
                    ></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-2">
        <div className="cosmt-container">
          <div className="flex items-center justify-center h-64 bg-white">
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
    <div className="py-2">
      <div className="cosmt-container">
        <div className="bg-white rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group flex flex-col items-center text-center"
              >
                <div
                  className="mb-3 group-hover:border-green-500 group-hover:shadow-lg transition-all duration-300"
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    clipPath: 'circle(50% at 50% 50%)',
                    WebkitClipPath: 'circle(50% at 50% 50%)'
                  }}
                >
                  {category.image && category.image.trim() !== '' ? (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        position: 'relative',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <img
                        src={category.image}
                        alt={category.name}
                        style={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          borderRadius: '50%',
                          backgroundColor: '#f3f4f6'
                        }}
                        onError={(e) => {
                          // If image fails to load, show placeholder
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div style="width: 100%; height: 100%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                                <span style="font-size: 2rem; font-weight: bold; color: #6b7280;">${category.name.charAt(0)}</span>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div 
                      style={{ 
                        width: '100%',
                        height: '100%',
                        background: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%'
                      }}
                    >
                      <span style={{ 
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#6b7280'
                      }}>
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <h3
                  className="font-semibold text-sm md:text-base transition-colors duration-300 group-hover:text-green-600"
                  style={{
                    color: '#111827',
                    marginTop: '0.75rem'
                  }}
                >
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
