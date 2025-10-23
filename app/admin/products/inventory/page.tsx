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
  AlertTriangle,
  Package2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock data
  const inventory = [
    {
      id: 1,
      productName: 'Hair Mask - Deep Conditioning',
      sku: 'HM-DC-001',
      currentStock: 45,
      minStock: 10,
      maxStock: 100,
      status: 'in-stock',
      lastUpdated: '2024-01-20',
      location: 'Warehouse A - Shelf 12',
      cost: 15.50,
      price: 29.99
    },
    {
      id: 2,
      productName: 'Shampoo - Daily Care',
      sku: 'SH-DC-002',
      currentStock: 8,
      minStock: 15,
      maxStock: 80,
      status: 'low-stock',
      lastUpdated: '2024-01-18',
      location: 'Warehouse A - Shelf 8',
      cost: 8.25,
      price: 18.99
    },
    {
      id: 3,
      productName: 'Face Cream - Anti-Aging',
      sku: 'FC-AA-003',
      currentStock: 0,
      minStock: 5,
      maxStock: 50,
      status: 'out-of-stock',
      lastUpdated: '2024-01-15',
      location: 'Warehouse B - Shelf 3',
      cost: 22.00,
      price: 45.99
    },
    {
      id: 4,
      productName: 'Body Lotion - Moisturizing',
      sku: 'BL-M-004',
      currentStock: 120,
      minStock: 20,
      maxStock: 150,
      status: 'in-stock',
      lastUpdated: '2024-01-19',
      location: 'Warehouse A - Shelf 15',
      cost: 6.75,
      price: 14.99
    },
    {
      id: 5,
      productName: 'Serum - Vitamin C',
      sku: 'SR-VC-005',
      currentStock: 25,
      minStock: 8,
      maxStock: 60,
      status: 'in-stock',
      lastUpdated: '2024-01-17',
      location: 'Warehouse B - Shelf 7',
      cost: 18.50,
      price: 39.99
    }
  ];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <CheckCircle className="w-4 h-4" />;
      case 'low-stock':
        return <AlertCircle className="w-4 h-4" />;
      case 'out-of-stock':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStockPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  return (
    <div className="space-y-6" style={{ backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Product Inventory</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage stock levels and inventory tracking</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" className="flex items-center">
            <Package2 className="w-4 h-4 mr-2" />
            Bulk Update
          </Button>
          <Button variant="primary" className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="analytics-card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600 dark:text-green-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Stock</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">3</p>
            </div>
          </div>
        </div>
        
        <div className="analytics-card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1</p>
            </div>
          </div>
        </div>
        
        <div className="analytics-card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1</p>
            </div>
          </div>
        </div>
        
        <div className="analytics-card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">5</p>
            </div>
          </div>
        </div>
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
                placeholder="Search products or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="analytics-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y" style={{ borderColor: '#eef2f6' }}>
            <thead className="bg-gray-50 dark:bg-gray-700" style={{ borderColor: '#eef2f6' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y" style={{ borderColor: '#eef2f6' }}>
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.productName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Last updated: {item.lastUpdated}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-900 dark:text-gray-100">
                            {item.currentStock} / {item.maxStock}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {getStockPercentage(item.currentStock, item.maxStock)}%
                          </span>
                        </div>
                        <div className="mt-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              item.status === 'out-of-stock' ? 'bg-red-500' :
                              item.status === 'low-stock' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${getStockPercentage(item.currentStock, item.maxStock)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Min: {item.minStock}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1">{item.status.replace('-', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {item.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <div>Cost: ${item.cost}</div>
                    <div className="text-gray-500 dark:text-gray-400">Price: ${item.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="secondary" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Edit className="w-4 h-4" />
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
      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <div className="analytics-card p-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No inventory found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'No products in inventory yet'}
            </p>
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Stock
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
