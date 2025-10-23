'use client';

import React, { useState, useEffect } from 'react';
import { ServiceContainer } from '../../lib/di/ServiceContainer';
import { IProductService } from '../../lib/factories/interfaces/IProductService';
import { LogoLoading } from '../ui/LogoLoading';

export const BrandSections: React.FC = () => {
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get product service from container - uses real Supabase data
        const productService: IProductService = ServiceContainer
          .getInstance()
          .getServiceFactory()
          .createProductService();
        
        const products = await productService.getProducts();
        
        // Extract unique brands from products
        const uniqueBrands = [...new Set(products.map(product => product.brand))].slice(0, 8);
        setBrands(uniqueBrands);
      } catch (error) {
        setError('Failed to load brands');
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div 
        className="py-8"
        style={{ backgroundColor: 'var(--brand-bg-color)' }}
      >
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
      <div 
        className="py-8"
        style={{ backgroundColor: 'var(--brand-bg-color)' }}
      >
        <div className="cosmt-container">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading brands: {error}</p>
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
      className="py-8"
      style={{ backgroundColor: 'var(--brand-bg-color)' }}
    >
      <div className="cosmt-container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Brands</h2>
          <p className="text-gray-600">Discover products from our trusted partners</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {brands.map((brand, idx) => (
            <div key={`${brand}-${idx}`} className="flex items-center justify-center p-4">
              <div className="w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">{brand}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
