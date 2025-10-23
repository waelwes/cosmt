'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useRTL } from '../../contexts/UnifiedLanguageContext';
import { ServiceContainer } from '../../lib/di/ServiceContainer';
import { IProductService } from '../../lib/factories/interfaces/IProductService';
import { Product } from '../../lib/types/Product';

export const TrendingProducts: React.FC = () => {
  const { isRTL } = useRTL();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productService: IProductService = ServiceContainer
          .getInstance()
          .getServiceFactory()
          .createProductService();
        
        const data = await productService.getProducts();
        setProducts(data.slice(0, 8)); // Show only first 8 products
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-8" style={{backgroundColor: '#fbfbfb'}}>
        <div className="cosmt-container">
          <div className="text-center mb-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8" style={{backgroundColor: '#fbfbfb'}}>
      <div className="cosmt-container">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {isRTL ? 'المنتجات الرائجة' : 'Trending Products'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isRTL 
              ? 'اكتشفي أحدث وأشهر منتجات التجميل التي يحبها عملاؤنا'
              : 'Discover the latest and most loved beauty products by our customers'
            }
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg overflow-hidden"
            >
              <div className="relative aspect-square">
                <Image
                  src={product.image || '/api/placeholder/300/300'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="absolute top-2 left-2">
                  {product.is_new && (
                    <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      {isRTL ? 'جديد' : 'New'}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {product.category_name} • {product.subcategory_name}
                </p>
                
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(Math.random() * 3) + 3
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      ({Math.floor(Math.random() * 100) + 10})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-green-600">
                      ${product.price}
                    </span>
                    {product.sale_price && product.sale_price < product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.sale_price}
                      </span>
                    )}
                  </div>
                  <button className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 text-lg"
          >
            {isRTL ? 'عرض جميع المنتجات' : 'View All Products'}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};
