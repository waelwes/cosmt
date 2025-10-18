'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Printer,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  X,
  Save,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingStatus: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'returned';
  date: string;
  items: number;
  shippingAddress: string;
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showViewModal, setShowViewModal] = useState<Order | null>(null);

  // State for orders - in real app, this would come from API
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '#12345',
      customer: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      phone: '+90 555 123 4567',
      total: 89.99,
      status: 'completed',
      paymentStatus: 'paid',
      shippingStatus: 'delivered',
      date: '2024-01-15',
      items: 2,
      shippingAddress: 'İstanbul, Turkey'
    },
    {
      id: '#12346',
      customer: 'Ayşe Demir',
      email: 'ayse@example.com',
      phone: '+90 555 234 5678',
      total: 156.50,
      status: 'processing',
      paymentStatus: 'paid',
      shippingStatus: 'preparing',
      date: '2024-01-15',
      items: 3,
      shippingAddress: 'Ankara, Turkey'
    },
    {
      id: '#12347',
      customer: 'Mehmet Kaya',
      email: 'mehmet@example.com',
      phone: '+90 555 345 6789',
      total: 67.25,
      status: 'shipped',
      paymentStatus: 'paid',
      shippingStatus: 'in_transit',
      date: '2024-01-14',
      items: 1,
      shippingAddress: 'İzmir, Turkey'
    },
    {
      id: '#12348',
      customer: 'Fatma Öz',
      email: 'fatma@example.com',
      phone: '+90 555 456 7890',
      total: 124.99,
      status: 'pending',
      paymentStatus: 'pending',
      shippingStatus: 'pending',
      date: '2024-01-14',
      items: 2,
      shippingAddress: 'Bursa, Turkey'
    },
    {
      id: '#12349',
      customer: 'Ali Veli',
      email: 'ali@example.com',
      phone: '+90 555 567 8901',
      total: 234.75,
      status: 'cancelled',
      paymentStatus: 'refunded',
      shippingStatus: 'cancelled',
      date: '2024-01-13',
      items: 4,
      shippingAddress: 'Antalya, Turkey'
    }
  ]);

  const statuses = ['all', 'pending', 'processing', 'shipped', 'completed', 'cancelled'];
  const dateRanges = ['all', 'today', 'week', 'month', 'year'];

  // CRUD Operations
  const handleEdit = (order: Order) => {
    setEditingOrder({ ...order });
  };

  const handleSave = () => {
    if (editingOrder) {
      setOrders(prev => 
        prev.map(o => o.id === editingOrder.id ? editingOrder : o)
      );
      setEditingOrder(null);
    }
  };

  const handleCancel = () => {
    setEditingOrder(null);
  };

  const handleView = (order: Order) => {
    setShowViewModal(order);
  };

  const handleUpdateField = (field: keyof Order, value: any) => {
    if (editingOrder) {
      setEditingOrder(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(prev => 
      prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o)
    );
  };

  // Memoized filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-active';
      case 'processing':
        return 'status-active';
      case 'shipped':
        return 'status-active';
      case 'pending':
        return 'status-inactive';
      case 'cancelled':
        return 'status-inactive';
      default:
        return 'status-inactive';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'status-active';
      case 'pending':
        return 'status-inactive';
      case 'refunded':
        return 'status-active';
      case 'failed':
        return 'status-inactive';
      default:
        return 'status-inactive';
    }
  };

  const getShippingStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'status-active';
      case 'in_transit':
        return 'status-active';
      case 'preparing':
        return 'status-inactive';
      case 'pending':
        return 'status-inactive';
      case 'cancelled':
        return 'status-inactive';
      default:
        return 'status-inactive';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Combined Orders Card */}
      <div className="analytics-card p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Orders</h1>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Printer className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            New Order
          </button>
        </div>
        </div>
        
        {/* Horizontal Line */}
        <div className="border-t mb-4"></div>
        
        {/* Stats Grid */}
        <div className="flex">
          <div className="flex-1 py-4 px-4 border-r">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Total Orders</h3>
              <Package className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">All orders</p>
            </div>
          </div>
          
          <div className="flex-1 py-4 px-4 border-r">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Pending</h3>
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.filter(o => o.status === 'pending').length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Awaiting processing</p>
            </div>
          </div>
          
          <div className="flex-1 py-4 px-4 border-r">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Shipped</h3>
              <Truck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.filter(o => o.status === 'shipped').length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">In transit</p>
            </div>
          </div>
          
          <div className="flex-1 py-4 px-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Completed</h3>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.filter(o => o.status === 'completed').length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Successfully delivered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="analytics-card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">12</p>
            </div>
          </div>
        </div>
        <div className="analytics-card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Package className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">8</p>
            </div>
          </div>
        </div>
        <div className="analytics-card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Shipped</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">15</p>
            </div>
          </div>
        </div>
        <div className="analytics-card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">234</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg  border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 filter-input"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full filter-select"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full filter-select"
            >
              {dateRanges.map(range => (
                <option key={range} value={range}>
                  {range === 'all' ? 'All Time' : range.charAt(0).toUpperCase() + range.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="analytics-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Shipping
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y" style={{ borderColor: '#eef2f6' }}>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{order.id}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{order.items} items</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{order.customer}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{order.email}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{order.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">${order.total.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getShippingStatusColor(order.shippingStatus)}`}>
                      {order.shippingStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleView(order)}
                        className="text-gray-400 hover:text-blue-600 transition-colors" 
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(order)}
                        className="text-gray-400 hover:text-green-600 transition-colors" 
                        title="Edit Order"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors" title="Print Invoice">
                        <Printer className="w-4 h-4" />
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        title="Update Status"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
            <span className="font-medium">{orders.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
              Previous
            </button>
            <button className="px-3 py-1 text-sm text-white bg-cosmt-primary rounded">
              1
            </button>
            <button className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Order</h3>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Order ID
                </label>
                <input
                  type="text"
                  value={editingOrder.id}
                  onChange={(e) => handleUpdateField('id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={editingOrder.customer}
                  onChange={(e) => handleUpdateField('customer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editingOrder.email}
                  onChange={(e) => handleUpdateField('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingOrder.total}
                  onChange={(e) => handleUpdateField('total', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={editingOrder.status}
                  onChange={(e) => handleUpdateField('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {showViewModal && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Order Details - {showViewModal.id}</h3>
              <button onClick={() => setShowViewModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{showViewModal.customer}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{showViewModal.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{showViewModal.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{showViewModal.date}</p>
                </div>
              </div>
              
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Amount</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">${showViewModal.total.toFixed(2)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Items</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{showViewModal.items} items</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(showViewModal.status)}`}>
                    {showViewModal.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(showViewModal.paymentStatus)}`}>
                    {showViewModal.paymentStatus}
                  </span>
                </div>
              </div>
              
              {/* Shipping Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shipping Address</label>
                <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                  {showViewModal.shippingAddress}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button variant="secondary" onClick={() => setShowViewModal(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
