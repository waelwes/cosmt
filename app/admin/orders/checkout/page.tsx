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
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CheckoutPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');

  // Mock data
  const checkouts = [
    {
      id: 'CHK-001',
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
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      total: 78.97,
      subtotal: 68.97,
      tax: 10.00,
      shipping: 0.00,
      createdAt: '2024-01-20T10:30:00Z',
      completedAt: '2024-01-20T10:45:00Z',
      orderId: 'ORD-001',
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
      notes: 'Customer requested express delivery'
    },
    {
      id: 'CHK-002',
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
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'Bank Transfer',
      total: 45.99,
      subtotal: 40.99,
      tax: 5.00,
      shipping: 0.00,
      createdAt: '2024-01-20T14:20:00Z',
      completedAt: null,
      orderId: null,
      shippingAddress: {
        name: 'Guest User',
        address: 'Cumhuriyet Mahallesi No: 456',
        city: 'Ankara',
        district: 'Çankaya',
        postalCode: '06100',
        country: 'Turkey'
      },
      billingAddress: {
        name: 'Guest User',
        address: 'Cumhuriyet Mahallesi No: 456',
        city: 'Ankara',
        district: 'Çankaya',
        postalCode: '06100',
        country: 'Turkey'
      },
      notes: 'Waiting for bank transfer confirmation'
    },
    {
      id: 'CHK-003',
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
      status: 'failed',
      paymentStatus: 'failed',
      paymentMethod: 'Credit Card',
      total: 84.96,
      subtotal: 79.96,
      tax: 5.00,
      shipping: 0.00,
      createdAt: '2024-01-19T16:15:00Z',
      completedAt: null,
      orderId: null,
      shippingAddress: {
        name: 'Ayşe Demir',
        address: 'Gazi Mustafa Kemal Bulvarı No: 789',
        city: 'İzmir',
        district: 'Konak',
        postalCode: '35250',
        country: 'Turkey'
      },
      billingAddress: {
        name: 'Ayşe Demir',
        address: 'Gazi Mustafa Kemal Bulvarı No: 789',
        city: 'İzmir',
        district: 'Konak',
        postalCode: '35250',
        country: 'Turkey'
      },
      notes: 'Payment declined - insufficient funds'
    },
    {
      id: 'CHK-004',
      customer: {
        name: 'Mehmet Kaya',
        email: 'mehmet@example.com',
        phone: '+90 555 456 7890',
        isGuest: false
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
      status: 'in_progress',
      paymentStatus: 'processing',
      paymentMethod: 'PayPal',
      total: 89.99,
      subtotal: 80.99,
      tax: 9.00,
      shipping: 0.00,
      createdAt: '2024-01-20T11:30:00Z',
      completedAt: null,
      orderId: null,
      shippingAddress: {
        name: 'Mehmet Kaya',
        address: 'Fevzi Paşa Bulvarı No: 321',
        city: 'Bursa',
        district: 'Osmangazi',
        postalCode: '16010',
        country: 'Turkey'
      },
      billingAddress: {
        name: 'Mehmet Kaya',
        address: 'Fevzi Paşa Bulvarı No: 321',
        city: 'Bursa',
        district: 'Osmangazi',
        postalCode: '16010',
        country: 'Turkey'
      },
      notes: 'PayPal payment processing'
    }
  ];

  const filteredCheckouts = checkouts.filter(checkout => {
    const matchesSearch = checkout.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checkout.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checkout.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || checkout.status === selectedStatus;
    const matchesPaymentStatus = selectedPaymentStatus === 'all' || checkout.paymentStatus === selectedPaymentStatus;
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <ShoppingCart className="w-4 h-4" />;
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Checkout Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Monitor and manage checkout processes</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="primary" className="flex items-center">
            <Send className="w-4 h-4 mr-2" />
            Send Reminders
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="dashboard-card border border-gray-200 dark:border-gray-700  p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1</p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card border border-gray-200 dark:border-gray-700  p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1</p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card border border-gray-200 dark:border-gray-700  p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1</p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card border border-gray-200 dark:border-gray-700  p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Failed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="dashboard-card border border-gray-200 dark:border-gray-700  p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by checkout ID, customer name, or email..."
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
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Checkouts List */}
      <div className="space-y-4">
        {filteredCheckouts.map((checkout) => (
          <div key={checkout.id} className="dashboard-card border border-gray-200 dark:border-gray-700  overflow-hidden">
            {/* Checkout Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Checkout {checkout.id}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {checkout.customer.isGuest ? 'Guest User' : 'Registered User'} • {formatDate(checkout.createdAt)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(checkout.status)}`}>
                      {getStatusIcon(checkout.status)}
                      <span className="ml-1">{checkout.status.replace('_', ' ')}</span>
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(checkout.paymentStatus)}`}>
                      <CreditCard className="w-3 h-3 mr-1" />
                      {checkout.paymentStatus}
                    </span>
                    {checkout.orderId && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        <Package className="w-3 h-3 mr-1" />
                        {checkout.orderId}
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
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Checkout Content */}
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Customer Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-900 dark:text-gray-100">{checkout.customer.name}</p>
                    <p className="text-gray-500 dark:text-gray-400">{checkout.customer.email}</p>
                    {checkout.customer.phone && (
                      <p className="text-gray-500 dark:text-gray-400">{checkout.customer.phone}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      Started: {getTimeAgo(checkout.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Checkout Items */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Checkout Items ({checkout.items.length})
                  </h4>
                  <div className="space-y-2">
                    {checkout.items.map((item) => (
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

                {/* Checkout Summary */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Checkout Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Subtotal:</span>
                      <span className="text-gray-900 dark:text-gray-100">${checkout.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Tax:</span>
                      <span className="text-gray-900 dark:text-gray-100">${checkout.tax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Shipping:</span>
                      <span className="text-gray-900 dark:text-gray-100">${checkout.shipping}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t border-gray-200 dark:border-gray-700 pt-2">
                      <span className="text-gray-900 dark:text-gray-100">Total:</span>
                      <span className="text-gray-900 dark:text-gray-100">${checkout.total}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Payment Method: {checkout.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <Truck className="w-4 h-4 mr-2" />
                  Shipping Address
                </h4>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>{checkout.shippingAddress.name}</p>
                  <p>{checkout.shippingAddress.address}</p>
                  <p>{checkout.shippingAddress.district}, {checkout.shippingAddress.city} {checkout.shippingAddress.postalCode}</p>
                  <p>{checkout.shippingAddress.country}</p>
                </div>
              </div>

              {/* Checkout Notes */}
              {checkout.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Notes</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{checkout.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex space-x-3">
                  {checkout.status === 'pending' && (
                    <Button variant="primary" size="sm">
                      <Send className="w-4 h-4 mr-2" />
                      Send Payment Reminder
                    </Button>
                  )}
                  {checkout.status === 'failed' && (
                    <Button variant="secondary" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry Payment
                    </Button>
                  )}
                  {checkout.status === 'in_progress' && (
                    <Button variant="secondary" size="sm">
                      <Clock className="w-4 h-4 mr-2" />
                      Check Status
                    </Button>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {checkout.completedAt ? `Completed: ${getTimeAgo(checkout.completedAt)}` : 'In Progress'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCheckouts.length === 0 && (
        <div className="text-center py-12">
          <div className="dashboard-card border border-gray-200 dark:border-gray-700  p-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No checkouts found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'No checkout processes available yet'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
