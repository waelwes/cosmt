'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { ServiceContainer } from '../../lib/di/ServiceContainer';
import { IProductService } from '../../lib/factories/interfaces/IProductService';
import { LogoLoading } from '../ui/LogoLoading';

export const BrandSections: React.FC = () => {
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ensure buttons are visible after Swiper initializes
  useEffect(() => {
    if (swiperRef.current && isMounted && brands.length > 0) {
      const timer = setTimeout(() => {
        if (swiperRef.current?.navigation) {
          swiperRef.current.navigation.update();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isMounted, brands.length]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get product service from container - uses real Supabase data
        const productService: IProductService = ServiceContainer
          .getInstance()
          .getServiceFactory()
          .createProductService();
        
        const products = await productService.getProducts();
        
        // Extract unique brands from products (filter out undefined values)
        const uniqueBrands = [...new Set(products.map(product => product.brand).filter(brand => brand !== undefined))].slice(0, 8);
        setBrands(uniqueBrands);
      } catch (error) {
        setError('Failed to load brands');
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="py-2 space-y-4 lg:space-y-6">
        <div className="cosmt-container">
          <div className="relative">
            <div className="bg-white rounded-2xl p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex items-center justify-center p-4">
                    <div className="w-full h-20 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-2 space-y-4 lg:space-y-6">
        <div className="cosmt-container">
          <div className="flex items-center justify-center h-64 bg-white">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading brands: {error}</p>
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
    <div className="py-2 space-y-4 lg:space-y-6">
      <div className="cosmt-container">
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={2}
            navigation={{
              nextEl: '.brand-sections-next',
              prevEl: '.brand-sections-prev',
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 2,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 2,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 2,
              },
              1280: {
                slidesPerView: 7,
                spaceBetween: 2,
              },
            }}
            className="brand-sections-swiper bg-white rounded-2xl"
          >
            {brands.map((brand, idx) => (
              <SwiperSlide key={`${brand}-${idx}`}>
                <div className="flex items-center justify-center p-4">
                  <div className="w-full h-20 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200">
                    <span className="text-sm font-medium text-gray-600">{brand}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Navigation Buttons */}
          {!loading && brands.length > 0 && isMounted && (
            <>
              <button 
                className="brand-sections-prev"
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 9999,
                  left: '8px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: 0,
                  display: 'block',
                  opacity: 1,
                  visibility: 'visible',
                }}
                aria-label="Previous slide"
              >
                <svg width="12" height="20" viewBox="0 0 18 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.2422 31.8281L17.6484 30.4922C17.9297 30.1406 17.9297 29.5781 17.6484 29.2969L4.92188 16.5L17.6484 3.77344C17.9297 3.49219 17.9297 2.92969 17.6484 2.57812L16.2422 1.24219C15.8906 0.890625 15.3984 0.890625 15.0469 1.24219L0.28125 15.9375C0 16.2891 0 16.7812 0.28125 17.1328L15.0469 31.8281C15.3984 32.1797 15.8906 32.1797 16.2422 31.8281Z" fill="black" stroke="white"/>
                </svg>
              </button>
              <button 
                className="brand-sections-next"
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 9999,
                  right: '8px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '0',
                  display: 'block',
                  opacity: 1,
                  visibility: 'visible',
                }}
                aria-label="Next slide"
              >
                <svg width="12" height="20" viewBox="0 0 18 33" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
                  <path d="M16.2422 31.8281L17.6484 30.4922C17.9297 30.1406 17.9297 29.5781 17.6484 29.2969L4.92188 16.5L17.6484 3.77344C17.9297 3.49219 17.9297 2.92969 17.6484 2.57812L16.2422 1.24219C15.8906 0.890625 15.3984 0.890625 15.0469 1.24219L0.28125 15.9375C0 16.2891 0 16.7812 0.28125 17.1328L15.0469 31.8281C15.3984 32.1797 15.8906 32.1797 16.2422 31.8281Z" fill="black" stroke="white"/>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
