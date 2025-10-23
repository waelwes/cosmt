'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRTL } from '../../contexts/UnifiedLanguageContext';

// Real hero slides with actual content
const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: 'Premium Beauty Products',
    subtitle: 'Discover our curated collection of professional cosmetics',
    ctaText: 'Shop Now',
    ctaLink: '/categories'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2087&q=80',
    title: 'New Arrivals',
    subtitle: 'Latest beauty trends and innovative products',
    ctaText: 'Explore',
    ctaLink: '/categories?filter=new'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38cd796?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2085&q=80',
    title: 'Skincare Essentials',
    subtitle: 'Transform your skin with our premium skincare collection',
    ctaText: 'Shop Skincare',
    ctaLink: '/categories/skincare'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: 'Makeup Collection',
    subtitle: 'Express your beauty with our professional makeup range',
    ctaText: 'Shop Makeup',
    ctaLink: '/categories/makeup'
  },
];

export const HeroSlider: React.FC = () => {
  const { isRTL } = useRTL();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div 
      className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden"
      style={{
        backgroundColor: 'var(--hero-bg-color, #f8fafc)',
      }}
    >
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="h-full bg-cover bg-center bg-no-repeat relative"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`text-center text-white px-4 max-w-4xl ${isRTL ? 'text-right' : 'text-left'}`}>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                    {slide.subtitle}
                  </p>
                  <Link
                    href={slide.ctaLink}
                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {slide.ctaText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={isRTL ? goToNext : goToPrevious}
        className={`absolute top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-all duration-200 p-3 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm z-10 ${
          isRTL ? 'right-4 sm:right-8' : 'left-4 sm:left-8'
        }`}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>
      <button
        onClick={isRTL ? goToPrevious : goToNext}
        className={`absolute top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-all duration-200 p-3 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm z-10 ${
          isRTL ? 'left-4 sm:left-8' : 'right-4 sm:right-8'
        }`}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* Slider Dots */}
      <div className={`absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex ${
        isRTL ? 'space-x-reverse space-x-2 sm:space-x-3' : 'space-x-2 sm:space-x-3'
      }`}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
          className={`w-3 h-3 transition-all duration-200 rounded-full backdrop-blur-sm ${
            index === currentSlide
              ? 'bg-white scale-125 shadow-lg'
              : 'bg-white/50 hover:bg-white/75 hover:scale-110'
          }`}
          aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
