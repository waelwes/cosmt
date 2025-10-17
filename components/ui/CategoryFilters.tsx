'use client';

import React, { useState } from 'react';
import { Button } from './Button';
import { Product } from '../../data/products';

interface CategoryFiltersProps {
  filters: {
    priceRange: [number, number];
    brands: string[];
    inStock: boolean;
  };
  onFilterChange: (filters: any) => void;
  products: Product[];
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  filters,
  onFilterChange,
  products,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get unique brands from products
  const brands = products && products.length > 0 
    ? Array.from(new Set(products.map(product => product.brand)))
    : [];

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    
    onFilterChange({
      ...filters,
      brands: newBrands,
    });
  };

  const handlePriceRangeChange = (index: number, value: number) => {
    const newPriceRange = [...filters.priceRange] as [number, number];
    newPriceRange[index] = value;
    onFilterChange({
      ...filters,
      priceRange: newPriceRange,
    });
  };

  const handleInStockToggle = () => {
    onFilterChange({
      ...filters,
      inStock: !filters.inStock,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      priceRange: [0, 1000],
      brands: [],
      inStock: false,
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-cosmt-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-cosmt-sm text-green-600 hover:text-green-700 transition-colors duration-200"
        >
          Clear All
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="text-cosmt-base font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-cosmt-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-cosmt-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h4 className="text-cosmt-base font-medium text-gray-900 mb-3">Brands</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => handleBrandToggle(brand)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-cosmt-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div className="mb-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={handleInStockToggle}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <span className="text-cosmt-sm text-gray-700">In Stock Only</span>
        </label>
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full"
          variant="outline"
        >
          {isOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>
    </div>
  );
};
