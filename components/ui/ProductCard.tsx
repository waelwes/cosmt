'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart } from 'lucide-react';
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
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .product-card-group:hover h3 { color: #003d38 !important; }
      `}} />
      <div className={`product-card-group group bg-white pt-0 px-0 pb-4 border-2 border-gray-400 hover:shadow-lg transition-all duration-200 ${className}`} style={{borderRadius: '0 !important'}}>
      <div className="relative aspect-square bg-white overflow-hidden mb-4" style={{borderRadius: '0 !important'}}>
        <Link href={buildProductPath({ 
          name: product.name, 
          categorySlug: product.categories?.slug, 
          subcategorySlug: product.subcategories?.slug, 
          productSlug: product.slug, 
          id: product.id,
          locale: locale
        })} className="block w-full h-full">
          <Image
            src={product.image}
            alt={displayProduct.name}
            width={400}
            height={400}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.isNew && (
            <span className="px-2 py-1 text-white text-xs font-medium" style={{ backgroundColor: '#003d38' }}>
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-1 bg-amber-600 text-white text-xs font-medium">
              Best Seller
            </span>
          )}
          {product.isOnSale && (
            <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium">
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
              className="w-full text-white"
              style={{ backgroundColor: '#003d38' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#002a25'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003d38'}
            >
              Add to Cart
            </Button>
          </div>
        )}
      </div>

      <div className="p-4">
        <Link href={buildProductPath({
          name: product.name,
          categorySlug: product.categories?.slug,
          subcategorySlug: product.subcategories?.slug,
          productSlug: product.slug,
          id: product.id,
          locale: locale
        })}>
          <h3 className="font-semibold text-gray-900 text-sm mb-2 hover:text-teal-600 transition-colors duration-200 cursor-pointer">
            {displayProduct.name}
          </h3>
        </Link>

        <div className="flex items-center mb-2 space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating || 4.5)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating || '4.5'} ({product.reviews || 0})
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">${typeof displayProduct.price === 'number' ? displayProduct.price.toFixed(2) : displayProduct.price}</span>
          {displayProduct.originalPrice && (
            <span className="text-sm text-gray-500 line-through">${typeof displayProduct.originalPrice === 'number' ? displayProduct.originalPrice.toFixed(2) : displayProduct.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
