'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';

interface WishlistButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    brand: string;
    category: string;
    slug: string;
  };
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  className?: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  product, 
  size = 'md', 
  variant = 'icon',
  className = ''
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };

  if (variant === 'button') {
    return (
      <button
        onClick={handleToggle}
        className={`flex items-center justify-center transition-all duration-200 ${
          isWishlisted
            ? 'text-red-600 hover:text-red-700'
            : 'text-gray-600 hover:text-red-600'
        } ${buttonSizeClasses[size]} ${className}`}
        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart 
          className={`${sizeClasses[size]} ${
            isWishlisted ? 'fill-current' : ''
          }`} 
        />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`transition-all duration-200 ${
        isWishlisted
          ? 'text-red-600 hover:text-red-700'
          : 'text-gray-600 hover:text-red-600'
      } ${className}`}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        className={`${sizeClasses[size]} ${
          isWishlisted ? 'fill-current' : ''
        }`} 
      />
    </button>
  );
};
