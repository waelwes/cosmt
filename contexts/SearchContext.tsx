'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import { ServiceContainer } from '../lib/di/ServiceContainer';
import { IProductService } from '../lib/factories/interfaces/IProductService';
import { networkOptimizedCache } from '../lib/optimizations/networkOptimizations';

export interface SearchProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  isOnSale: boolean;
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
  loading: boolean;
  error: string | null;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Convert database products to search format
const convertToSearchProducts = (products: any[]): SearchProduct[] => {
  // Safety check: ensure products is an array
  if (!Array.isArray(products)) {
    console.warn('convertToSearchProducts: products is not an array:', products);
    return [];
  }
  
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    brand: product.brand,
    price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
    originalPrice: product.original_price ? (typeof product.original_price === 'number' ? product.original_price : parseFloat(product.original_price) || 0) : null,
    image: product.image,
    category: product.categories?.name || 'Uncategorized',
    description: product.description || '',
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    isOnSale: product.is_on_sale || false,
    isBestSeller: product.is_best_seller || false,
  }));
};

// Fetcher function for SWR with network-optimized cache
const fetchSearchProducts = async (): Promise<SearchProduct[]> => {
  try {
    const products = await networkOptimizedCache.get('search-products', async () => {
      const productService: IProductService = ServiceContainer
        .getInstance()
        .getServiceFactory()
        .createProductService();

      const rawProducts = await productService.getProducts();
      return convertToSearchProducts(rawProducts);
    });
    
    console.log('✅ SWR: Search products fetched successfully');
    return products;
  } catch (error) {
    console.error('❌ SWR: Error fetching search products:', error);
    
    // Return empty array as fallback to prevent search from breaking
    console.log('🔄 SWR: Using fallback empty products array');
    return [];
  }
};

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    brand: 'All',
    priceRange: [0, 1000] as [number, number],
    rating: 0,
    inStock: false,
  });

  // Use SWR for caching search products with optimized settings
  const { data: allProducts = [], error, isLoading } = useSWR('search-products', fetchSearchProducts, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 1000 * 60 * 10, // Cache for 10 minutes (increased from 5)
    errorRetryCount: 3,
    errorRetryInterval: 5000,
    refreshInterval: 0, // Disable automatic refresh
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

  // Mock trending products for when database is not available
  const mockTrendingProducts: SearchProduct[] = [
    {
      id: 1,
      name: 'Vitamin C Serum',
      brand: 'Glow Essentials',
      category: 'Skincare',
      price: 65.50,
      originalPrice: 89.99,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviews: 89,
      isOnSale: true,
      isBestSeller: true,
      description: 'Brightening vitamin C serum for radiant skin',
    },
    {
      id: 2,
      name: 'Hair Mask - Deep Conditioning',
      brand: 'Luxe Beauty',
      category: 'Hair Care',
      price: 89.99,
      originalPrice: 119.99,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviews: 124,
      isOnSale: true,
      isBestSeller: true,
      description: 'Deep conditioning hair mask for all hair types',
    },
    {
      id: 3,
      name: 'Moisturizing Cream',
      brand: 'Pure Care',
      category: 'Skincare',
      price: 42.00,
      originalPrice: 55.00,
      image: '/api/placeholder/300/300',
      rating: 4.2,
      reviews: 67,
      isOnSale: true,
      isBestSeller: false,
      description: 'Hydrating moisturizer for dry skin',
    },
  ];

  const getFilteredResults = useMemo(() => {
    let filtered = allProducts.length > 0 ? allProducts : mockTrendingProducts;

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
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
      const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
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
  }, [allProducts, searchQuery, filters]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        clearFilters,
        getFilteredResults,
        loading: isLoading,
        error: error?.message || null,
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