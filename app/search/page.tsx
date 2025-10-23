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

  const results = getFilteredResults;

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
      <div className="min-h-screen" style={{backgroundColor: '#fbfbfb'}}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="cosmt-container py-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 hover:border-green-300 transition-colors duration-200 rounded-lg"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
              </button>
            </div>
          
            {/* Search Bar */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder="Search products, brands, and more..."
                  className="w-full px-4 py-3 border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 rounded-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 rounded-lg font-medium"
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
              <div className="w-64 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <SlidersHorizontal className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Search Filters</h3>
                  </div>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

              <div className="px-6 py-4">

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="text-base font-medium text-gray-900 mb-4">Category</h4>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center space-x-3 py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors duration-200 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={filters.category === category}
                          onChange={(e) => setFilters({ category: e.target.value })}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700 font-medium">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <h4 className="text-base font-medium text-gray-900 mb-4">Brand</h4>
                  <div className="space-y-3">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center space-x-3 py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors duration-200 cursor-pointer">
                        <input
                          type="radio"
                          name="brand"
                          value={brand}
                          checked={filters.brand === brand}
                          onChange={(e) => setFilters({ brand: e.target.value })}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700 font-medium">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="text-base font-medium text-gray-900 mb-4">Price Range</h4>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters({ priceRange: [filters.priceRange[0], parseInt(e.target.value)] })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-600 font-medium">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <h4 className="text-base font-medium text-gray-900 mb-4">Sort By</h4>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ sortBy: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-lg transition-colors duration-200"
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
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-green-300 transition-colors duration-200 text-sm font-medium rounded-lg"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-lg text-gray-600">
                {results.length} product{results.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500 mb-4">No products found</p>
                <p className="text-base text-gray-400">
                  Try adjusting your search terms or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((product, index) => (
                  <div key={`${product.id}-${index}`} className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200">
                    <div className="relative aspect-square bg-gray-100 overflow-hidden mb-4 rounded-lg">
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
                          <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">
                            New
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="px-2 py-1 bg-amber-600 text-white text-xs font-medium rounded">
                            Best Seller
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{product.brand}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">{product.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 text-base group-hover:text-green-600 transition-colors duration-200">
                        {product.name}
                      </h3>
                      
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {product.originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
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
      </div>
    </PageLayout>
  );
}
