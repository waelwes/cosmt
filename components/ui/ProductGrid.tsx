'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './Button';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../../data/products';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="relative h-48">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.isNew && (
              <span className="absolute top-3 left-3 bg-green-600 text-white text-cosmt-xs px-2 py-1 rounded">
                NEW
              </span>
            )}
            {product.isBestSeller && (
              <span className="absolute top-3 right-3 bg-gray-800 text-white text-cosmt-xs px-2 py-1 rounded">
                BEST SELLER
              </span>
            )}
            {product.isOnSale && (
              <span className="absolute top-3 right-3 bg-red-600 text-white text-cosmt-xs px-2 py-1 rounded">
                SALE
              </span>
            )}
            
            {/* Add to Cart Button - Appears on Hover */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <Button
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  // Handle add to cart
                  console.log('Add to cart:', product.id);
                }}
              >
                Add to Cart <ShoppingBag className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="text-cosmt-base font-semibold text-gray-900 mb-1 line-clamp-2">
              <Link href={`/product/${product.id}`} className="hover:text-green-600 transition-colors duration-200">
                {product.name}
              </Link>
            </h3>
            <p className="text-cosmt-sm text-gray-600 mb-2">{product.brand}</p>
            
            {/* Rating */}
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                  />
                ))}
              </div>
              <span className="text-cosmt-sm text-gray-600 ml-2">
                {product.rating} ({product.reviews})
              </span>
            </div>
            
            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-cosmt-lg font-bold text-gray-900">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span>
                {product.originalPrice && (
                  <span className="text-cosmt-sm text-gray-500 line-through">${typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.originalPrice}</span>
                )}
              </div>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200">
                <Heart className="w-4 h-4" />
              </button>
            </div>
            
            {/* Stock Status */}
            {!product.inStock && (
              <div className="mt-2">
                <span className="text-cosmt-xs text-red-600 font-medium">Out of Stock</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
