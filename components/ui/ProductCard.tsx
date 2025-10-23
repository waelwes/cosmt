'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { Button } from './Button';
import { useProductDisplay } from '@/hooks/useProductDisplay';
import { buildProductPath } from '@/utils/slug';

interface ProductCardProps {
  product: any;
  locale: string;
  showAddToCart?: boolean;
  showWishlist?: boolean;
  onAddToCart?: (product: any) => void;
  onToggleWishlist?: (product: any) => void;
  className?: string;
}

export function ProductCard({ 
  product, 
  locale, 
  showAddToCart = true, 
  showWishlist = true,
  onAddToCart,
  onToggleWishlist,
  className = ''
}: ProductCardProps) {
  const { convertProductsForDisplaySync } = useProductDisplay();
  const displayProduct = convertProductsForDisplaySync([product])[0];

  return (
    <div className={`group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 ${className}`}>
      <div className="relative aspect-square bg-gray-100 overflow-hidden mb-4 rounded-lg">
        <Link href={buildProductPath({ 
          name: product.name, 
          categorySlug: product.categories?.slug, 
          subcategorySlug: product.subcategories?.slug, 
          productSlug: product.slug, 
          id: product.id 
        })}>
          <Image
            src={product.image}
            alt={displayProduct.name}
            width={400}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.isNew && (
            <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-1 bg-amber-600 text-white text-xs font-medium rounded">
              Best Seller
            </span>
          )}
          {product.isOnSale && (
            <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        {showWishlist && (
          <div className="absolute top-2 right-2">
            <button
              onClick={() => onToggleWishlist?.(product)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Add to wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Add to Cart Button */}
        {showAddToCart && (
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Button
              onClick={() => onAddToCart?.(product)}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{displayProduct.brand}</span>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-600">{product.rating || '4.5'}</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 text-base group-hover:text-green-600 transition-colors duration-200">
          <Link href={buildProductPath({ 
            name: product.name, 
            categorySlug: product.categories?.slug, 
            subcategorySlug: product.subcategories?.slug, 
            productSlug: product.slug, 
            id: product.id 
          })}>
            {displayProduct.name}
          </Link>
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-2">
          {displayProduct.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-green-600">{displayProduct.price}</span>
            {displayProduct.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {displayProduct.originalPrice}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {product.reviews || 0} reviews
          </span>
        </div>
      </div>
    </div>
  );
}
