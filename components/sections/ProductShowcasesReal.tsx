'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { WishlistButton } from '../ui/WishlistButton';
import { Button } from '../ui/Button';
import { useStorefrontData } from '../../hooks/useStorefrontData';
import { useRTL } from '../../contexts/UnifiedLanguageContext';
import { useLanguage } from '../../contexts/UnifiedLanguageContext';
import Link from 'next/link';

export const ProductShowcasesReal: React.FC = () => {
  const { addToCart } = useCart();
  const { isRTL } = useRTL();
  const { t } = useLanguage();
  const { bestSellers, newProducts, onSaleProducts, loading, error } = useStorefrontData();

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.brand,
      description: product.description || product.name,
    });
  };

  const ProductCard = ({ product, showBadge = false, badgeText = '' }: { 
    product: any; 
    showBadge?: boolean; 
    badgeText?: string; 
  }) => (
    <div className="group bg-white cosmt-product-card">
      <div className="relative">
        <Link href={`/product/${product.id}`}>
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={300}
              className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
            />
          </div>
        </Link>
        
        {showBadge && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {badgeText}
          </div>
        )}
        
        {product.isBestSeller && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Best Seller
          </div>
        )}

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-gray-900 hover:bg-gray-100"
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add to Cart
            </Button>
            <Link href={`/product/${product.id}`}>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
            <Link href={`/product/${product.id}`} className="hover:text-cosmt-primary">
              {product.name}
            </Link>
          </h3>
          <WishlistButton productId={product.id} />
        </div>
        
        <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center space-x-1">
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
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900">
              ₺{product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₺{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {product.stock < 10 && product.stock > 0 && (
            <span className="text-xs text-orange-600 font-medium">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="text-xs text-red-600 font-medium">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="cosmt-brand-section" style={{ backgroundColor: 'var(--product-bg-color)' }}>
        <div className="cosmt-container">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cosmt-primary"></div>
              <span className="text-gray-600">Loading products...</span>
            </div>
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
              <div className="text-red-500 mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Products</h3>
              <p className="text-gray-600">{error}</p>
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
        {bestSellers.length > 0 && (
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="text-cosmt-3xl font-bold text-gray-900">{t.bestSellers}</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* New Products Section */}
        {newProducts.length > 0 && (
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="text-cosmt-3xl font-bold text-gray-900">New Arrivals</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {newProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  showBadge={true}
                  badgeText="New"
                />
              ))}
            </div>
          </div>
        )}

        {/* On Sale Products Section */}
        {onSaleProducts.length > 0 && (
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="text-cosmt-3xl font-bold text-gray-900">On Sale</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {onSaleProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  showBadge={true}
                  badgeText="Sale"
                />
              ))}
            </div>
          </div>
        )}

        {/* No Products Message */}
        {bestSellers.length === 0 && newProducts.length === 0 && onSaleProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-600">Check back later for new products!</p>
          </div>
        )}
      </div>
    </div>
  );
};
