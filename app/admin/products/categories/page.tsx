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
  Layers,
  Star,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Folder
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock data - hierarchical categories
  const categories = [
    {
      id: 1,
      name: 'Hair Care',
      slug: 'hair-care',
      description: 'Complete hair care products',
      productCount: 45,
      status: 'active',
      parentId: null,
      level: 0,
      children: [
        {
          id: 11,
          name: 'Shampoos',
          slug: 'shampoos',
          description: 'Hair cleansing products',
          productCount: 12,
          status: 'active',
          parentId: 1,
          level: 1
        },
        {
          id: 12,
          name: 'Conditioners',
          slug: 'conditioners',
          description: 'Hair conditioning products',
          productCount: 8,
          status: 'active',
          parentId: 1,
          level: 1
        },
        {
          id: 13,
          name: 'Hair Masks',
          slug: 'hair-masks',
          description: 'Deep conditioning treatments',
          productCount: 6,
          status: 'active',
          parentId: 1,
          level: 1
        }
      ]
    },
    {
      id: 2,
      name: 'Skincare',
      slug: 'skincare',
      description: 'Facial and body skincare',
      productCount: 32,
      status: 'active',
      parentId: null,
      level: 0,
      children: [
        {
          id: 21,
          name: 'Cleansers',
          slug: 'cleansers',
          description: 'Face and body cleansers',
          productCount: 10,
          status: 'active',
          parentId: 2,
          level: 1
        },
        {
          id: 22,
          name: 'Moisturizers',
          slug: 'moisturizers',
          description: 'Hydrating creams and lotions',
          productCount: 15,
          status: 'active',
          parentId: 2,
          level: 1
        },
        {
          id: 23,
          name: 'Toners & Essences',
          slug: 'toners-essences',
          description: 'Skin toning and essence products',
          productCount: 7,
          status: 'active',
          parentId: 2,
          level: 1
        }
      ]
    },
    {
      id: 3,
      name: 'Makeup',
      slug: 'makeup',
      description: 'Cosmetic products',
      productCount: 28,
      status: 'active',
      parentId: null,
      level: 0,
      children: []
    },
    {
      id: 4,
      name: 'Fragrance',
      slug: 'fragrance',
      description: 'Perfumes and colognes',
      productCount: 15,
      status: 'draft',
      parentId: null,
      level: 0,
      children: []
    }
  ];

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || category.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const renderCategory = (category: any, isChild = false) => (
    <div key={category.id} className={`${isChild ? 'ml-8' : ''}`}>
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded mb-2 hover:bg-gray-50 dark:hover:bg-gray-700 analytics-card">
        <div className="flex items-center">
          <Folder className={`w-5 h-5 mr-3 ${isChild ? 'text-gray-400' : 'text-blue-500'}`} />
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {category.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {category.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {category.productCount} products
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(category.status)}`}>
            {category.status}
          </span>
          <div className="flex space-x-1">
            <Button variant="secondary" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Render children */}
      {category.children && category.children.length > 0 && (
        <div className="ml-4">
          {category.children.map((child: any) => renderCategory(child, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 categories-page" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Product Categories</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Organize your products with categories and subcategories</p>
        </div>
        <Button variant="primary" className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="analytics-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-2">
        {filteredCategories.map((category) => renderCategory(category))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="analytics-card p-12">
            <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No categories found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first category'}
            </p>
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
