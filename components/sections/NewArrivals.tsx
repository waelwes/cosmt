'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRTL } from '../../contexts/UnifiedLanguageContext';
import { WishlistButton } from '../ui/WishlistButton';
import { ServiceContainer } from '../../lib/di/ServiceContainer';
import { IProductService } from '../../lib/factories/interfaces/IProductService';
import { Product } from '../../lib/types/Product';

export const NewArrivals: React.FC = () => {
  const { isRTL } = useRTL();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productService: IProductService = ServiceContainer
          .getInstance()
          .getServiceFactory()
          .createProductService();
        
        const data = await productService.getProducts();
        setProducts(data.slice(0, 8)); // Show only first 8 products
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Ensure buttons are visible after Swiper initializes
  useEffect(() => {
    if (swiperRef.current && products.length > 0) {
      const timer = setTimeout(() => {
        // Force navigation update to ensure buttons are connected
        if (swiperRef.current?.navigation) {
          swiperRef.current.navigation.update();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [products.length, isMounted]);

  // Re-initialize Swiper navigation when RTL changes
  useEffect(() => {
    if (swiperRef.current && isMounted) {
      setTimeout(() => {
        try {
          if (swiperRef.current?.navigation) {
            swiperRef.current.navigation.update();
          }
        } catch (error) {
          console.warn('Swiper navigation update error:', error);
        }
      }, 200);
    }
  }, [isRTL, isMounted]);

  if (loading) {
    return (
      <div className="py-2 bg-white">
        <div className="cosmt-container">
          <div className="relative p-4 sm:p-6 lg:p-8" style={{ overflow: 'hidden', backgroundColor: '#ffffff' }}>
            <div className="text-center mb-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
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
    );
  }

  return (
    <div className="py-2 space-y-4 lg:space-y-6">
      <div className="cosmt-container">
        <div className="relative">
          {/* Slider container with centered title */}
          <div
            className="relative p-4 sm:p-6 lg:p-8 bg-white"
            style={{
              overflow: 'hidden'
            }}
          >
            {/* Centered Title */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl font-bold text-gray-900 uppercase">
                {isRTL ? 'وصل حديثًا' : 'New Arrivals'}
              </h2>
            </div>

            <Swiper
              key={`new-arrivals-${isRTL ? 'rtl' : 'ltr'}-${isMounted}`}
              modules={[Navigation]}
              spaceBetween={16}
              slidesPerView={2}
              navigation={{
                nextEl: '.new-arrivals-next',
                prevEl: '.new-arrivals-prev',
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
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
              className="new-arrivals-swiper"
            >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="group bg-white cosmt-product-card h-full">
                  <div className="relative">
                    <Link href={`/product/${product.id}`}>
                      <div className="aspect-square bg-gray-100 overflow-hidden cursor-pointer">
                        <Image
                          src={product.image || '/api/placeholder/300/300'}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    {product.isFeatured && (
                      <div className={`absolute top-2 text-white text-cosmt-xs font-semibold px-2 py-1 ${
                        isRTL ? 'right-2' : 'left-2'
                      }`} style={{ backgroundColor: '#00833F' }}>
                        {isRTL ? 'جديد' : 'New'}
                      </div>
                    )}
                    <div className={`absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                      isRTL ? 'left-2' : 'right-2'
                    }`}>
                      <WishlistButton
                        product={{
                          id: product.id.toString(),
                          name: product.name,
                          price: product.price,
                          originalPrice: product.originalPrice,
                          image: product.image || '/api/placeholder/300/300',
                          brand: product.brand || product.categories?.name,
                          category: product.categories?.name || product.brand,
                          slug: product.slug
                        }}
                        variant="icon"
                        size="sm"
                        className="p-2"
                      />
                    </div>

                    {/* Add to Cart Button - Appears on Hover */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <button
                        onClick={() => {
                          // Add to cart functionality can be added here
                          console.log('Add to cart:', product.id);
                        }}
                        className="w-full px-4 py-2 text-white font-medium rounded transition-colors duration-200"
                        style={{ backgroundColor: '#003d38' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#002a25'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003d38'}
                      >
                        {isRTL ? 'أضف إلى السلة' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-cosmt-sm text-gray-600 mb-1">{product.brand || product.categories?.name || 'Brand'}</p>
                    <Link href={`/product/${product.slug}`}>
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
                              i < Math.floor(Math.random() * 3) + 3
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-cosmt-sm text-gray-600">
                        ({Math.floor(Math.random() * 100) + 10})
                      </span>
                    </div>

                    <div className={`flex items-center ${
                      isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                    }`}>
                      <span className="text-cosmt-lg font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-cosmt-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            </Swiper>
            
            {/* Navigation Buttons - Always render when products are loaded */}
            {!loading && products.length > 0 && (
              <>
                <button 
                  className="new-arrivals-prev"
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
                  className="new-arrivals-next"
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
  );
};
