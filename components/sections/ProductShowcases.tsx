'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Heart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { WishlistButton } from '../ui/WishlistButton';
import { Button } from '../ui/Button';
import { getFeaturedProducts } from '../../data/products';
import { useRTL } from '../../contexts/UnifiedLanguageContext';
import { useLanguage } from '../../contexts/UnifiedLanguageContext';

// Get products from unified data
const bestSellers = getFeaturedProducts().filter(product => product.isBestSeller).slice(0, 4);
const newProducts = getFeaturedProducts().filter(product => product.isNew).slice(0, 4);


export const ProductShowcases: React.FC = () => {
  const { addToCart } = useCart();
  const { isRTL } = useRTL();
  const { t } = useLanguage();

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
                  <div className="aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
                  </div>
                  {product.isBestSeller && (
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
                        originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
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
                  <h3 className="font-semibold text-gray-900 mb-2 ">
                    {product.name}
                  </h3>
                  
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
                    {product.originalPrice && (
                      <span className="text-cosmt-sm text-gray-500 line-through">${typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.originalPrice}</span>
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
                  <div className="aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
                  </div>
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
                        originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
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
                  <h3 className="font-semibold text-gray-900 mb-2 ">
                    {product.name}
                  </h3>
                  
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
                    {product.originalPrice && (
                      <span className="text-cosmt-sm text-gray-500 line-through">${typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.originalPrice}</span>
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
