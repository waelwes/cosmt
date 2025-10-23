'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  style,
  onClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Generate optimized src with WebP/AVIF support
  const getOptimizedSrc = (originalSrc: string) => {
    // If it's already a data URL or external URL, return as is
    if (originalSrc.startsWith('data:') || originalSrc.startsWith('http')) {
      return originalSrc;
    }

    // For local images, Next.js will handle optimization automatically
    return originalSrc;
  };

  // Generate blur data URL for placeholder
  const getBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;
    
    // Generate a simple blur placeholder
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, width, height);
    }
    
    return canvas.toDataURL();
  };

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  // Fallback for broken images
  if (hasError) {
    return (
      <div
        ref={imgRef}
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
        onClick={onClick}
      >
        <div className="text-gray-400 text-sm text-center">
          <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          Image unavailable
        </div>
      </div>
    );
  }

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width: fill ? '100%' : width, height: fill ? '100%' : height, ...style }}
      onClick={onClick}
    >
      {isInView && (
        <Image
          src={getOptimizedSrc(src)}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={placeholder === 'blur' ? getBlurDataURL() : undefined}
          sizes={sizes}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      
      {/* Loading placeholder */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

// Preset components for common use cases
export const ProductImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
}> = ({ src, alt, className = '', priority = false, onClick }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={300}
    height={300}
    className={`rounded-lg object-cover ${className}`}
    priority={priority}
    quality={90}
    placeholder="blur"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    onClick={onClick}
  />
);

export const CategoryImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}> = ({ src, alt, className = '', priority = false }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={200}
    height={150}
    className={`rounded-md object-cover ${className}`}
    priority={priority}
    quality={85}
    placeholder="blur"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
  />
);

export const HeroImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}> = ({ src, alt, className = '', priority = true }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={1200}
    height={600}
    className={`w-full h-full object-cover ${className}`}
    priority={priority}
    quality={95}
    placeholder="blur"
    sizes="100vw"
  />
);
