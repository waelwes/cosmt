'use client';

import React from 'react';

export const BrandSections: React.FC = () => {
  return (
    <div 
      className="py-16"
      style={{ backgroundColor: 'var(--brand-bg-color)' }}
    >
      <div className="cosmt-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Brands</h2>
          <p className="text-gray-600">Discover products from our trusted partners</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {['AVEDA', 'DAVINES', 'L\'Oreal', 'Moroccanoil'].map((brand) => (
            <div key={brand} className="flex items-center justify-center p-4">
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
