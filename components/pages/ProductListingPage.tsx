'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { CategoryFilters } from '../ui/CategoryFilters';
import { ProductGrid } from '../ui/ProductGrid';
import { getProductsByType, getCategoryBySlug, Product } from '../../data/products';
import { getCategoryBySlug as getCategoryBySlugFromCategories } from '../../data/categories';
import { PageLayout } from '../layout/PageLayout';

interface ProductListingPageProps {
  categorySlug: string;
  subCategorySlug: string;
  productTypeSlug: string;
  title: string;
  description: string;
}

export const ProductListingPage: React.FC<ProductListingPageProps> = ({
  categorySlug,
  subCategorySlug,
  productTypeSlug,
  title,
  description,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    brands: [] as string[],
    inStock: false,
  });

  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Get products by type
        const fetchedProducts = getProductsByType(categorySlug, subCategorySlug, productTypeSlug);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, subCategorySlug, productTypeSlug]);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    // Implement sorting logic here
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // Implement filtering logic here
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/categories' },
    { label: categorySlug ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1) : 'Category', href: categorySlug ? `/categories/${categorySlug}` : '/categories' },
    { label: subCategorySlug ? subCategorySlug.charAt(0).toUpperCase() + subCategorySlug.slice(1) : 'Subcategory', href: categorySlug && subCategorySlug ? `/categories/${categorySlug}/${subCategorySlug}` : '/categories' },
    { label: title },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="cosmt-container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="md:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-lg p-4">
                      <div className="h-48 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="cosmt-container py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-cosmt-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-cosmt-lg text-gray-600 max-w-3xl">{description}</p>
        </div>

        {/* Filters and Sort */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
            </div>
            <div className="flex items-center gap-4">
              <label className="text-cosmt-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-cosmt-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="md:col-span-1">
            <CategoryFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              products={products}
            />
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
