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
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function OrderDetailsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock data
  const orders = [
    {
      id: 'ORD-001',
      customer: {
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        phone: '+90 555 123 4567'
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
      status: 'processing',
      paymentStatus: 'paid',
      shippingStatus: 'pending',
      total: 78.97,
      subtotal: 68.97,
      tax: 10.00,
      shipping: 0.00,
      createdAt: '2024-01-20T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z',
      shippingAddress: {
        name: 'Ahmet Yılmaz',
        address: 'Atatürk Caddesi No: 123',
        city: 'İstanbul',
        district: 'Kadıköy',
        postalCode: '34710',
        country: 'Turkey'
      },
      billingAddress: {
        name: 'Ahmet Yılmaz',
        address: 'Atatürk Caddesi No: 123',
        city: 'İstanbul',
        district: 'Kadıköy',
        postalCode: '34710',
        country: 'Turkey'
      },
      paymentMethod: 'Credit Card',
      trackingNumber: 'TRK123456789',
      notes: 'Customer requested express delivery'
    },
    {
      id: 'ORD-002',
      customer: {
        name: 'Ayşe Demir',
        email: 'ayse@example.com',
        phone: '+90 555 987 6543'
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
      status: 'shipped',
      paymentStatus: 'paid',
      shippingStatus: 'shipped',
      total: 45.99,
      subtotal: 40.99,
      tax: 5.00,
      shipping: 0.00,
      createdAt: '2024-01-19T15:20:00Z',
      updatedAt: '2024-01-20T09:15:00Z',
      shippingAddress: {
        name: 'Ayşe Demir',
        address: 'Cumhuriyet Mahallesi No: 456',
        city: 'Ankara',
        district: 'Çankaya',
        postalCode: '06100',
        country: 'Turkey'
      },
      billingAddress: {
        name: 'Ayşe Demir',
        address: 'Cumhuriyet Mahallesi No: 456',
        city: 'Ankara',
        district: 'Çankaya',
        postalCode: '06100',
        country: 'Turkey'
      },
      paymentMethod: 'Bank Transfer',
      trackingNumber: 'TRK987654321',
      notes: ''
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Order Details</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View and manage individual order details</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" className="flex items-center">
            <Package className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
          <Button variant="primary" className="flex items-center">
            <Edit className="w-4 h-4 mr-2" />
            Update Status
          </Button>
        </div>
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
                placeholder="Search by order ID, customer name, or email..."
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
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="dashboard-card border border-gray-200 dark:border-gray-700  overflow-hidden">
            {/* Order Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Order {order.id}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="secondary" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Order Content */}
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Customer Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-900 dark:text-gray-100">{order.customer.name}</p>
                    <p className="text-gray-500 dark:text-gray-400">{order.customer.email}</p>
                    <p className="text-gray-500 dark:text-gray-400">{order.customer.phone}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Order Items
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
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

                {/* Order Summary */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Order Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Subtotal:</span>
                      <span className="text-gray-900 dark:text-gray-100">${order.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Tax:</span>
                      <span className="text-gray-900 dark:text-gray-100">${order.tax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Shipping:</span>
                      <span className="text-gray-900 dark:text-gray-100">${order.shipping}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t border-gray-200 dark:border-gray-700 pt-2">
                      <span className="text-gray-900 dark:text-gray-100">Total:</span>
                      <span className="text-gray-900 dark:text-gray-100">${order.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Shipping Address
                </h4>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.district}, {order.shippingAddress.city} {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>

              {/* Tracking Info */}
              {order.trackingNumber && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                    <Truck className="w-4 h-4 mr-2" />
                    Tracking Information
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tracking Number: <span className="font-mono">{order.trackingNumber}</span>
                  </p>
                </div>
              )}

              {/* Notes */}
              {order.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Notes</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="dashboard-card border border-gray-200 dark:border-gray-700  p-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No orders found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'No orders available yet'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
