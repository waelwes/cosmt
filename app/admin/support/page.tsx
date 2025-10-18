'use client';

import React, { memo, useMemo, useState } from 'react';
import { HelpCircle, FileText, MessageSquare, Users, BookOpen, Search, Plus, Edit, Trash2, Eye, Download, ExternalLink } from 'lucide-react';

// Mock data for support
const helpArticles = [
  {
    id: 1,
    title: 'How to create a new product',
    category: 'Products',
    status: 'published',
    views: 1250,
    lastUpdated: '2024-01-15',
    author: 'Admin',
    tags: ['product', 'creation', 'tutorial']
  },
  {
    id: 2,
    title: 'Managing inventory levels',
    category: 'Inventory',
    status: 'published',
    views: 890,
    lastUpdated: '2024-01-14',
    author: 'Admin',
    tags: ['inventory', 'stock', 'management']
  },
  {
    id: 3,
    title: 'Setting up payment gateways',
    category: 'Payments',
    status: 'draft',
    views: 0,
    lastUpdated: '2024-01-16',
    author: 'Admin',
    tags: ['payment', 'gateway', 'setup']
  },
  {
    id: 4,
    title: 'Customer support best practices',
    category: 'Support',
    status: 'published',
    views: 567,
    lastUpdated: '2024-01-13',
    author: 'Admin',
    tags: ['support', 'customer', 'best-practices']
  }
];

const faqs = [
  {
    id: 1,
    question: 'How do I add a new product to the store?',
    answer: 'To add a new product, go to Products > Add Product, fill in the required information including name, description, price, and images, then click Save.',
    category: 'Products',
    status: 'published',
    helpful: 45,
    notHelpful: 2
  },
  {
    id: 2,
    question: 'How can I track my orders?',
    answer: 'You can track your orders by going to Orders > All Orders and using the search and filter options to find specific orders.',
    category: 'Orders',
    status: 'published',
    helpful: 38,
    notHelpful: 1
  },
  {
    id: 3,
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers. We also support Turkish payment gateways like iyzico.',
    category: 'Payments',
    status: 'published',
    helpful: 52,
    notHelpful: 3
  },
  {
    id: 4,
    question: 'How do I update my account information?',
    answer: 'You can update your account information by going to Settings > Profile and editing the relevant fields.',
    category: 'Account',
    status: 'published',
    helpful: 29,
    notHelpful: 1
  }
];

const supportTickets = [
  {
    id: 1,
    subject: 'Product images not uploading',
    customer: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    status: 'open',
    priority: 'high',
    category: 'Technical',
    createdAt: '2024-01-16 14:30',
    lastActivity: '2024-01-16 15:45',
    assignedTo: 'Admin'
  },
  {
    id: 2,
    subject: 'Order status not updating',
    customer: 'Mike Chen',
    email: 'mike.chen@email.com',
    status: 'in-progress',
    priority: 'medium',
    category: 'Orders',
    createdAt: '2024-01-16 13:15',
    lastActivity: '2024-01-16 14:20',
    assignedTo: 'Admin'
  },
  {
    id: 3,
    subject: 'Payment gateway configuration',
    customer: 'Emma Wilson',
    email: 'emma.w@email.com',
    status: 'resolved',
    priority: 'low',
    category: 'Payments',
    createdAt: '2024-01-15 16:45',
    lastActivity: '2024-01-16 09:30',
    assignedTo: 'Admin'
  }
];

const documentation = [
  {
    id: 1,
    title: 'Admin Dashboard Guide',
    type: 'PDF',
    size: '2.4 MB',
    downloads: 156,
    lastUpdated: '2024-01-15',
    description: 'Complete guide to using the admin dashboard features'
  },
  {
    id: 2,
    title: 'API Documentation',
    type: 'HTML',
    size: '1.8 MB',
    downloads: 89,
    lastUpdated: '2024-01-14',
    description: 'REST API documentation for developers'
  },
  {
    id: 3,
    title: 'User Manual',
    type: 'PDF',
    size: '3.2 MB',
    downloads: 234,
    lastUpdated: '2024-01-13',
    description: 'Complete user manual for store management'
  }
];

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'published': return 'text-blue-600 bg-green-50';
    case 'draft': return 'text-yellow-600 bg-yellow-50';
    case 'open': return 'text-red-600 bg-red-50';
    case 'in-progress': return 'text-blue-600 bg-blue-50';
    case 'resolved': return 'text-blue-600 bg-green-50';
    case 'high': return 'text-red-600 bg-red-50';
    case 'medium': return 'text-yellow-600 bg-yellow-50';
    case 'low': return 'text-blue-600 bg-green-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const formatDate = (date: string) => new Date(date).toLocaleDateString();
const formatFileSize = (size: string) => size;

// Memoized components
const StatCard = memo(({ title, value, change, icon: Icon, color }: {
  title: string;
  value: string | number;
  change?: string;
  icon: any;
  color: string;
}) => (
        <div className="analytics-card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        {change && (
          <p className={`text-sm ${change.startsWith('+') ? 'text-blue-600' : 'text-red-600'}`}>
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

const HelpArticleCard = memo(({ article, onEdit, onDelete, onView, onPublish }: {
  article: any;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onPublish: (id: number) => void;
}) => (
  <div className="analytics-card p-4">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{article.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
            {article.status.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Category: {article.category}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>Views: {article.views.toLocaleString()}</span>
          <span>Updated: {formatDate(article.lastUpdated)}</span>
          <span>Author: {article.author}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {article.tags.map((tag: string) => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onView(article.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(article.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        {article.status === 'draft' && (
          <button
            onClick={() => onPublish(article.id)}
            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onDelete(article.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
));

const FAQCard = memo(({ faq, onEdit, onDelete, onView }: {
  faq: any;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}) => (
  <div className="analytics-card p-4">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{faq.question}</h3>
        <p className="text-sm text-gray-600 mb-3">{faq.answer}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span>Category: {faq.category}</span>
          <span>Helpful: {faq.helpful}</span>
          <span>Not Helpful: {faq.notHelpful}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onView(faq.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(faq.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(faq.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
));

const SupportTicketCard = memo(({ ticket, onEdit, onDelete, onView, onAssign }: {
  ticket: any;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onAssign: (id: number) => void;
}) => (
  <div className="analytics-card p-4">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{ticket.subject}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
            {ticket.status.toUpperCase()}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.priority)}`}>
            {ticket.priority.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Customer: {ticket.customer} ({ticket.email})</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span>Category: {ticket.category}</span>
          <span>Created: {ticket.createdAt}</span>
          <span>Assigned: {ticket.assignedTo}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onView(ticket.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onAssign(ticket.id)}
          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <Users className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(ticket.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(ticket.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
));

const DocumentationCard = memo(({ doc, onEdit, onDelete, onView, onDownload }: {
  doc: any;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onDownload: (id: number) => void;
}) => (
  <div className="analytics-card p-4">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{doc.title}</h3>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
            {doc.type}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span>Size: {formatFileSize(doc.size)}</span>
          <span>Downloads: {doc.downloads}</span>
          <span>Updated: {formatDate(doc.lastUpdated)}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onView(doc.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDownload(doc.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(doc.id)}
          className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(doc.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
));

export default function SupportCenter() {
  const [activeTab, setActiveTab] = useState('articles');
  const [searchTerm, setSearchTerm] = useState('');

  // Memoized calculations
  const stats = useMemo(() => {
    const totalArticles = helpArticles.length;
    const publishedArticles = helpArticles.filter(a => a.status === 'published').length;
    const totalViews = helpArticles.reduce((sum, a) => sum + a.views, 0);
    const openTickets = supportTickets.filter(t => t.status === 'open').length;
    const totalTickets = supportTickets.length;
    const totalFAQs = faqs.length;
    const totalDocs = documentation.length;
    
    return {
      totalArticles,
      publishedArticles,
      totalViews,
      openTickets,
      totalTickets,
      totalFAQs,
      totalDocs
    };
  }, []);

  const filteredArticles = useMemo(() => {
    return helpArticles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

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

  const handlePublish = (id: number) => {
    console.log('Publish article:', id);
    // TODO: Implement publish functionality
  };

  const handleAssign = (id: number) => {
    console.log('Assign ticket:', id);
    // TODO: Implement assign functionality
  };

  const handleDownload = (id: number) => {
    console.log('Download document:', id);
    // TODO: Implement download functionality
  };

  return (
    <div className="space-y-6" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Support Center</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage help articles, FAQs, and customer support</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Help Articles"
          value={stats.publishedArticles}
          change={`${stats.totalArticles} total`}
          icon={FileText}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          change="+15% this month"
          icon={Eye}
          color="bg-green-100 text-blue-600"
        />
        <StatCard
          title="Open Tickets"
          value={stats.openTickets}
          change={`${stats.totalTickets} total`}
          icon={MessageSquare}
          color="bg-orange-100 text-orange-600"
        />
        <StatCard
          title="Documentation"
          value={stats.totalDocs}
          icon={BookOpen}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Search */}
        <div className="analytics-card p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search help articles, FAQs, and documentation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ borderColor: '#eef2f6' }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="analytics-card">
        <div className="border-b" style={{ borderBottomColor: '#eef2f6' }}>
          <nav className="flex space-x-8 px-6 tab-navigation">
            {[
              { id: 'articles', name: 'Help Articles', count: helpArticles.length },
              { id: 'faqs', name: 'FAQs', count: faqs.length },
              { id: 'tickets', name: 'Support Tickets', count: supportTickets.length },
              { id: 'docs', name: 'Documentation', count: documentation.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Articles Tab */}
          {activeTab === 'articles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Help Articles</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New Article</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <HelpArticleCard
                    key={article.id}
                    article={article}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    onPublish={handlePublish}
                  />
                ))}
              </div>
            </div>
          )}

          {/* FAQs Tab */}
          {activeTab === 'faqs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New FAQ</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <FAQCard
                    key={faq.id}
                    faq={faq}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Support Tickets</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New Ticket</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <SupportTicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    onAssign={handleAssign}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Documentation Tab */}
          {activeTab === 'docs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Documentation</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Upload Document</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {documentation.map((doc) => (
                  <DocumentationCard
                    key={doc.id}
                    doc={doc}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
