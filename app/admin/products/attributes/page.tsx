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
  Tag,
  Star,
  TrendingUp,
  AlertTriangle,
  Palette,
  Ruler,
  Droplets
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AttributesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Mock data
  const attributes = [
    {
      id: 1,
      name: 'Color',
      slug: 'color',
      type: 'select',
      description: 'Product color variations',
      values: ['Red', 'Blue', 'Green', 'Black', 'White', 'Pink'],
      productCount: 45,
      required: true,
      icon: Palette
    },
    {
      id: 2,
      name: 'Size',
      slug: 'size',
      type: 'select',
      description: 'Product size options',
      values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      productCount: 32,
      required: true,
      icon: Ruler
    },
    {
      id: 3,
      name: 'Volume',
      slug: 'volume',
      type: 'select',
      description: 'Product volume in ml',
      values: ['50ml', '100ml', '150ml', '200ml', '250ml', '500ml'],
      productCount: 28,
      required: false,
      icon: Droplets
    },
    {
      id: 4,
      name: 'Skin Type',
      slug: 'skin-type',
      type: 'select',
      description: 'Recommended skin types',
      values: ['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive'],
      productCount: 18,
      required: false,
      icon: Tag
    },
    {
      id: 5,
      name: 'Hair Type',
      slug: 'hair-type',
      type: 'select',
      description: 'Recommended hair types',
      values: ['Straight', 'Wavy', 'Curly', 'Coily', 'Fine', 'Thick'],
      productCount: 22,
      required: false,
      icon: Tag
    },
    {
      id: 6,
      name: 'Ingredients',
      slug: 'ingredients',
      type: 'text',
      description: 'Key ingredients list',
      values: [],
      productCount: 15,
      required: false,
      icon: Tag
    }
  ];

  const filteredAttributes = attributes.filter(attribute => {
    const matchesSearch = attribute.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attribute.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || attribute.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'select':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'text':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'number':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'boolean':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Product Attributes</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage product attributes and variations</p>
        </div>
        <Button variant="primary" className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Attribute
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="dashboard-card border border-gray-200 dark:border-gray-700  p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search attributes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Types</option>
              <option value="select">Select</option>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attributes Table */}
      <div className="dashboard-card border border-gray-200 dark:border-gray-700  overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y" style={{ borderColor: '#eef2f6' }}>
            <thead className="bg-gray-50 dark:bg-gray-700" style={{ borderColor: '#eef2f6' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Attribute
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Values
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Required
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y" style={{ borderColor: '#eef2f6' }}>
              {filteredAttributes.map((attribute) => (
                <tr key={attribute.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <attribute.icon className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {attribute.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {attribute.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(attribute.type)}`}>
                      {attribute.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {attribute.values.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {attribute.values.slice(0, 3).map((value, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                              {value}
                            </span>
                          ))}
                          {attribute.values.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                              +{attribute.values.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">No values</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {attribute.productCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      attribute.required 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {attribute.required ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredAttributes.length === 0 && (
        <div className="text-center py-12">
          <div className="dashboard-card border border-gray-200 dark:border-gray-700  p-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No attributes found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first attribute'}
            </p>
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Attribute
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
