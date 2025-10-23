'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '../../data/categories';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { ProductGrid } from '../ui/ProductGrid';
import { CategoryFilters } from '../ui/CategoryFilters';
import { CategoryFilterWrapper } from '../ui/CategoryFilterWrapper';
import { CategoryFilterMobileWrapper } from '../ui/CategoryFilterMobileWrapper';
import { useCart } from '../../contexts/CartContext';
import { PageLayout } from '../layout/PageLayout';
import { useProductsByCategory } from '../../hooks/useStorefrontData';
import { LogoLoading } from '../ui/LogoLoading';
import { Menu } from 'lucide-react';
// Analytics temporarily disabled: module missing
const trackCategoryView = (_slug: string) => {};
const trackProductFilter = (_payload: any) => {};

interface CategoryPageProps {
  category: Category;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
  const { addToCart } = useCart();
  const [filters, setFilters] = useState({
    brands: [],
    productTypes: [],
    skinConcerns: [],
    skinTypes: [],
    usageAreas: [],
    genders: [],
  });
  const [sortOrder, setSortOrder] = useState('relevance');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  // Use real database data instead of mock data
  const { products: dbProducts, loading, error } = useProductsByCategory(category.id.toString());

  // Track category view
  React.useEffect(() => {
    trackCategoryView(category.slug);
  }, [category.slug]);

  // Handle error state
  if (error) {
    console.error('❌ CategoryPage: Error loading products:', {
      categoryId: category.id,
      categorySlug: category.slug,
      error: error
    });
  }
  
  
  // Transform database products (preserve slugs for proper linking)
  const products = dbProducts?.map(product => ({
    id: product.id,
    name: product.name,
    brand: product.brand,
    price: `$${product.price.toFixed(2)}`,
    originalPrice: product.original_price ? `$${product.original_price.toFixed(2)}` : undefined,
    image: product.image,
    rating: product.rating,
    reviews: product.reviews,
    description: product.description || '',
    isNew: false,
    isBestSeller: product.is_best_seller,
    // Provide nested slugs expected by ProductGrid/buildProductPath
    categories: product.categories ? { slug: product.categories.slug, name: product.categories.name } : undefined,
    subcategories: product.subcategories ? { slug: product.subcategories.slug, name: product.subcategories.name } : undefined,
  })) || [];

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/categories' },
    { label: category.name, href: `/categories/${category.slug}` },
  ];

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: category.name, // Use category name from props
      description: product.description,
    });
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <LogoLoading 
            size="lg" 
            className="text-center"
          />
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading products: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Category Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {category.image && category.image.trim() !== '' ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            style={{ objectFit: 'cover' }}
            className="z-0"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center z-0">
            <div className="text-center text-green-800">
              <div className="w-24 h-24 mx-auto mb-4 bg-green-200 rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-green-600">
                  {category.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10 flex items-center justify-center text-center">
          <div className="text-white cosmt-container">
            <h1 className="text-cosmt-4xl md:text-cosmt-5xl font-bold mb-3">{category.name}</h1>
            <p className="text-cosmt-base md:text-cosmt-lg max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      <div className="cosmt-container py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />


        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0 space-y-6">
            {/* Categories Filter */}
            <CategoryFilterWrapper currentCategory={category.slug} />
            
            {/* Product Filters */}
            <CategoryFilters
              filters={filters}
              onFilterChange={setFilters}
              products={products}
              categorySlug={category.slug}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </div>

          {/* Mobile Category Filter */}
          <CategoryFilterMobileWrapper
            currentCategory={category.slug}
            isOpen={showCategoryFilter}
            onClose={() => setShowCategoryFilter(false)}
          />

          {/* Main Content Area */}
          <main className="flex-1">
            {/* Mobile Category Filter Button */}
            <div className="mb-6 lg:hidden">
              <button
                onClick={() => setShowCategoryFilter(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors duration-200 rounded-lg"
              >
                <Menu className="w-4 h-4" />
                <span className="text-sm">Browse Categories</span>
              </button>
            </div>

            {/* Mobile Product Filters */}
            <div className="lg:hidden mb-6">
            <CategoryFilters
                filters={filters}
                onFilterChange={setFilters}
                products={products}
              categorySlug={category.slug}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
            </div>

            {/* Category Header Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
                </div>
                
                {/* Center Product Count */}
                <div className="flex-1 flex justify-center">
                  <span className="text-sm text-gray-500">{products.length} products found</span>
                </div>
                
                {/* Sort Dropdown */}
                <div className="flex items-center space-x-2">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#00514B] focus:border-[#00514B] appearance-none cursor-pointer"
                  >
                    <option value="relevance">Popular Products</option>
                    <option value="newest">New Arrivals</option>
                    <option value="best-sellers">Best Sellers</option>
                    <option value="price-low">Increasing Price</option>
                    <option value="price-high">Decreasing Price</option>
                    <option value="rating">Highly Rated</option>
                    <option value="high-scores">High Scores</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid
              products={products}
              onAddToCart={handleAddToCart}
              showFilters={false}
            />
          </main>
        </div>
      </div>
    </PageLayout>
  );
};
