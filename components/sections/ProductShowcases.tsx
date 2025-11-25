'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { useCart } from '../../contexts/CartContext';
import { WishlistButton } from '../ui/WishlistButton';
import { Button } from '../ui/Button';
import { useStorefrontData } from '../../hooks/useStorefrontData';
import { useRTL } from '../../contexts/UnifiedLanguageContext';
import { useLanguage } from '../../contexts/UnifiedLanguageContext';
import { LogoLoading } from '../ui/LogoLoading';
import { buildProductPath } from '../../utils/slug';
import { MixedPromotionalBanners } from './MixedPromotionalBanners';


export const ProductShowcases: React.FC = () => {
  const { addToCart } = useCart();
  const { isRTL } = useRTL();
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const bestSellersSwiperRef = useRef<SwiperType | null>(null);
  const newProductsSwiperRef = useRef<SwiperType | null>(null);
  
  // Use optimized database data with caching
  const { bestSellers, newProducts, loading, error } = useStorefrontData();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Re-initialize Swiper navigation when RTL changes
  useEffect(() => {
    if (isMounted) {
      setTimeout(() => {
        try {
          if (bestSellersSwiperRef.current?.navigation) {
            bestSellersSwiperRef.current.navigation.update();
          }
          if (newProductsSwiperRef.current?.navigation) {
            newProductsSwiperRef.current.navigation.update();
          }
        } catch (error) {
          console.warn('Swiper navigation update error:', error);
        }
      }, 200);
    }
  }, [isRTL, isMounted]);

  // Ensure buttons are visible after Swiper initializes
  useEffect(() => {
    if (bestSellers.length > 0 || newProducts.length > 0) {
      const timer = setTimeout(() => {
        if (bestSellersSwiperRef.current?.navigation) {
          bestSellersSwiperRef.current.navigation.update();
        }
        if (newProductsSwiperRef.current?.navigation) {
          newProductsSwiperRef.current.navigation.update();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [bestSellers.length, newProducts.length, isMounted]);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.brand,
      description: product.name,
    });
  };

  if (loading) {
    return (
      <div className="py-2 space-y-4 lg:space-y-6">
        <div className="cosmt-container">
          {/* Best Sellers Loading */}
          <div className="mb-4">
            <div className="relative p-4 sm:p-6 lg:p-8" style={{ overflow: 'hidden', backgroundColor: '#ffffff' }}>
              <div className="text-center mb-8">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* New Products Loading */}
          <div>
            <div className="relative p-4 sm:p-6 lg:p-8" style={{ overflow: 'hidden', backgroundColor: '#ffffff' }}>
              <div className="text-center mb-8">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
      <div className="py-2 space-y-4 lg:space-y-6" style={{ backgroundColor: 'var(--product-bg-color)' }}>
        <div className="cosmt-container">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading products: {error}</p>
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
      className="py-2 space-y-4 lg:space-y-6"
      style={{ backgroundColor: 'var(--product-bg-color)' }}
    >
      <div className="cosmt-container">
        {/* Best Sellers Section */}
        <div className="mb-4">
          <div className="relative group">
            {/* Slider container with centered title */}
            <div
              className="relative p-4 sm:p-6 lg:p-8"
              style={{
                overflow: 'hidden',
                backgroundColor: '#ffffff'
              }}
            >
              {/* Centered Title */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-900">{t.bestSellers}</h2>
              </div>
              
              <Swiper
                key={`best-sellers-${isRTL ? 'rtl' : 'ltr'}-${isMounted}`}
                modules={[Navigation, Autoplay]}
                spaceBetween={16}
                slidesPerView={2}
                navigation={{
                  nextEl: '.best-sellers-next',
                  prevEl: '.best-sellers-prev',
                }}
                onSwiper={(swiper) => {
                  bestSellersSwiperRef.current = swiper;
                }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                  },
                }}
                className="best-sellers-swiper"
              >
            {bestSellers.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="group bg-white cosmt-product-card h-full">
                <div className="relative">
                  <Link href={buildProductPath(product.name, product.categories?.slug, product.subcategories?.slug, product.id)}>
                    <div className="aspect-square bg-gray-100 overflow-hidden cursor-pointer">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  {product.is_best_seller && (
                    <div className={`absolute top-2 text-white text-cosmt-xs font-semibold px-2 py-1 ${
                      isRTL ? 'right-2' : 'left-2'
                    }`} style={{ backgroundColor: '#00833F' }}>
                      Best Seller
                    </div>
                  )}
                  <div className={`absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    isRTL ? 'left-2' : 'right-2'
                  }`}>
                    <WishlistButton
                      product={{
                        id: product.id,
                        name: product.name,
                        price: parseFloat(product.price),
                        originalPrice: product.original_price ? parseFloat(product.original_price) : undefined,
                        image: product.image,
                        brand: product.brand,
                        category: product.category,
                        slug: product.id
                      }}
                      variant="icon"
                      size="sm"
                      className="p-2"
                    />
                  </div>
                  
        {/* Add to Cart Button - Appears on Hover */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <Button
          onClick={() => handleAddToCart(product)}
          className="w-full"
          variant="primary"
        >
          {t.addToCart}
        </Button>
        </div>
                </div>
                
                <div className="p-4">
                  <p className="text-cosmt-sm text-gray-600 mb-1">{product.brand}</p>
                  <Link href={buildProductPath(product.name, product.categories?.slug, product.subcategories?.slug, product.id)}>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-green-600 transition-colors duration-200 cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className={`flex items-center mb-2 ${
                    isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                  }`}>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-cosmt-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                  
                  <div className={`flex items-center ${
                    isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                  }`}>
                    <span className="text-cosmt-lg font-bold text-gray-900">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span>
                    {product.original_price && (
                      <span className="text-cosmt-sm text-gray-500 line-through">${typeof product.original_price === 'number' ? product.original_price.toFixed(2) : product.original_price}</span>
                    )}
                  </div>
                </div>
              </div>
                </SwiperSlide>
            ))}
              </Swiper>
              
              {/* Navigation Buttons - Always render when products are loaded */}
              {!loading && bestSellers.length > 0 && (
                <>
                  <button 
                    className="best-sellers-prev"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 9999,
                      left: isRTL ? 'auto' : '8px',
                      right: isRTL ? '8px' : 'auto',
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
                    <svg width="12" height="20" viewBox="0 0 18 33" fill="none" xmlns="http://www.w3.org/2000/svg" className={isRTL ? 'rotate-180' : ''}>
                      <path d="M16.2422 31.8281L17.6484 30.4922C17.9297 30.1406 17.9297 29.5781 17.6484 29.2969L4.92188 16.5L17.6484 3.77344C17.9297 3.49219 17.9297 2.92969 17.6484 2.57812L16.2422 1.24219C15.8906 0.890625 15.3984 0.890625 15.0469 1.24219L0.28125 15.9375C0 16.2891 0 16.7812 0.28125 17.1328L15.0469 31.8281C15.3984 32.1797 15.8906 32.1797 16.2422 31.8281Z" fill="black" stroke="white"/>
                    </svg>
                  </button>
                  <button 
                    className="best-sellers-next"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 9999,
                      left: isRTL ? '8px' : 'auto',
                      right: isRTL ? 'auto' : '8px',
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: 0,
                      display: 'block',
                      opacity: 1,
                      visibility: 'visible',
                    }}
                    aria-label="Next slide"
                  >
                    <svg width="12" height="20" viewBox="0 0 18 33" fill="none" xmlns="http://www.w3.org/2000/svg" className={isRTL ? '' : 'rotate-180'}>
                      <path d="M16.2422 31.8281L17.6484 30.4922C17.9297 30.1406 17.9297 29.5781 17.6484 29.2969L4.92188 16.5L17.6484 3.77344C17.9297 3.49219 17.9297 2.92969 17.6484 2.57812L16.2422 1.24219C15.8906 0.890625 15.3984 0.890625 15.0469 1.24219L0.28125 15.9375C0 16.2891 0 16.7812 0.28125 17.1328L15.0469 31.8281C15.3984 32.1797 15.8906 32.1797 16.2422 31.8281Z" fill="black" stroke="white"/>
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mixed Promotional Banners - 3 Banners */}
        <div className="mb-4">
          <MixedPromotionalBanners
            banners={[
              {
                id: 1,
                image: '/images/hero/fino-cover.jpg',
                title: 'Makeup',
                subtitle: 'Trending Now',
                description: 'Latest makeup trends',
                link: '/categories',
                buttonText: 'Explore',
                size: 'small'
              },
              {
                id: 2,
                image: '/images/hero/fino-cover.jpg',
                title: 'Premium Products',
                subtitle: 'Luxury Collection',
                description: 'High-end beauty essentials',
                link: '/categories',
                buttonText: 'Discover',
                size: 'medium'
              },
              {
                id: 3,
                image: '/images/PROM/GIRL.png',
                title: 'Skincare',
                subtitle: 'Daily Routine',
                description: 'Essential care products',
                link: '/categories',
                buttonText: 'Shop Now',
                size: 'small'
              }
            ]}
            fullWidth={true}
          />
        </div>

        {/* New Products Section */}
        <div>
          <div className="relative group">
            {/* Slider container with centered title */}
            <div 
              className="relative p-4 sm:p-6 lg:p-8" 
              style={{ 
                overflow: 'hidden',
                backgroundColor: '#ffffff'
              }}
            >
              {/* Centered Title */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-900">{t.newArrivals}</h2>
              </div>
              
              <Swiper
                key={`new-products-${isRTL ? 'rtl' : 'ltr'}-${isMounted}`}
                modules={[Navigation, Autoplay]}
                spaceBetween={16}
                slidesPerView={2}
                navigation={{
                  nextEl: '.new-products-next',
                  prevEl: '.new-products-prev',
                }}
                onSwiper={(swiper) => {
                  newProductsSwiperRef.current = swiper;
                }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                  },
                }}
                className="new-products-swiper"
              >
            {newProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="group bg-white cosmt-product-card h-full">
                <div className="relative">
                  <Link href={buildProductPath(product.name, product.categories?.slug, product.subcategories?.slug, product.id)}>
                    <div className="aspect-square bg-gray-100 overflow-hidden cursor-pointer">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  {product.isNew && (
                        <div className={`absolute top-2 text-white text-cosmt-xs font-semibold px-2 py-1 ${
                          isRTL ? 'right-2' : 'left-2'
                        }`} style={{ backgroundColor: '#00833F' }}>
                      New
                    </div>
                  )}
                  <div className={`absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    isRTL ? 'left-2' : 'right-2'
                  }`}>
                    <WishlistButton
                      product={{
                        id: product.id,
                        name: product.name,
                        price: parseFloat(product.price),
                        originalPrice: product.original_price ? parseFloat(product.original_price) : undefined,
                        image: product.image,
                        brand: product.brand,
                        category: product.category,
                        slug: product.id
                      }}
                      variant="icon"
                      size="sm"
                      className="p-2"
                    />
                  </div>
                  
        {/* Add to Cart Button - Appears on Hover */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <Button
          onClick={() => handleAddToCart(product)}
          className="w-full"
          variant="primary"
        >
          {t.addToCart}
        </Button>
        </div>
                </div>
                
                <div className="p-4">
                  <p className="text-cosmt-sm text-gray-600 mb-1">{product.brand}</p>
                  <Link href={buildProductPath(product.name, product.categories?.slug, product.subcategories?.slug, product.id)}>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-green-600 transition-colors duration-200 cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className={`flex items-center mb-2 ${
                    isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                  }`}>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-cosmt-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                  
                  <div className={`flex items-center ${
                    isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                  }`}>
                    <span className="text-cosmt-lg font-bold text-gray-900">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span>
                    {product.original_price && (
                      <span className="text-cosmt-sm text-gray-500 line-through">${typeof product.original_price === 'number' ? product.original_price.toFixed(2) : product.original_price}</span>
                    )}
                  </div>
                </div>
              </div>
                </SwiperSlide>
            ))}
              </Swiper>
              
              {/* Navigation Buttons - Always render when products are loaded */}
              {!loading && newProducts.length > 0 && (
                <>
                  <button 
                    className="new-products-prev"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 9999,
                      left: isRTL ? 'auto' : '8px',
                      right: isRTL ? '8px' : 'auto',
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
                    <svg width="12" height="20" viewBox="0 0 18 33" fill="none" xmlns="http://www.w3.org/2000/svg" className={isRTL ? 'rotate-180' : ''}>
                      <path d="M16.2422 31.8281L17.6484 30.4922C17.9297 30.1406 17.9297 29.5781 17.6484 29.2969L4.92188 16.5L17.6484 3.77344C17.9297 3.49219 17.9297 2.92969 17.6484 2.57812L16.2422 1.24219C15.8906 0.890625 15.3984 0.890625 15.0469 1.24219L0.28125 15.9375C0 16.2891 0 16.7812 0.28125 17.1328L15.0469 31.8281C15.3984 32.1797 15.8906 32.1797 16.2422 31.8281Z" fill="black" stroke="white"/>
                    </svg>
                  </button>
                  <button 
                    className="new-products-next"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 9999,
                      left: isRTL ? '8px' : 'auto',
                      right: isRTL ? 'auto' : '8px',
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: 0,
                      display: 'block',
                      opacity: 1,
                      visibility: 'visible',
                    }}
                    aria-label="Next slide"
                  >
                    <svg width="12" height="20" viewBox="0 0 18 33" fill="none" xmlns="http://www.w3.org/2000/svg" className={isRTL ? '' : 'rotate-180'}>
                      <path d="M16.2422 31.8281L17.6484 30.4922C17.9297 30.1406 17.9297 29.5781 17.6484 29.2969L4.92188 16.5L17.6484 3.77344C17.9297 3.49219 17.9297 2.92969 17.6484 2.57812L16.2422 1.24219C15.8906 0.890625 15.3984 0.890625 15.0469 1.24219L0.28125 15.9375C0 16.2891 0 16.7812 0.28125 17.1328L15.0469 31.8281C15.3984 32.1797 15.8906 32.1797 16.2422 31.8281Z" fill="black" stroke="white"/>
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
