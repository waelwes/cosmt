'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Mail,
  Phone,
  MapPin,
  Star,
  ShoppingBag,
  Calendar,
  UserPlus,
  UserCheck,
  AlertTriangle,
  X,
  Save,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  tier: 'regular' | 'premium' | 'vip';
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  joinDate: string;
  location: string;
  avatar: string;
  rating: number;
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showViewModal, setShowViewModal] = useState<Customer | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);

  // State for customers - in real app, this would come from API
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      phone: '+90 555 123 4567',
      status: 'active',
      tier: 'premium',
      totalOrders: 12,
      totalSpent: 1250.50,
      lastOrder: '2024-01-15',
      joinDate: '2023-06-15',
      location: 'İstanbul, Turkey',
      avatar: '/api/placeholder/40/40',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Ayşe Demir',
      email: 'ayse@example.com',
      phone: '+90 555 234 5678',
      status: 'active',
      tier: 'regular',
      totalOrders: 8,
      totalSpent: 567.25,
      lastOrder: '2024-01-14',
      joinDate: '2023-08-20',
      location: 'Ankara, Turkey',
      avatar: '/api/placeholder/40/40',
      rating: 4.5
    },
    {
      id: 3,
      name: 'Mehmet Kaya',
      email: 'mehmet@example.com',
      phone: '+90 555 345 6789',
      status: 'inactive',
      tier: 'regular',
      totalOrders: 3,
      totalSpent: 234.75,
      lastOrder: '2023-12-10',
      joinDate: '2023-10-05',
      location: 'İzmir, Turkey',
      avatar: '/api/placeholder/40/40',
      rating: 4.2
    },
    {
      id: 4,
      name: 'Fatma Öz',
      email: 'fatma@example.com',
      phone: '+90 555 456 7890',
      status: 'active',
      tier: 'vip',
      totalOrders: 25,
      totalSpent: 3450.00,
      lastOrder: '2024-01-15',
      joinDate: '2023-03-12',
      location: 'Bursa, Turkey',
      avatar: '/api/placeholder/40/40',
      rating: 4.9
    },
    {
      id: 5,
      name: 'Ali Veli',
      email: 'ali@example.com',
      phone: '+90 555 567 8901',
      status: 'blocked',
      tier: 'regular',
      totalOrders: 1,
      totalSpent: 89.99,
      lastOrder: '2023-11-20',
      joinDate: '2023-11-15',
      location: 'Antalya, Turkey',
      avatar: '/api/placeholder/40/40',
      rating: 2.1
    }
  ]);

  const statuses = ['all', 'active', 'inactive', 'blocked'];
  const tiers = ['all', 'regular', 'premium', 'vip'];

  // CRUD Operations
  const handleEdit = (customer: Customer) => {
    setEditingCustomer({ ...customer });
  };

  const handleSave = () => {
    if (editingCustomer) {
      setCustomers(prev => 
        prev.map(c => c.id === editingCustomer.id ? editingCustomer : c)
      );
      setEditingCustomer(null);
    }
  };

  const handleCancel = () => {
    setEditingCustomer(null);
  };

  const handleDelete = (id: number) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    setShowDeleteModal(null);
  };

  const handleView = (customer: Customer) => {
    setShowViewModal(customer);
  };

  const handleUpdateField = (field: keyof Customer, value: any) => {
    if (editingCustomer) {
      setEditingCustomer(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  // Memoized filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone.includes(searchTerm);
      const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
      const matchesTier = selectedTier === 'all' || customer.tier === selectedTier;
      return matchesSearch && matchesStatus && matchesTier;
    });
  }, [customers, searchTerm, selectedStatus, selectedTier]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'vip':
        return 'bg-purple-100 text-purple-800';
      case 'premium':
        return 'bg-blue-100 text-blue-800';
      case 'regular':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'vip':
        return <Star className="w-4 h-4" />;
      case 'premium':
        return <UserCheck className="w-4 h-4" />;
      case 'regular':
        return <UserPlus className="w-4 h-4" />;
      default:
        return <UserPlus className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Customers</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your customer database</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50" style={{ borderColor: '#eef2f6' }}>
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="analytics-card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">2,456</p>
            </div>
          </div>
        </div>
        <div className="analytics-card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1,892</p>
            </div>
          </div>
        </div>
        <div className="analytics-card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">VIP</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">156</p>
            </div>
          </div>
        </div>
        <div className="analytics-card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">408</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="analytics-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ borderColor: '#eef2f6' }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ borderColor: '#eef2f6' }}
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Tier Filter */}
          <div>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ borderColor: '#eef2f6' }}
            >
              {tiers.map(tier => (
                <option key={tier} value={tier}>
                  {tier === 'all' ? 'All Tiers' : tier.charAt(0).toUpperCase() + tier.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="analytics-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y" style={{ borderColor: '#eef2f6' }}>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={customer.avatar}
                          alt={customer.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{customer.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">ID: {customer.id}</div>
                        <div className="flex items-center mt-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">{customer.rating}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{customer.email}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {customer.phone}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {customer.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(customer.tier)}`}>
                      {getTierIcon(customer.tier)}
                      <span className="ml-1">{customer.tier}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{customer.totalOrders}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">orders</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">₺{customer.totalSpent.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{customer.lastOrder}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Joined {customer.joinDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleView(customer)}
                        className="text-gray-400 hover:text-blue-600 transition-colors" 
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(customer)}
                        className="text-gray-400 hover:text-green-600 transition-colors" 
                        title="Edit Customer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors" title="Send Email">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setShowDeleteModal(customer.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors" 
                        title="Delete Customer"
                      >
                        <Trash2 className="w-4 h-4" />
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCustomers.length}</span> of{' '}
            <span className="font-medium">{customers.length}</span> results
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

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Customer</h3>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={editingCustomer.name}
                  onChange={(e) => handleUpdateField('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editingCustomer.email}
                  onChange={(e) => handleUpdateField('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editingCustomer.phone}
                  onChange={(e) => handleUpdateField('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editingCustomer.location}
                  onChange={(e) => handleUpdateField('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={editingCustomer.status}
                  onChange={(e) => handleUpdateField('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tier
                </label>
                <select
                  value={editingCustomer.tier}
                  onChange={(e) => handleUpdateField('tier', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="regular">Regular</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
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

      {/* View Customer Modal */}
      {showViewModal && (
        <div className="modal-overlay" onClick={() => setShowViewModal(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Customer Profile - {showViewModal.name}</h3>
              <button onClick={() => setShowViewModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={showViewModal.avatar}
                  alt={showViewModal.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xl font-semibold">{showViewModal.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{showViewModal.email}</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm">{showViewModal.rating}/5.0</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{showViewModal.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{showViewModal.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(showViewModal.status)}`}>
                    {showViewModal.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tier</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(showViewModal.tier)}`}>
                    {showViewModal.tier}
                  </span>
                </div>
              </div>
              
              {/* Order Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{showViewModal.totalOrders}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Orders</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">₺{showViewModal.totalSpent.toFixed(2)}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Spent</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{showViewModal.rating}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Rating</div>
                </div>
              </div>
              
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Order</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{showViewModal.lastOrder}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Join Date</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{showViewModal.joinDate}</p>
                </div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-600">Delete Customer</h3>
              <button onClick={() => setShowDeleteModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this customer? This action cannot be undone and will remove all customer data.
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowDeleteModal(null)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={() => handleDelete(showDeleteModal)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Customer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
