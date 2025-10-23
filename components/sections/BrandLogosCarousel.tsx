'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="py-6 bg-white border-t border-gray-200">
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
    <div className="py-6 bg-white border-t border-gray-200">
      <div className="cosmt-container">
        <div className="text-center mb-8">
          <h2 className="text-cosmt-2xl font-bold text-gray-900 mb-2">Trusted by Professionals</h2>
          <p className="text-cosmt-base text-gray-600">Shop premium brands used by beauty professionals worldwide</p>
        </div>
        
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={2}
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
      </div>
    </div>
  );
};
