'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './Button';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../../lib/types/Product';
import { buildProductPath } from '../../utils/slug';

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <ShoppingBag className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-cosmt-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-cosmt-sm text-gray-600">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="group bg-white rounded-lg overflow-hidden">
          <div className="relative aspect-square bg-gray-50">
            <Link href={buildProductPath({
              name: product.name,
              categorySlug: product.categories?.slug,
              subcategorySlug: product.subcategories?.slug,
              productSlug: product.slug,
              id: product.id
            })}>
              {product.image && product.image.trim() !== '' ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-600">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-xs">No Image</span>
                  </div>
                </div>
              )}
            </Link>
            
            {/* Pagination Dots */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
            </div>
          </div>
          
          <div className="p-3">
            {/* Rating */}
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 ml-1">
                {product.rating} ({product.reviews})
              </span>
            </div>
            
            {/* Product Name */}
            <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
              <Link href={buildProductPath({ name: product.name, categorySlug: product.categories?.slug, subcategorySlug: product.subcategories?.slug, productSlug: product.slug, id: product.id })} className="hover:text-gray-700 transition-colors duration-200">
                {product.name}
              </Link>
            </h3>
            
            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <span className="text-sm font-semibold text-gray-900">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-500 line-through">${typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.originalPrice}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
