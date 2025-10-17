'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Star, Filter, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useCart } from '../../../contexts/CartContext';

interface CategoryProduct {
  id: number;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

// Mock category data
const getCategoryProducts = (category: string): CategoryProduct[] => {
  const allProducts: CategoryProduct[] = [
    // Hair Care
    {
      id: 1,
      name: 'Invati Advanced Hair Thinning System',
      brand: 'AVEDA',
      price: '$89.00',
      originalPrice: '$120.00',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&crop=center',
      category: 'Hair Care',
      description: 'Advanced 3-step system for thinning hair with natural ingredients',
      rating: 4.8,
      reviews: 124,
      isNew: false,
      isBestSeller: true,
    },
    {
      id: 2,
      name: 'Shampure Shampoo',
      brand: 'AVEDA',
      price: '$32.00',
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=center',
      category: 'Hair Care',
      description: 'Gentle daily shampoo with 25 pure flower and plant essences',
      rating: 4.6,
      reviews: 89,
      isNew: false,
      isBestSeller: false,
    },
    {
      id: 3,
      name: 'Damage Remedy Treatment',
      brand: 'AVEDA',
      price: '$45.00',
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&crop=center',
      category: 'Hair Care',
      description: 'Intensive treatment for damaged hair with quinoa protein',
      rating: 4.7,
      reviews: 156,
      isNew: true,
      isBestSeller: false,
    },
    {
      id: 4,
      name: 'Momoi Shampoo',
      brand: 'DAVINES',
      price: '$28.00',
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=center',
      category: 'Hair Care',
      description: 'Gentle cleansing shampoo with rice protein for all hair types',
      rating: 4.9,
      reviews: 203,
      isNew: false,
      isBestSeller: true,
    },
    {
      id: 5,
      name: 'OI Oil',
      brand: 'DAVINES',
      price: '$38.00',
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&crop=center',
      category: 'Hair Care',
      description: 'Multi-purpose oil for hair and body with roucou oil',
      rating: 4.8,
      reviews: 167,
      isNew: false,
      isBestSeller: false,
    },
    {
      id: 6,
      name: 'More Inside Hair Mask',
      brand: 'DAVINES',
      price: '$42.00',
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=center',
      category: 'Hair Care',
      description: 'Intensive treatment mask with quinoa protein and amino acids',
      rating: 4.7,
      reviews: 134,
      isNew: true,
      isBestSeller: false,
    },
    // Skincare
    {
      id: 7,
      name: 'Hydrating Face Serum',
      brand: 'AVEDA',
      price: '$65.00',
      originalPrice: '$85.00',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&crop=center',
      category: 'Skincare',
      description: 'Intensive hydrating serum with hyaluronic acid',
      rating: 4.9,
      reviews: 234,
      isNew: false,
      isBestSeller: true,
    },
    {
      id: 8,
      name: 'Anti-Aging Night Cream',
      brand: 'AVEDA',
      price: '$78.00',
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=center',
      category: 'Skincare',
      description: 'Rich night cream with retinol and peptides',
      rating: 4.8,
      reviews: 156,
      isNew: false,
      isBestSeller: true,
    },
    {
      id: 9,
      name: 'Vitamin C Brightening Serum',
      brand: 'AVEDA',
      price: '$55.00',
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&crop=center',
      category: 'Skincare',
      description: 'Brightening serum with 20% vitamin C',
      rating: 4.6,
      reviews: 87,
      isNew: true,
      isBestSeller: false,
    },
    // Body Care
    {
      id: 10,
      name: 'Moisturizing Body Lotion',
      brand: 'DAVINES',
      price: '$35.00',
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=center',
      category: 'Body Care',
      description: 'Rich body lotion with shea butter and aloe',
      rating: 4.4,
      reviews: 76,
      isNew: true,
      isBestSeller: false,
    },
  ];

  return allProducts.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
};

const getCategoryInfo = (category: string) => {
  const categories: { [key: string]: { title: string; description: string; bannerImage: string } } = {
    'hair-care': {
      title: 'Hair Care',
      description: 'Professional hair care products for every hair type and concern',
      bannerImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&h=400&fit=crop&crop=center'
    },
    'skincare': {
      title: 'Skincare',
      description: 'Advanced skincare solutions for healthy, radiant skin',
      bannerImage: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&h=400&fit=crop&crop=center'
    },
    'body-care': {
      title: 'Body Care',
      description: 'Luxurious body care products for soft, nourished skin',
      bannerImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&h=400&fit=crop&crop=center'
    },
    'makeup': {
      title: 'Makeup',
      description: 'Professional makeup products for flawless beauty',
      bannerImage: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&h=400&fit=crop&crop=center'
    },
    'fragrance': {
      title: 'Fragrance',
      description: 'Signature fragrances and essential oils',
      bannerImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&h=400&fit=crop&crop=center'
    }
  };

  return categories[category.toLowerCase()] || {
    title: category,
    description: `Discover our ${category} collection`,
    bannerImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&h=400&fit=crop&crop=center'
  };
};

export default function CategoryPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<CategoryProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<CategoryProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    brand: '',
    priceRange: [0, 200] as [number, number],
    sortBy: 'relevance' as 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest',
    inStock: false,
  });

  const category = params.category as string;
  const categoryInfo = getCategoryInfo(category);

  useEffect(() => {
    if (category) {
      const categoryProducts = getCategoryProducts(category);
      setProducts(categoryProducts);
      setFilteredProducts(categoryProducts);
      setIsLoading(false);
    }
  }, [category]);

  useEffect(() => {
    let filtered = [...products];

    // Apply brand filter
    if (filters.brand) {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    // Apply price range filter
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price.replace('$', ''));
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply in stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.isNew !== undefined); // Mock in stock check
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
        case 'price-high':
          return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''));
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, filters]);

  const handleAddToCart = (product: CategoryProduct) => {
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

  const brands = [...new Set(products.map(product => product.brand))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Category Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src={categoryInfo.bannerImage}
          alt={categoryInfo.title}
          width={1200}
          height={400}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div>
            <h1 className="text-cosmt-4xl md:text-cosmt-5xl font-bold mb-4">
              {categoryInfo.title}
            </h1>
            <p className="text-cosmt-lg md:text-cosmt-xl max-w-2xl mx-auto">
              {categoryInfo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="cosmt-container">
          <nav className="flex items-center space-x-2 text-cosmt-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{categoryInfo.title}</span>
          </nav>
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
                        onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
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
                    onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)] })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-cosmt-xs text-gray-600">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* In Stock Filter */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-cosmt-sm text-gray-700">In Stock Only</span>
                </label>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <h4 className="text-cosmt-sm font-medium text-gray-900 mb-3">Sort By</h4>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
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
                onClick={() => setFilters({
                  brand: '',
                  priceRange: [0, 200],
                  sortBy: 'relevance',
                  inStock: false,
                })}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-cosmt-sm"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-cosmt-sm">Filters</span>
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-cosmt-lg text-gray-500 mb-4">No products found</p>
                <p className="text-cosmt-base text-gray-400">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group cosmt-product-card">
                    <Link href={`/product/${product.id}`}>
                      <div className="relative aspect-square bg-gray-100 overflow-hidden mb-4 cursor-pointer">
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
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart(product);
                            }}
                            className="w-full"
                            variant="primary"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </Link>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-cosmt-xs text-gray-500">{product.brand}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-cosmt-xs text-gray-600">{product.rating}</span>
                        </div>
                      </div>
                      
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 text-cosmt-base hover:text-gray-700 transition-colors duration-200 cursor-pointer">
                          {product.name}
                        </h3>
                      </Link>
                      
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
    </div>
  );
}
