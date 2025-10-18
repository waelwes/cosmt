'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRTL } from '../../contexts/UnifiedLanguageContext';

const slides = [
  {
    id: 1,
    image: '/api/placeholder/1200/600',
  },
  {
    id: 2,
    image: '/api/placeholder/1200/600',
  },
  {
    id: 3,
    image: '/api/placeholder/1200/600',
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
      className="cosmt-hero-slider"
      style={{
        backgroundColor: 'var(--hero-bg-color)',
        height: 'var(--hero-height)'
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
              className="h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
        <button
          onClick={isRTL ? goToNext : goToPrevious}
          className={`absolute top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 p-2 active:bg-white/20 rounded-full ${
            isRTL ? 'right-2 sm:right-4' : 'left-2 sm:left-4'
          }`}
        >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>
      <button
        onClick={isRTL ? goToPrevious : goToNext}
        className={`absolute top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 p-2 active:bg-white/20 rounded-full ${
          isRTL ? 'left-2 sm:left-4' : 'right-2 sm:right-4'
        }`}
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
          className={`w-2 h-2 sm:w-2 sm:h-2 transition-all duration-200 rounded-full active:scale-125 ${
            index === currentSlide
              ? 'bg-white'
              : 'bg-white bg-opacity-40 hover:bg-opacity-60'
          }`}
          />
        ))}
      </div>
    </div>
  );
};
