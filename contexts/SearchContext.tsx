'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { products, searchProducts } from '../data/products';

export interface SearchProduct {
  id: number;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string | null;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  isNew: boolean;
  isBestSeller: boolean;
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: {
    category: string;
    brand: string;
    priceRange: [number, number];
    rating: number;
    inStock: boolean;
  };
  setFilters: (filters: any) => void;
  clearFilters: () => void;
  getFilteredResults: () => SearchProduct[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Convert unified products to search format
const convertToSearchProducts = (products: any[]): SearchProduct[] => {
  return products.map((product, index) => ({
    id: `search-${product.id}-${index}`, // Ensure unique IDs
    name: product.name,
    brand: product.brand,
    price: `$${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}`,
    originalPrice: product.originalPrice ? `$${typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.originalPrice}` : null,
    image: product.image,
    category: product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'Category',
    description: product.shortDescription || product.description,
    rating: product.rating,
    reviews: product.reviews,
    isNew: product.isNew,
    isBestSeller: product.isBestSeller,
  }));
};

// Use unified product data
const allProducts: SearchProduct[] = convertToSearchProducts(products);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    brand: 'All',
    priceRange: [0, 1000] as [number, number],
    rating: 0,
    inStock: false,
  });

  const clearFilters = () => {
    setFilters({
      category: 'All',
      brand: 'All',
      priceRange: [0, 1000],
      rating: 0,
      inStock: false,
    });
  };

  const getFilteredResults = () => {
    let filtered = allProducts;

    // Apply search query
    if (searchQuery.trim()) {
      const searchResults = searchProducts(searchQuery);
      const searchProductIds = searchResults.map(p => p.id);
      filtered = filtered.filter(product => searchProductIds.includes(product.id));
    }

    // Apply category filter
    if (filters.category !== 'All') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Apply brand filter
    if (filters.brand !== 'All') {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    // Apply price range filter
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price.replace('$', ''));
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // Apply in stock filter
    if (filters.inStock) {
      // Note: We don't have stock info in search products, so we'll skip this filter
      // In a real app, you'd add stock information to the search product interface
    }

    return filtered;
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        clearFilters,
        getFilteredResults,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
