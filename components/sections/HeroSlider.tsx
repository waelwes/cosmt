'use client';

import React, { useState, useEffect } from 'react';
import { useRTL } from '../../contexts/UnifiedLanguageContext';

// Real hero slides with actual content
const slides = [
  {
    id: 1,
    image: '/images/hero/fino-cover.jpg',
  },
  {
    id: 2,
    image: '/images/hero/fino-cover.jpg',
  },
  {
    id: 3,
    image: '/images/hero/fino-cover.jpg',
  },
];

export const HeroSlider: React.FC = () => {
  const { isRTL } = useRTL();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="py-2">
      <div className="cosmt-container">
        <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] min-h-[300px] sm:min-h-[400px] md:min-h-[500px] max-h-[800px] overflow-hidden rounded-2xl group">
          {/* Slides */}
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="h-full w-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
              </div>
            </div>
          ))}

          {/* Navigation Arrows - Same style as product sliders */}
          <button
            onClick={prevSlide}
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              left: isRTL ? 'auto' : '8px',
              right: isRTL ? '8px' : 'auto',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              border: 'none',
              padding: 0,
              display: 'block',
              opacity: 0.7,
              transition: 'opacity 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            aria-label="Previous slide"
          >
            <svg 
              width="12" 
              height="20" 
              viewBox="0 0 18 33" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className={isRTL ? 'rotate-180' : ''}
            >
              <path 
                d="M16.2422 31.8281L17.6484 30.4922C17.9297 30.1406 17.9297 29.5781 17.6484 29.2969L4.92188 16.5L17.6484 3.77344C17.9297 3.49219 17.9297 2.92969 17.6484 2.57812L16.2422 1.24219C15.8906 0.890625 15.3984 0.890625 15.0469 1.24219L0.28125 15.9375C0 16.2891 0 16.7812 0.28125 17.1328L15.0469 31.8281C15.3984 32.1797 15.8906 32.1797 16.2422 31.8281Z" 
                fill="black" 
                stroke="white"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              left: isRTL ? '8px' : 'auto',
              right: isRTL ? 'auto' : '8px',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              border: 'none',
              padding: 0,
              display: 'block',
              opacity: 0.7,
              transition: 'opacity 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            aria-label="Next slide"
          >
            <svg 
              width="12" 
              height="20" 
              viewBox="0 0 18 33" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className={isRTL ? '' : 'rotate-180'}
            >
              <path 
                d="M16.2422 31.8281L17.6484 30.4922C17.9297 30.1406 17.9297 29.5781 17.6484 29.2969L4.92188 16.5L17.6484 3.77344C17.9297 3.49219 17.9297 2.92969 17.6484 2.57812L16.2422 1.24219C15.8906 0.890625 15.3984 0.890625 15.0469 1.24219L0.28125 15.9375C0 16.2891 0 16.7812 0.28125 17.1328L15.0469 31.8281C15.3984 32.1797 15.8906 32.1797 16.2422 31.8281Z" 
                fill="black" 
                stroke="white"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
