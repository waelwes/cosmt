'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MoreHorizontal,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Mock data for invoices
const mockInvoices = [
  {
    id: 'INV-001',
    orderId: 'ORD-12345',
    customer: 'John Doe',
    email: 'john@example.com',
    amount: 299.99,
    status: 'paid',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    paidDate: '2024-01-16',
    paymentMethod: 'Credit Card',
    items: 3
  },
  {
    id: 'INV-002',
    orderId: 'ORD-12346',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    amount: 149.50,
    status: 'pending',
    issueDate: '2024-01-16',
    dueDate: '2024-02-16',
    paidDate: null,
    paymentMethod: 'Bank Transfer',
    items: 2
  },
  {
    id: 'INV-003',
    orderId: 'ORD-12347',
    customer: 'Mike Johnson',
    email: 'mike@example.com',
    amount: 89.99,
    status: 'overdue',
    issueDate: '2024-01-10',
    dueDate: '2024-02-10',
    paidDate: null,
    paymentMethod: 'PayPal',
    items: 1
  },
  {
    id: 'INV-004',
    orderId: 'ORD-12348',
    customer: 'Sarah Wilson',
    email: 'sarah@example.com',
    amount: 199.99,
    status: 'paid',
    issueDate: '2024-01-17',
    dueDate: '2024-02-17',
    paidDate: '2024-01-18',
    paymentMethod: 'Credit Card',
    items: 4
  },
  {
    id: 'INV-005',
    orderId: 'ORD-12349',
    customer: 'David Brown',
    email: 'david@example.com',
    amount: 75.00,
    status: 'draft',
    issueDate: '2024-01-18',
    dueDate: '2024-02-18',
    paidDate: null,
    paymentMethod: 'Cash',
    items: 1
  }
];

const statusConfig = {
  paid: { label: 'Paid', color: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900', icon: CheckCircle },
  pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900', icon: Clock },
  overdue: { label: 'Overdue', color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900', icon: XCircle },
  draft: { label: 'Draft', color: 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900', icon: FileText }
};

function AdminInvoices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('issueDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort invoices
  const filteredInvoices = useMemo(() => {
    let filtered = mockInvoices.filter(invoice => {
      const matchesSearch = 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort invoices
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a];
      let bValue = b[sortBy as keyof typeof b];
      
      if (sortBy === 'amount') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  // Statistics
  const stats = useMemo(() => {
    const total = mockInvoices.length;
    const paid = mockInvoices.filter(inv => inv.status === 'paid').length;
    const pending = mockInvoices.filter(inv => inv.status === 'pending').length;
    const overdue = mockInvoices.filter(inv => inv.status === 'overdue').length;
    const totalAmount = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidAmount = mockInvoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);

    return { total, paid, pending, overdue, totalAmount, paidAmount };
  }, []);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: keyof typeof statusConfig) => {
    const Icon = statusConfig[status].icon;
    return <Icon className="w-4 h-4" />;
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Invoices</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage customer invoices and billing</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="dashboard-card border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Paid</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.paid}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(stats.totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="dashboard-card border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          
          <div>
            <Button variant="outline" className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="dashboard-card border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('id')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100"
                  >
                    <span>Invoice ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('customer')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100"
                  >
                    <span>Customer</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('amount')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100"
                  >
                    <span>Amount</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100"
                  >
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('issueDate')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100"
                  >
                    <span>Issue Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedInvoices.map((invoice) => {
                const statusInfo = statusConfig[invoice.status as keyof typeof statusConfig];
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {invoice.id}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Order: {invoice.orderId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {invoice.customer}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {invoice.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatPrice(invoice.amount)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {invoice.items} item{invoice.items !== 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {getStatusIcon(invoice.status as keyof typeof statusConfig)}
                        <span className="ml-1">{statusInfo.label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(invoice.issueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No invoices found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating a new invoice.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <div className="mt-6">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="dashboard-card border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminInvoices;
