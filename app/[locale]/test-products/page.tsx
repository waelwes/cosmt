'use client';

import { use, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ProductCard } from '@/components/ui/ProductCard';
import { useProductDisplay } from '@/hooks/useProductDisplay';

export default function TestProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { currentLanguage, currentCurrency } = useProductDisplay();
  
  // Sample products for testing
  const sampleProducts = [
    {
      id: 1,
      name: 'Hydrating Face Serum',
      description: 'Deeply hydrating serum for all skin types',
      brand: 'Cosmat',
      price: 29.99,
      originalPrice: 39.99,
      image: '/images/placeholder-product.jpg',
      categories: { name: 'Skincare', slug: 'skincare' },
      subcategories: { name: 'Serums', slug: 'serums' },
      slug: 'hydrating-face-serum',
      rating: 4.5,
      reviews: 128,
      isNew: true,
      isBestSeller: false,
      isOnSale: true
    },
    {
      id: 2,
      name: 'Anti-Aging Night Cream',
      description: 'Powerful anti-aging cream for overnight repair',
      brand: 'Cosmat',
      price: 49.99,
      originalPrice: null,
      image: '/images/placeholder-product.jpg',
      categories: { name: 'Skincare', slug: 'skincare' },
      subcategories: { name: 'Moisturizers', slug: 'moisturizers' },
      slug: 'anti-aging-night-cream',
      rating: 4.8,
      reviews: 256,
      isNew: false,
      isBestSeller: true,
      isOnSale: false
    },
    {
      id: 3,
      name: 'Vitamin C Brightening Mask',
      description: 'Brightening mask with vitamin C for radiant skin',
      brand: 'Cosmat',
      price: 24.99,
      originalPrice: 34.99,
      image: '/images/placeholder-product.jpg',
      categories: { name: 'Skincare', slug: 'skincare' },
      subcategories: { name: 'Masks', slug: 'masks' },
      slug: 'vitamin-c-brightening-mask',
      rating: 4.3,
      reviews: 89,
      isNew: false,
      isBestSeller: false,
      isOnSale: true
    }
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">🧪 Product Translation Test</h1>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Current Language:</strong> {currentLanguage} | 
                <strong> Current Currency:</strong> {currentCurrency}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Products below should show translated names and converted prices based on your language/currency settings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                showAddToCart={true}
                showWishlist={true}
              />
            ))}
          </div>

          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Test:</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Go to Site Preferences (globe icon in top bar)</li>
              <li>Change language to Arabic, Turkish, German, etc.</li>
              <li>Change currency to SAR, TRY, EUR, etc.</li>
              <li>Come back to this page and see the changes</li>
              <li>Product names should translate and prices should convert</li>
            </ol>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
