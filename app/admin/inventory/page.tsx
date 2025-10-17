'use client';

import React, { memo, useMemo, useState } from 'react';
import { Package, AlertTriangle, TrendingUp, TrendingDown, Search, Filter, Download, Plus, Edit, Trash2, Eye } from 'lucide-react';

// Mock data for inventory
const inventoryItems = [
  {
    id: 1,
    sku: 'AVD-001',
    name: 'AVEDA Invati Advanced™ Exfoliating Shampoo',
    category: 'Hair Care',
    currentStock: 45,
    minStock: 10,
    maxStock: 100,
    cost: 25.00,
    price: 45.00,
    status: 'in-stock',
    lastUpdated: '2024-01-15',
    supplier: 'AVEDA Professional'
  },
  {
    id: 2,
    sku: 'DAV-002',
    name: 'DAVINES Natural Tech Replumping Shampoo',
    category: 'Hair Care',
    currentStock: 8,
    minStock: 15,
    maxStock: 80,
    cost: 30.00,
    price: 55.00,
    status: 'low-stock',
    lastUpdated: '2024-01-14',
    supplier: 'DAVINES'
  },
  {
    id: 3,
    sku: 'SKN-003',
    name: 'Retinol Anti-Aging Serum',
    category: 'Skincare',
    currentStock: 0,
    minStock: 5,
    maxStock: 50,
    cost: 40.00,
    price: 75.00,
    status: 'out-of-stock',
    lastUpdated: '2024-01-10',
    supplier: 'Premium Skincare Co.'
  },
  {
    id: 4,
    sku: 'MAK-004',
    name: 'Luxury Foundation - Medium',
    category: 'Makeup',
    currentStock: 25,
    minStock: 8,
    maxStock: 60,
    cost: 20.00,
    price: 38.00,
    status: 'in-stock',
    lastUpdated: '2024-01-16',
    supplier: 'Beauty Essentials'
  },
  {
    id: 5,
    sku: 'PER-005',
    name: 'Signature Perfume - 50ml',
    category: 'Fragrance',
    currentStock: 12,
    minStock: 5,
    maxStock: 30,
    cost: 60.00,
    price: 120.00,
    status: 'low-stock',
    lastUpdated: '2024-01-13',
    supplier: 'Luxury Fragrances'
  }
];

const stockMovements = [
  { id: 1, sku: 'AVD-001', type: 'in', quantity: 50, reason: 'Purchase Order', date: '2024-01-15', user: 'Admin' },
  { id: 2, sku: 'DAV-002', type: 'out', quantity: 12, reason: 'Sale', date: '2024-01-14', user: 'System' },
  { id: 3, sku: 'SKN-003', type: 'out', quantity: 8, reason: 'Sale', date: '2024-01-10', user: 'System' },
  { id: 4, sku: 'MAK-004', type: 'in', quantity: 30, reason: 'Purchase Order', date: '2024-01-16', user: 'Admin' },
  { id: 5, sku: 'PER-005', type: 'out', quantity: 3, reason: 'Sale', date: '2024-01-13', user: 'System' }
];

// Helper functions
const getStockStatus = (current: number, min: number) => {
  if (current === 0) return { status: 'out-of-stock', color: 'text-red-600', bg: 'bg-red-50' };
  if (current <= min) return { status: 'low-stock', color: 'text-orange-600', bg: 'bg-orange-50' };
  return { status: 'in-stock', color: 'text-green-600', bg: 'bg-green-50' };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'in-stock': return 'text-green-600 bg-green-50';
    case 'low-stock': return 'text-orange-600 bg-orange-50';
    case 'out-of-stock': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

// Memoized components
const InventoryCard = memo(({ title, value, change, icon: Icon, color }: {
  title: string;
  value: string | number;
  change?: string;
  icon: any;
  color: string;
}) => (
        <div className="dashboard-card border border-gray-200 dark:border-gray-700 shadow-sm p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        {change && (
          <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
));

const InventoryItem = memo(({ item, onEdit, onDelete, onView }: {
  item: any;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}) => {
  const stockStatus = getStockStatus(item.currentStock, item.minStock);
  
  return (
    <div className="dashboard-card border border-gray-200 dark:border-gray-700 shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {item.sku} • {item.category}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Supplier: {item.supplier}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{item.currentStock}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Stock</p>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">{item.minStock}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Min Level</p>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">${item.cost}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Cost</p>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">${item.price}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
          </div>
          
          <div className="text-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(stockStatus.status)}`}>
              {stockStatus.status.replace('-', ' ').toUpperCase()}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onView(item.id)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(item.id)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

const StockMovementItem = memo(({ movement }: { movement: any }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center space-x-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        movement.type === 'in' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
      }`}>
        {movement.type === 'in' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
      </div>
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100">{movement.sku}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{movement.reason}</p>
      </div>
    </div>
    <div className="text-right">
      <p className={`font-semibold ${movement.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
        {movement.type === 'in' ? '+' : '-'}{movement.quantity}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{movement.date}</p>
    </div>
  </div>
));

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Memoized calculations
  const stats = useMemo(() => {
    const totalItems = inventoryItems.length;
    const inStock = inventoryItems.filter(item => item.currentStock > item.minStock).length;
    const lowStock = inventoryItems.filter(item => item.currentStock <= item.minStock && item.currentStock > 0).length;
    const outOfStock = inventoryItems.filter(item => item.currentStock === 0).length;
    const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.cost), 0);
    
    return { totalItems, inStock, lowStock, outOfStock, totalValue };
  }, []);

  const filteredItems = useMemo(() => {
    return inventoryItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchTerm, statusFilter, categoryFilter]);

  const handleEdit = (id: number) => {
    console.log('Edit item:', id);
    // TODO: Implement edit functionality
  };

  const handleDelete = (id: number) => {
    console.log('Delete item:', id);
    // TODO: Implement delete functionality
  };

  const handleView = (id: number) => {
    console.log('View item:', id);
    // TODO: Implement view functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Inventory Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your product inventory and stock levels</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <InventoryCard
          title="Total Products"
          value={stats.totalItems}
          icon={Package}
          color="bg-blue-100 text-blue-600"
        />
        <InventoryCard
          title="In Stock"
          value={stats.inStock}
          change="+2 this week"
          icon={Package}
          color="bg-green-100 text-green-600"
        />
        <InventoryCard
          title="Low Stock"
          value={stats.lowStock}
          icon={AlertTriangle}
          color="bg-orange-100 text-orange-600"
        />
        <InventoryCard
          title="Out of Stock"
          value={stats.outOfStock}
          icon={AlertTriangle}
          color="bg-red-100 text-red-600"
        />
        <InventoryCard
          title="Total Value"
          value={`$${stats.totalValue.toLocaleString()}`}
          change="+5.2% this month"
          icon={TrendingUp}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Filters and Search */}
        <div className="dashboard-card border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Hair Care">Hair Care</option>
              <option value="Skincare">Skincare</option>
              <option value="Makeup">Makeup</option>
              <option value="Fragrance">Fragrance</option>
            </select>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Products ({filteredItems.length})
          </h2>
        </div>
        
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <InventoryItem
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      </div>

      {/* Recent Stock Movements */}
        <div className="dashboard-card border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Stock Movements</h2>
          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-2">
          {stockMovements.slice(0, 5).map((movement) => (
            <StockMovementItem key={movement.id} movement={movement} />
          ))}
        </div>
      </div>
    </div>
  );
}
