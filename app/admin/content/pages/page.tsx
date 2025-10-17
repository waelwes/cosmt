'use client';

import React, { useState, memo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Calendar,
  User,
  Globe,
  FileText,
  Home,
  ShoppingBag,
  Info,
  Mail,
  Phone,
  MapPin,
  Heart,
  Star,
  Tag,
  Image as ImageIcon,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Mock data for pages
const mockPages = [
  {
    id: 1,
    title: 'Homepage',
    slug: '/',
    status: 'published',
    template: 'homepage',
    lastModified: '2024-01-15',
    author: 'Admin',
    views: 1250,
    seoTitle: 'COSMT - Premium Cosmetics & Beauty Products',
    seoDescription: 'Discover our premium collection of cosmetics and beauty products. High-quality skincare, makeup, and hair care essentials.',
    content: 'Homepage content with hero section, featured products, and brand story.',
    isHomepage: true
  },
  {
    id: 2,
    title: 'Shop',
    slug: '/shop',
    status: 'published',
    template: 'collection',
    lastModified: '2024-01-14',
    author: 'Admin',
    views: 890,
    seoTitle: 'Shop All Products - COSMT',
    seoDescription: 'Browse our complete collection of premium cosmetics and beauty products.',
    content: 'Product listing page with filters and categories.',
    isHomepage: false
  },
  {
    id: 3,
    title: 'About Us',
    slug: '/about',
    status: 'published',
    template: 'page',
    lastModified: '2024-01-13',
    author: 'Admin',
    views: 456,
    seoTitle: 'About COSMT - Our Story',
    seoDescription: 'Learn about COSMT\'s mission to provide premium beauty products.',
    content: 'Company story, mission, and team information.',
    isHomepage: false
  },
  {
    id: 4,
    title: 'Contact',
    slug: '/contact',
    status: 'published',
    template: 'page',
    lastModified: '2024-01-12',
    author: 'Admin',
    views: 234,
    seoTitle: 'Contact COSMT - Get in Touch',
    seoDescription: 'Contact us for support, inquiries, or feedback.',
    content: 'Contact form and company information.',
    isHomepage: false
  },
  {
    id: 5,
    title: 'Privacy Policy',
    slug: '/privacy',
    status: 'published',
    template: 'page',
    lastModified: '2024-01-10',
    author: 'Admin',
    views: 123,
    seoTitle: 'Privacy Policy - COSMT',
    seoDescription: 'Our privacy policy and data protection information.',
    content: 'Legal privacy policy content.',
    isHomepage: false
  },
  {
    id: 6,
    title: 'Terms of Service',
    slug: '/terms',
    status: 'draft',
    template: 'page',
    lastModified: '2024-01-09',
    author: 'Admin',
    views: 0,
    seoTitle: 'Terms of Service - COSMT',
    seoDescription: 'Terms and conditions for using our services.',
    content: 'Legal terms and conditions content.',
    isHomepage: false
  },
  {
    id: 7,
    title: 'Blog',
    slug: '/blog',
    status: 'published',
    template: 'blog',
    lastModified: '2024-01-08',
    author: 'Admin',
    views: 567,
    seoTitle: 'Beauty Blog - COSMT',
    seoDescription: 'Latest beauty tips, trends, and product reviews.',
    content: 'Blog listing page with articles.',
    isHomepage: false
  },
  {
    id: 8,
    title: 'FAQ',
    slug: '/faq',
    status: 'published',
    template: 'page',
    lastModified: '2024-01-07',
    author: 'Admin',
    views: 345,
    seoTitle: 'Frequently Asked Questions - COSMT',
    seoDescription: 'Find answers to common questions about our products and services.',
    content: 'Frequently asked questions and answers.',
    isHomepage: false
  }
];

const templateIcons = {
  homepage: Home,
  collection: ShoppingBag,
  page: FileText,
  blog: FileText,
  product: Tag,
  custom: Settings
};

const statusColors = {
  published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
};

const PageCard = memo(({ page, onEdit, onDelete, onDuplicate, onView }: {
  page: any;
  onEdit: (page: any) => void;
  onDelete: (page: any) => void;
  onDuplicate: (page: any) => void;
  onView: (page: any) => void;
}) => {
  const [showActions, setShowActions] = useState(false);
  const TemplateIcon = templateIcons[page.template as keyof typeof templateIcons] || FileText;

  return (
    <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <TemplateIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {page.title}
              </h3>
              {page.isHomepage && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  Homepage
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {page.slug}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {page.lastModified}
              </span>
              <span className="flex items-center">
                <User className="w-3 h-3 mr-1" />
                {page.author}
              </span>
              <span className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {page.views} views
              </span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 z-50">
              <div className="py-1">
                <button
                  onClick={() => {
                    onView(page);
                    setShowActions(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Eye className="w-4 h-4 mr-3" />
                  View Page
                </button>
                <button
                  onClick={() => {
                    onEdit(page);
                    setShowActions(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Edit className="w-4 h-4 mr-3" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDuplicate(page);
                    setShowActions(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Copy className="w-4 h-4 mr-3" />
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    onDelete(page);
                    setShowActions(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900"
                >
                  <Trash2 className="w-4 h-4 mr-3" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[page.status as keyof typeof statusColors]}`}>
          {page.status}
        </span>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {page.template}
        </div>
      </div>
    </div>
  );
});

export default function CustomPages() {
  const [pages, setPages] = useState(mockPages);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    const matchesTemplate = templateFilter === 'all' || page.template === templateFilter;
    
    return matchesSearch && matchesStatus && matchesTemplate;
  });

  const handleEdit = (page: any) => {
    console.log('Edit page:', page);
    // Navigate to page editor
  };

  const handleDelete = (page: any) => {
    if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
      setPages(pages.filter(p => p.id !== page.id));
    }
  };

  const handleDuplicate = (page: any) => {
    const newPage = {
      ...page,
      id: Math.max(...pages.map(p => p.id)) + 1,
      title: `${page.title} (Copy)`,
      slug: `${page.slug}-copy`,
      status: 'draft',
      views: 0,
      lastModified: new Date().toISOString().split('T')[0]
    };
    setPages([...pages, newPage]);
  };

  const handleView = (page: any) => {
    window.open(page.slug, '_blank');
  };

  const handleCreatePage = () => {
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Custom Pages</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage all pages of your website like Shopify's page editor
          </p>
        </div>
        <Button onClick={handleCreatePage} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Page</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Template Filter */}
          <div className="sm:w-48">
            <select
              value={templateFilter}
              onChange={(e) => setTemplateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Templates</option>
              <option value="homepage">Homepage</option>
              <option value="collection">Collection</option>
              <option value="page">Page</option>
              <option value="blog">Blog</option>
              <option value="product">Product</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pages</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{pages.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Globe className="w-5 h-5 text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Published</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {pages.filter(p => p.status === 'published').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Edit className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Drafts</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {pages.filter(p => p.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Eye className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {pages.reduce((sum, page) => sum + page.views, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPages.map((page) => (
          <PageCard
            key={page.id}
            page={page}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onView={handleView}
          />
        ))}
      </div>

      {filteredPages.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No pages found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm || statusFilter !== 'all' || templateFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by creating your first page'
            }
          </p>
          <Button onClick={handleCreatePage}>
            <Plus className="w-4 h-4 mr-2" />
            Create Page
          </Button>
        </div>
      )}
    </div>
  );
}
