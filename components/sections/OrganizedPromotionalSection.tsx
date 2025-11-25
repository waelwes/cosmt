'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRTL } from '../../contexts/UnifiedLanguageContext';

interface PromoSection {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  link: string;
  buttonText?: string;
  type: 'large' | 'medium' | 'small';
}

const promotionalSections: PromoSection[] = [
  {
    id: 1,
    image: '/images/PROM/GIRL.png',
    title: 'New Collection',
    subtitle: 'Spring 2024',
    description: 'Discover the latest beauty trends',
    link: '/categories',
    buttonText: 'Explore Now',
    type: 'large'
  },
  {
    id: 2,
    image: '/images/PROM/GIRL.png',
    title: 'Best Sellers',
    subtitle: 'Top Rated',
    description: 'Customer favorites',
    link: '/categories',
    buttonText: 'Shop Now',
    type: 'medium'
  },
  {
    id: 3,
    image: '/images/PROM/GIRL.png',
    title: 'Special Offer',
    subtitle: 'Limited Time',
    description: 'Up to 50% off',
    link: '/categories',
    buttonText: 'Get Deal',
    type: 'medium'
  },
  {
    id: 4,
    image: '/images/PROM/GIRL.png',
    title: 'Beauty Tips',
    subtitle: 'Expert Advice',
    description: 'Learn from professionals',
    link: '/categories',
    buttonText: 'Read More',
    type: 'small'
  }
];

export const OrganizedPromotionalSection: React.FC = () => {
  const { isRTL, language } = useRTL();

  const renderBanner = (section: PromoSection) => {
    const baseClasses = "group relative overflow-hidden rounded-2xl bg-gray-100 block";
    const baseStyle = {
      textDecoration: 'none' as const,
      outline: 'none',
      height: '100%'
    };

    if (section.type === 'large') {
      return (
        <Link
          key={section.id}
          href={section.link}
          className={`${baseClasses} col-span-1 md:col-span-2`}
          style={{
            ...baseStyle,
            minHeight: '400px'
          }}
          onFocus={(e) => {
            e.currentTarget.style.setProperty('outline', 'none', 'important');
          }}
        >
          <div className="relative w-full h-full min-h-[400px]">
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
            </div>
            <div className={`absolute inset-0 flex flex-col justify-center p-8 md:p-12 ${
              isRTL ? 'items-end text-right' : 'items-start text-left'
            }`}>
              {section.subtitle && (
                <p className="text-white text-lg md:text-xl font-medium mb-2 opacity-90">
                  {section.subtitle}
                </p>
              )}
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {section.title}
              </h3>
              {section.description && (
                <p className="text-white text-base md:text-lg mb-6 opacity-90 max-w-md">
                  {section.description}
                </p>
              )}
              <div
                className="inline-block px-8 py-4 text-white font-semibold rounded-lg transition-all duration-300 text-lg"
                style={{ 
                  backgroundColor: '#003d38',
                  transform: 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#002a25';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#003d38';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {section.buttonText || 'Shop Now'}
              </div>
            </div>
          </div>
        </Link>
      );
    }

    if (section.type === 'medium') {
      return (
        <Link
          key={section.id}
          href={section.link}
          className={baseClasses}
          style={{
            ...baseStyle,
            minHeight: '300px'
          }}
          onFocus={(e) => {
            e.currentTarget.style.setProperty('outline', 'none', 'important');
          }}
        >
          <div className="relative w-full h-full min-h-[300px]">
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
            </div>
            <div className={`absolute inset-0 flex flex-col justify-end p-6 md:p-8 ${
              isRTL ? 'items-end text-right' : 'items-start text-left'
            }`}>
              {section.subtitle && (
                <p className="text-white text-sm md:text-base font-medium mb-1 opacity-90">
                  {section.subtitle}
                </p>
              )}
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {section.title}
              </h3>
              {section.description && (
                <p className="text-white text-sm mb-4 opacity-90">
                  {section.description}
                </p>
              )}
              <div
                className="inline-block px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300"
                style={{ 
                  backgroundColor: '#003d38',
                  transform: 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#002a25';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#003d38';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {section.buttonText || 'Shop Now'}
              </div>
            </div>
          </div>
        </Link>
      );
    }

    // Small type
    return (
      <Link
        key={section.id}
        href={section.link}
        className={baseClasses}
        style={{
          ...baseStyle,
          minHeight: '250px'
        }}
        onFocus={(e) => {
          e.currentTarget.style.setProperty('outline', 'none', 'important');
        }}
      >
        <div className="relative w-full h-full min-h-[250px]">
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <Image
              src={section.image}
              alt={section.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
          </div>
          <div className={`absolute inset-0 flex flex-col justify-end p-4 md:p-6 ${
            isRTL ? 'items-end text-right' : 'items-start text-left'
          }`}>
            {section.subtitle && (
              <p className="text-white text-xs md:text-sm font-medium mb-1 opacity-90">
                {section.subtitle}
              </p>
            )}
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              {section.title}
            </h3>
            <div
              className="inline-block px-4 py-2 text-white font-semibold rounded-lg transition-all duration-300 text-sm"
              style={{ 
                backgroundColor: '#003d38',
                transform: 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#002a25';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#003d38';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {section.buttonText || 'Shop Now'}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="py-4" style={{ backgroundColor: '#ffffff' }}>
      <div className="cosmt-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">
          {promotionalSections.map((section) => renderBanner(section))}
        </div>
      </div>
    </div>
  );
};
