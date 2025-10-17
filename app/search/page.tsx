'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearch } from '../../contexts/SearchContext';
import { useCart } from '../../contexts/CartContext';
import { Star, Filter, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { PageLayout } from '../../components/layout/PageLayout';

export default function SearchPage() {
  const { searchQuery, setSearchQuery, getFilteredResults, filters, setFilters, clearFilters } = useSearch();
  const { addToCart } = useCart();
  const [showFilters, setShowFilters] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const results = getFilteredResults();

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      description: product.description,
    });
  };

  const categories = ['Hair Care', 'Skincare', 'Body Care', 'Makeup', 'Fragrance'];
  const brands = ['AVEDA', 'DAVINES', 'Oribe', 'Bumble and bumble', 'Kerastase'];

  return (
    <PageLayout>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="cosmt-container py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-cosmt-2xl font-bold text-gray-900">Search Results</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-cosmt-sm">Filters</span>
            </button>
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-4">
            <div className="relative">
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search products, brands, and more..."
                className="w-full px-4 py-3 border border-gray-300 text-cosmt-base focus:outline-none transition-colors duration-200"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="cosmt-container py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-64 bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-cosmt-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-200 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-cosmt-sm font-medium text-gray-900 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={filters.category === category}
                        onChange={(e) => setFilters({ category: e.target.value })}
                        className="mr-2"
                      />
                      <span className="text-cosmt-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="text-cosmt-sm font-medium text-gray-900 mb-3">Brand</h4>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="radio"
                        name="brand"
                        value={brand}
                        checked={filters.brand === brand}
                        onChange={(e) => setFilters({ brand: e.target.value })}
                        className="mr-2"
                      />
                      <span className="text-cosmt-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-cosmt-sm font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({ priceRange: [filters.priceRange[0], parseInt(e.target.value)] })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-cosmt-xs text-gray-600">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <h4 className="text-cosmt-sm font-medium text-gray-900 mb-3">Sort By</h4>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ sortBy: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 text-cosmt-sm focus:outline-none"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-cosmt-sm"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
            </div>

            {results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-cosmt-lg text-gray-500 mb-4">No products found</p>
                <p className="text-cosmt-base text-gray-400">
                  Try adjusting your search terms or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((product, index) => (
                  <div key={`${product.id}-${index}`} className="group cosmt-product-card">
                    <div className="relative aspect-square bg-gray-100 overflow-hidden mb-4">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col space-y-1">
                        {product.isNew && (
                          <span className="px-2 py-1 bg-green-600 text-white text-cosmt-xs font-medium">
                            New
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="px-2 py-1 bg-amber-600 text-white text-cosmt-xs font-medium">
                            Best Seller
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="w-full"
                          variant="primary"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-cosmt-xs text-gray-500">{product.brand}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-cosmt-xs text-gray-600">{product.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 text-cosmt-base group-hover:text-gray-700 transition-colors duration-200">
                        {product.name}
                      </h3>
                      
                      <p className="text-cosmt-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-cosmt-lg font-bold text-gray-900">{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-cosmt-sm text-gray-500 line-through">
                              {product.originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-cosmt-xs text-gray-500">
                          {product.reviews} reviews
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
