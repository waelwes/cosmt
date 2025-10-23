'use client';

import { use, useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useProductDisplay } from '@/hooks/useProductDisplay';

export default function TestTranslationWorkingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { convertProductsForDisplay, currentLanguage, currentCurrency } = useProductDisplay();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      reviews: 128
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
      reviews: 256
    }
  ];

  useEffect(() => {
    const convertProducts = async () => {
      setIsLoading(true);
      try {
        const converted = await convertProductsForDisplay(sampleProducts);
        setProducts(converted);
        console.log('Converted products:', converted);
      } catch (error) {
        console.error('Error converting products:', error);
        setProducts(sampleProducts);
      } finally {
        setIsLoading(false);
      }
    };

    convertProducts();
  }, [convertProductsForDisplay]);

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Translation Working Test</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Settings</h2>
            <div className="space-y-2">
              <p><strong>Locale:</strong> {locale}</p>
              <p><strong>Current Language:</strong> {currentLanguage}</p>
              <p><strong>Current Currency:</strong> {currentCurrency}</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Translating products...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Translated Products</h2>
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-2">{product.description}</p>
                      <p className="text-sm text-gray-500 mb-4">Brand: {product.brand}</p>
                      <div className="flex items-center space-x-4">
                        <span className="text-xl font-bold text-green-600">{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Translation Details</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Original Name:</strong> {sampleProducts.find(p => p.id === product.id)?.name}</p>
                        <p><strong>Translated Name:</strong> {product.name}</p>
                        <p><strong>Language:</strong> {currentLanguage}</p>
                        <p><strong>Currency:</strong> {currentCurrency}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">🧪 How to Test Translation</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Go to Site Preferences (globe icon in header)</li>
              <li>Change language to Arabic (ar) or Turkish (tr)</li>
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
