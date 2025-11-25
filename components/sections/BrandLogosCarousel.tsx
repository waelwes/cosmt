'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

const brands = [
  { name: 'AVEDA', logo: null },
  { name: 'DAVINES', logo: null },
  { name: 'Oribe', logo: null },
  { name: 'Bumble and bumble', logo: null },
  { name: 'Kerastase', logo: null },
  { name: 'L\'Oreal Professional', logo: null },
  { name: 'Redken', logo: null },
  { name: 'Matrix', logo: null },
  { name: 'Wella', logo: null },
  { name: 'Schwarzkopf', logo: null },
];

export const BrandLogosCarousel: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ensure buttons are visible after Swiper initializes
  useEffect(() => {
    if (swiperRef.current && isMounted) {
      const timer = setTimeout(() => {
        if (swiperRef.current?.navigation) {
          swiperRef.current.navigation.update();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  if (!isMounted) {
    return (
      <div className="py-4 bg-white border-t border-gray-200">
        <div className="cosmt-container">
          <div className="text-center mb-8">
            <h2 className="text-cosmt-2xl font-bold text-gray-900 mb-2">Trusted by Professionals</h2>
            <p className="text-cosmt-base text-gray-600">Shop premium brands used by beauty professionals worldwide</p>
          </div>
          <div className="flex items-center justify-center h-20">
            <div className="text-gray-500">Loading brands...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 bg-white border-t border-gray-200">
      <div className="cosmt-container">
        <div className="text-center mb-8">
          <h2 className="text-cosmt-2xl font-bold text-gray-900 mb-2">Trusted by Professionals</h2>
          <p className="text-cosmt-base text-gray-600">Shop premium brands used by beauty professionals worldwide</p>
        </div>
        
        <div className="relative">
          {/* Border container to contain slider */}
          <div 
            className="relative p-4 sm:p-6 lg:p-8" 
            style={{ 
              overflow: 'hidden',
              backgroundColor: '#ffffff'
            }}
          >
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={2}
              navigation={{
                nextEl: '.brand-carousel-next',
                prevEl: '.brand-carousel-prev',
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 3,
                  spaceBetween: 40,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 50,
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 60,
                },
              }}
              className="brand-carousel"
            >
              {brands.map((brand, index) => (
                <SwiperSlide key={index}>
                  <div className="flex items-center justify-center h-20 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                    <span className="text-cosmt-lg font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-300">
                      {brand.name}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Navigation Buttons */}
            {isMounted && (
              <>
                <button 
                  className="brand-carousel-prev"
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
                  className="brand-carousel-next"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 9999,
                    right: '8px',
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
                  <svg width="12" height="20" viewBox="0 0 18 33" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
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
