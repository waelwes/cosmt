'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  ShoppingCart,
  Star,
  TrendingUp,
  AlertTriangle,
  Package,
  User,
  Calendar,
  Clock,
  DollarSign,
  RefreshCw,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CartsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCart, setSelectedCart] = useState(null);

  // Mock data
  const carts = [
    {
      id: 'CART-001',
      customer: {
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        phone: '+90 555 123 4567',
        isGuest: false
      },
      items: [
        {
          id: 1,
          name: 'Hair Mask - Deep Conditioning',
          sku: 'HM-DC-001',
          quantity: 2,
          price: 29.99,
          image: '/images/products/hair-mask.jpg'
        },
        {
          id: 2,
          name: 'Shampoo - Daily Care',
          sku: 'SH-DC-002',
          quantity: 1,
          price: 18.99,
          image: '/images/products/shampoo.jpg'
        }
      ],
      status: 'active',
      total: 78.97,
      subtotal: 68.97,
      tax: 10.00,
      shipping: 0.00,
      createdAt: '2024-01-20T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z',
      lastActivity: '2024-01-20T14:45:00Z',
      abandonedAt: null,
      recoveryEmailSent: false,
      notes: 'Customer added items but didn\'t complete checkout'
    },
    {
      id: 'CART-002',
      customer: {
        name: 'Guest User',
        email: 'guest@example.com',
        phone: null,
        isGuest: true
      },
      items: [
        {
          id: 3,
          name: 'Face Cream - Anti-Aging',
          sku: 'FC-AA-003',
          quantity: 1,
          price: 45.99,
          image: '/images/products/face-cream.jpg'
        }
      ],
      status: 'abandoned',
      total: 45.99,
      subtotal: 40.99,
      tax: 5.00,
      shipping: 0.00,
      createdAt: '2024-01-19T15:20:00Z',
      updatedAt: '2024-01-19T16:30:00Z',
      lastActivity: '2024-01-19T16:30:00Z',
      abandonedAt: '2024-01-19T16:30:00Z',
      recoveryEmailSent: true,
      notes: 'Abandoned after viewing product page'
    },
    {
      id: 'CART-003',
      customer: {
        name: 'Ayşe Demir',
        email: 'ayse@example.com',
        phone: '+90 555 987 6543',
        isGuest: false
      },
      items: [
        {
          id: 4,
          name: 'Body Lotion - Moisturizing',
          sku: 'BL-M-004',
          quantity: 3,
          price: 14.99,
          image: '/images/products/body-lotion.jpg'
        },
        {
          id: 5,
          name: 'Serum - Vitamin C',
          sku: 'SR-VC-005',
          quantity: 1,
          price: 39.99,
          image: '/images/products/serum.jpg'
        }
      ],
      status: 'active',
      total: 84.96,
      subtotal: 79.96,
      tax: 5.00,
      shipping: 0.00,
      createdAt: '2024-01-18T09:15:00Z',
      updatedAt: '2024-01-20T11:20:00Z',
      lastActivity: '2024-01-20T11:20:00Z',
      abandonedAt: null,
      recoveryEmailSent: false,
      notes: 'Customer is comparing products'
    },
    {
      id: 'CART-004',
      customer: {
        name: 'Guest User',
        email: 'visitor@example.com',
        phone: null,
        isGuest: true
      },
      items: [
        {
          id: 6,
          name: 'Perfume - Signature',
          sku: 'PF-SIG-006',
          quantity: 1,
          price: 89.99,
          image: '/images/products/perfume.jpg'
        }
      ],
      status: 'abandoned',
      total: 89.99,
      subtotal: 80.99,
      tax: 9.00,
      shipping: 0.00,
      createdAt: '2024-01-17T14:45:00Z',
      updatedAt: '2024-01-17T15:10:00Z',
      lastActivity: '2024-01-17T15:10:00Z',
      abandonedAt: '2024-01-17T15:10:00Z',
      recoveryEmailSent: false,
      notes: 'High-value abandoned cart'
    }
  ];

  const filteredCarts = carts.filter(cart => {
    const matchesSearch = cart.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cart.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cart.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || cart.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'abandoned':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Shopping Carts</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Monitor and manage customer shopping carts</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" className="flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="primary" className="flex items-center">
            <Edit className="w-4 h-4 mr-2" />
            Send Recovery Emails
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="dashboard-card border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Carts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">2</p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Abandoned Carts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">2</p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$299.91</p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Recovery Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">25%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="dashboard-card border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by cart ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="abandoned">Abandoned</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Carts List */}
      <div className="space-y-4">
        {filteredCarts.map((cart) => (
          <div key={cart.id} className="dashboard-card border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Cart Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Cart {cart.id}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {cart.customer.isGuest ? 'Guest User' : 'Registered User'} • {formatDate(cart.createdAt)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(cart.status)}`}>
                      {cart.status}
                    </span>
                    {cart.recoveryEmailSent && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        Recovery Sent
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
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

            {/* Cart Content */}
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Customer Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-900 dark:text-gray-100">{cart.customer.name}</p>
                    <p className="text-gray-500 dark:text-gray-400">{cart.customer.email}</p>
                    {cart.customer.phone && (
                      <p className="text-gray-500 dark:text-gray-400">{cart.customer.phone}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      Last activity: {getTimeAgo(cart.lastActivity)}
                    </p>
                  </div>
                </div>

                {/* Cart Items */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Cart Items ({cart.items.length})
                  </h4>
                  <div className="space-y-2">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 text-sm">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-gray-100">{item.name}</p>
                          <p className="text-gray-500 dark:text-gray-400">Qty: {item.quantity} × ${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cart Summary */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Cart Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Subtotal:</span>
                      <span className="text-gray-900 dark:text-gray-100">${cart.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Tax:</span>
                      <span className="text-gray-900 dark:text-gray-100">${cart.tax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Shipping:</span>
                      <span className="text-gray-900 dark:text-gray-100">${cart.shipping}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t border-gray-200 dark:border-gray-700 pt-2">
                      <span className="text-gray-900 dark:text-gray-100">Total:</span>
                      <span className="text-gray-900 dark:text-gray-100">${cart.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart Notes */}
              {cart.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Notes</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{cart.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex space-x-3">
                  <Button variant="secondary" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Cart
                  </Button>
                  {cart.status === 'abandoned' && !cart.recoveryEmailSent && (
                    <Button variant="primary" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Send Recovery Email
                    </Button>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Updated: {getTimeAgo(cart.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCarts.length === 0 && (
        <div className="text-center py-12">
          <div className="dashboard-card border border-gray-200 dark:border-gray-700 shadow-sm p-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No carts found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'No shopping carts available yet'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
