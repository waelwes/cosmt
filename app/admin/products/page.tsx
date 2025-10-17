'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  Star,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Mock data - in real app, this would come from API
  const products = [
    {
      id: 1,
      name: 'Hair Mask',
      brand: 'AVEDA',
      category: 'Hair Care',
      price: 89.99,
      originalPrice: 120.00,
      stock: 15,
      status: 'active',
      rating: 4.8,
      reviews: 156,
      image: '/api/placeholder/100/100',
      isBestSeller: true,
      isOnSale: true
    },
    {
      id: 2,
      name: 'Shampoo Set',
      brand: 'DAVINES',
      category: 'Hair Care',
      price: 156.50,
      originalPrice: null,
      stock: 8,
      status: 'active',
      rating: 4.7,
      reviews: 98,
      image: '/api/placeholder/100/100',
      isBestSeller: false,
      isOnSale: false
    },
    {
      id: 3,
      name: 'Conditioner',
      brand: 'L\'Oreal',
      category: 'Hair Care',
      price: 67.25,
      originalPrice: 85.00,
      stock: 3,
      status: 'active',
      rating: 4.5,
      reviews: 87,
      image: '/api/placeholder/100/100',
      isBestSeller: false,
      isOnSale: true
    },
    {
      id: 4,
      name: 'Hair Oil',
      brand: 'Moroccanoil',
      category: 'Hair Care',
      price: 124.99,
      originalPrice: null,
      stock: 0,
      status: 'inactive',
      rating: 4.9,
      reviews: 76,
      image: '/api/placeholder/100/100',
      isBestSeller: true,
      isOnSale: false
    }
  ];

  const categories = ['all', 'Hair Care', 'Skin Care', 'Makeup', 'Fragrance'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600';
    if (stock < 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Calculate stats for the header
  const lowStockCount = products.filter(product => product.stock < 10).length;
  const topRatedCount = products.filter(product => product.rating >= 4.5).length;

  return (
    <div className="space-y-4" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Combined Products Card */}
      <div className="analytics-card p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Products</h1>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="primary" className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
        
        {/* Horizontal Line */}
        <div className="border-t mb-4" style={{ borderTopColor: '#eef2f6' }}></div>
        
        {/* Stats Grid */}
        <div className="flex">
          <div className="flex-1 py-4 px-4 border-r" style={{ borderRightColor: '#eef2f6' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Total Products</h3>
              <Package className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active products</p>
            </div>
          </div>
          
          <div className="flex-1 py-4 px-4 border-r" style={{ borderRightColor: '#eef2f6' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Low Stock</h3>
              <AlertTriangle className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{lowStockCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Items need restocking</p>
            </div>
          </div>
          
          <div className="flex-1 py-4 px-4 border-r" style={{ borderRightColor: '#eef2f6' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Top Rated</h3>
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{topRatedCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">4.5+ star products</p>
            </div>
          </div>
          
          <div className="flex-1 py-4 px-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Categories</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Product categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="analytics-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 filter-input"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full filter-select"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="stock">Sort by Stock</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="analytics-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y" style={{ borderColor: '#eef2f6' }}>
            <thead className="bg-gray-50 dark:bg-gray-700" style={{ borderColor: '#eef2f6' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y" style={{ borderColor: '#eef2f6' }}>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={product.image}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 dark:text-gray-100">{product.name}</div>
                          {product.isBestSeller && (
                            <TrendingUp className="w-4 h-4 text-orange-500 ml-2" />
                          )}
                          {product.isOnSale && (
                            <AlertTriangle className="w-4 h-4 text-red-500 ml-1" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">₺{product.price.toFixed(2)}</div>
                    {product.originalPrice && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        ₺{product.originalPrice.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getStockColor(product.stock)}`}>
                      {product.stock} units
                    </div>
                    {product.stock < 10 && product.stock > 0 && (
                      <div className="text-xs text-yellow-600">Low stock</div>
                    )}
                    {product.stock === 0 && (
                      <div className="text-xs text-red-600">Out of stock</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-900 dark:text-gray-100">{product.rating}</span>
                      <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">({product.reviews})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="analytics-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
            <span className="font-medium">4</span> results
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm">
              Previous
            </Button>
            <Button variant="primary" size="sm">
              1
            </Button>
            <Button variant="secondary" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
