'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { WishlistButton } from '../ui/WishlistButton';
import { Button } from '../ui/Button';
import { useStorefrontData } from '../../hooks/useStorefrontData';
import { useRTL } from '../../contexts/UnifiedLanguageContext';
import { useLanguage } from '../../contexts/UnifiedLanguageContext';
import { LogoLoading } from '../ui/LogoLoading';
import { buildProductPath } from '../../utils/slug';


export const ProductShowcases: React.FC = () => {
  const { addToCart } = useCart();
  const { isRTL } = useRTL();
  const { t } = useLanguage();
  
  // Use optimized database data with caching
  const { bestSellers, newProducts, loading, error } = useStorefrontData();

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.brand,
      description: product.name,
    });
  };

  if (loading) {
    return (
      <div className="cosmt-brand-section" style={{ backgroundColor: 'var(--product-bg-color)' }}>
        <div className="cosmt-container">
          <div className="flex items-center justify-center h-64">
            <LogoLoading 
              size="lg" 
              className="text-center"
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cosmt-brand-section" style={{ backgroundColor: 'var(--product-bg-color)' }}>
        <div className="cosmt-container">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading products: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="cosmt-brand-section"
      style={{ backgroundColor: 'var(--product-bg-color)' }}
    >
      <div className="cosmt-container">
        {/* Best Sellers Section */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="text-cosmt-3xl font-bold text-gray-900">{t.bestSellers}</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {bestSellers.map((product) => (
              <div key={product.id} className="group bg-white cosmt-product-card">
                <div className="relative">
                  <Link href={buildProductPath(product.name, product.categories?.slug, product.subcategories?.slug, product.id)}>
                    <div className="aspect-square bg-gray-100 overflow-hidden cursor-pointer">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  {product.is_best_seller && (
                    <div className={`absolute top-2 text-white text-cosmt-xs font-semibold px-2 py-1 ${
                      isRTL ? 'right-2' : 'left-2'
                    }`} style={{ backgroundColor: '#00833F' }}>
                      Best Seller
                    </div>
                  )}
                  <div className={`absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    isRTL ? 'left-2' : 'right-2'
                  }`}>
                    <WishlistButton
                      product={{
                        id: product.id,
                        name: product.name,
                        price: parseFloat(product.price),
                        originalPrice: product.original_price ? parseFloat(product.original_price) : undefined,
                        image: product.image,
                        brand: product.brand,
                        category: product.category,
                        slug: product.id
                      }}
                      variant="icon"
                      size="sm"
                      className="p-2"
                    />
                  </div>
                  
        {/* Add to Cart Button - Appears on Hover */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <Button
          onClick={() => handleAddToCart(product)}
          className="w-full"
          variant="primary"
        >
          {t.addToCart}
        </Button>
        </div>
                </div>
                
                <div className="p-4">
                  <p className="text-cosmt-sm text-gray-600 mb-1">{product.brand}</p>
                  <Link href={buildProductPath(product.name, product.categories?.slug, product.subcategories?.slug, product.id)}>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-green-600 transition-colors duration-200 cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className={`flex items-center mb-2 ${
                    isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                  }`}>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-cosmt-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                  
                  <div className={`flex items-center ${
                    isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                  }`}>
                    <span className="text-cosmt-lg font-bold text-gray-900">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span>
                    {product.original_price && (
                      <span className="text-cosmt-sm text-gray-500 line-through">${typeof product.original_price === 'number' ? product.original_price.toFixed(2) : product.original_price}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* New Products Section */}
        <div>
          <div className="mb-8">
            <h2 className="text-cosmt-3xl font-bold text-gray-900">{t.newArrivals}</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {newProducts.map((product) => (
              <div key={product.id} className="group bg-white cosmt-product-card">
                <div className="relative">
                  <Link href={buildProductPath(product.name, product.categories?.slug, product.subcategories?.slug, product.id)}>
                    <div className="aspect-square bg-gray-100 overflow-hidden cursor-pointer">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  {product.isNew && (
                    <div className="absolute top-2 left-2 text-white text-cosmt-xs font-semibold px-2 py-1" style={{ backgroundColor: '#00833F' }}>
                      New
                    </div>
                  )}
                  <div className={`absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    isRTL ? 'left-2' : 'right-2'
                  }`}>
                    <WishlistButton
                      product={{
                        id: product.id,
                        name: product.name,
                        price: parseFloat(product.price),
                        originalPrice: product.original_price ? parseFloat(product.original_price) : undefined,
                        image: product.image,
                        brand: product.brand,
                        category: product.category,
                        slug: product.id
                      }}
                      variant="icon"
                      size="sm"
                      className="p-2"
                    />
                  </div>
                  
        {/* Add to Cart Button - Appears on Hover */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <Button
          onClick={() => handleAddToCart(product)}
          className="w-full"
          variant="primary"
        >
          {t.addToCart}
        </Button>
        </div>
                </div>
                
                <div className="p-4">
                  <p className="text-cosmt-sm text-gray-600 mb-1">{product.brand}</p>
                  <Link href={buildProductPath(product.name, product.categories?.slug, product.subcategories?.slug, product.id)}>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-green-600 transition-colors duration-200 cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className={`flex items-center mb-2 ${
                    isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                  }`}>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-cosmt-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                  
                  <div className={`flex items-center ${
                    isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                  }`}>
                    <span className="text-cosmt-lg font-bold text-gray-900">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span>
                    {product.original_price && (
                      <span className="text-cosmt-sm text-gray-500 line-through">${typeof product.original_price === 'number' ? product.original_price.toFixed(2) : product.original_price}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
