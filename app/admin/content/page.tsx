'use client';

import React, { memo, useMemo, useState } from 'react';
import { FileText, Menu, Globe, Image, Edit, Trash2, Eye, Plus, Save, X, Settings } from 'lucide-react';

// Mock data for content management
const pages = [
  {
    id: 1,
    title: 'Home Page',
    slug: '/',
    status: 'published',
    lastModified: '2024-01-16',
    author: 'Admin',
    views: 15420,
    seoTitle: 'Cosmat - Premium Beauty & Hair Care Products',
    seoDescription: 'Discover our curated collection of premium beauty and hair care products from top brands like AVEDA and DAVINES.'
  },
  {
    id: 2,
    title: 'About Us',
    slug: '/about',
    status: 'published',
    lastModified: '2024-01-15',
    author: 'Admin',
    views: 3250,
    seoTitle: 'About Cosmat - Your Beauty Destination',
    seoDescription: 'Learn about our mission to provide premium beauty products and exceptional customer service.'
  },
  {
    id: 3,
    title: 'Contact',
    slug: '/contact',
    status: 'draft',
    lastModified: '2024-01-14',
    author: 'Admin',
    views: 890,
    seoTitle: 'Contact Cosmat - Get in Touch',
    seoDescription: 'Reach out to us for any questions about our products or services.'
  },
  {
    id: 4,
    title: 'Privacy Policy',
    slug: '/privacy',
    status: 'published',
    lastModified: '2024-01-10',
    author: 'Admin',
    views: 1200,
    seoTitle: 'Privacy Policy - Cosmat',
    seoDescription: 'Our privacy policy and how we protect your personal information.'
  }
];

const menuItems = [
  {
    id: 1,
    title: 'Home',
    url: '/',
    type: 'page',
    position: 1,
    status: 'active',
    parentId: null
  },
  {
    id: 2,
    title: 'Products',
    url: '/products',
    type: 'category',
    position: 2,
    status: 'active',
    parentId: null
  },
  {
    id: 3,
    title: 'Hair Care',
    url: '/categories/hair-care',
    type: 'category',
    position: 1,
    status: 'active',
    parentId: 2
  },
  {
    id: 4,
    title: 'Skincare',
    url: '/categories/skincare',
    type: 'category',
    position: 2,
    status: 'active',
    parentId: 2
  },
  {
    id: 5,
    title: 'About',
    url: '/about',
    type: 'page',
    position: 3,
    status: 'active',
    parentId: null
  },
  {
    id: 6,
    title: 'Contact',
    url: '/contact',
    type: 'page',
    position: 4,
    status: 'inactive',
    parentId: null
  }
];

const mediaFiles = [
  {
    id: 1,
    name: 'hero-banner.jpg',
    type: 'image',
    size: '2.4 MB',
    dimensions: '1920x1080',
    url: '/images/hero-banner.jpg',
    uploadedAt: '2024-01-16',
    usedIn: ['Home Page']
  },
  {
    id: 2,
    name: 'product-showcase.png',
    type: 'image',
    size: '1.8 MB',
    dimensions: '800x600',
    url: '/images/product-showcase.png',
    uploadedAt: '2024-01-15',
    usedIn: ['Products Page', 'Home Page']
  },
  {
    id: 3,
    name: 'brand-logo.svg',
    type: 'image',
    size: '45 KB',
    dimensions: '200x100',
    url: '/images/brand-logo.svg',
    uploadedAt: '2024-01-14',
    usedIn: ['Header', 'Footer']
  },
  {
    id: 4,
    name: 'product-video.mp4',
    type: 'video',
    size: '15.2 MB',
    dimensions: '1280x720',
    url: '/videos/product-video.mp4',
    uploadedAt: '2024-01-13',
    usedIn: ['Product Detail Page']
  }
];

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'published': return 'text-green-600 bg-green-50';
    case 'draft': return 'text-yellow-600 bg-yellow-50';
    case 'active': return 'text-green-600 bg-green-50';
    case 'inactive': return 'text-gray-600 bg-gray-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const formatFileSize = (size: string) => size;
const formatDate = (date: string) => new Date(date).toLocaleDateString();

// Memoized components
const StatCard = memo(({ title, value, change, icon: Icon, color }: {
  title: string;
  value: string | number;
  change?: string;
  icon: any;
  color: string;
}) => (
        <div className="dashboard-card p-6">
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

const PageCard = memo(({ page, onEdit, onDelete, onView, onDuplicate }: {
  page: any;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onDuplicate: (id: number) => void;
}) => (
  <div className="dashboard-card p-6">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{page.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
            {page.status.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded inline-block mb-2">
          {page.slug}
        </p>
        <p className="text-sm text-gray-600 mb-2">{page.seoDescription}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span>Modified: {formatDate(page.lastModified)}</span>
          <span>Author: {page.author}</span>
          <span>Views: {page.views.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onView(page.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(page.id)}
          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDuplicate(page.id)}
          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(page.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
));

const MenuItemCard = memo(({ item, onEdit, onDelete, onToggle, level = 0 }: {
  item: any;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  level?: number;
}) => (
  <div className={`dashboard-card p-4 ${level > 0 ? 'ml-6' : ''}`}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
            {item.status.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
          {item.url}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mt-1">
          {item.type} • Position: {item.position}
        </p>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onToggle(item.id)}
          className={`p-2 rounded-lg transition-colors ${
            item.status === 'active'
              ? 'text-green-600 hover:bg-green-50'
              : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          <Settings className="w-4 h-4" />
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
));

const MediaFileCard = memo(({ file, onEdit, onDelete, onView }: {
  file: any;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}) => (
  <div className="dashboard-card p-4">
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
        {file.type === 'image' ? (
          <Image className="w-8 h-8 text-gray-600" />
        ) : (
          <FileText className="w-8 h-8 text-gray-600" />
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{file.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {file.type.toUpperCase()} • {file.size} • {file.dimensions}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Uploaded: {formatDate(file.uploadedAt)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Used in: {file.usedIn.join(', ')}
        </p>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onView(file.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(file.id)}
          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(file.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
));

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState('pages');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Memoized calculations
  const stats = useMemo(() => {
    const totalPages = pages.length;
    const publishedPages = pages.filter(p => p.status === 'published').length;
    const draftPages = pages.filter(p => p.status === 'draft').length;
    const totalViews = pages.reduce((sum, p) => sum + p.views, 0);
    const totalMenuItems = menuItems.length;
    const activeMenuItems = menuItems.filter(m => m.status === 'active').length;
    const totalMediaFiles = mediaFiles.length;
    const totalMediaSize = mediaFiles.reduce((sum, f) => {
      const size = parseFloat(f.size.replace(' MB', '').replace(' KB', ''));
      return sum + (f.size.includes('MB') ? size : size / 1024);
    }, 0);
    
    return {
      totalPages,
      publishedPages,
      draftPages,
      totalViews,
      totalMenuItems,
      activeMenuItems,
      totalMediaFiles,
      totalMediaSize: `${totalMediaSize.toFixed(1)} MB`
    };
  }, []);

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

  const handleToggle = (id: number) => {
    console.log('Toggle item:', id);
    // TODO: Implement toggle functionality
  };

  const handleDuplicate = (id: number) => {
    console.log('Duplicate item:', id);
    // TODO: Implement duplicate functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Content Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage pages, menus, and media files</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Globe className="w-4 h-4" />
            <span>Preview Site</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Page</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pages"
          value={stats.totalPages}
          change={`${stats.publishedPages} published`}
          icon={FileText}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          change="+12% this month"
          icon={Eye}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Menu Items"
          value={stats.activeMenuItems}
          change={`${stats.totalMenuItems} total`}
          icon={Menu}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Media Storage"
          value={stats.totalMediaSize}
          change={`${stats.totalMediaFiles} files`}
          icon={Image}
          color="bg-orange-100 text-orange-600"
        />
      </div>

      {/* Tabs */}
      <div className="dashboard-card">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6 tab-navigation">
            {[
              { id: 'pages', name: 'Pages', count: pages.length },
              { id: 'menus', name: 'Menus', count: menuItems.length },
              { id: 'media', name: 'Media', count: mediaFiles.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Pages Tab */}
          {activeTab === 'pages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Website Pages</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New Page</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {pages.map((page) => (
                  <PageCard
                    key={page.id}
                    page={page}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    onDuplicate={handleDuplicate}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Menus Tab */}
          {activeTab === 'menus' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Navigation Menu</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New Menu Item</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                    level={item.parentId ? 1 : 0}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Media Library</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Upload Media</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediaFiles.map((file) => (
                  <MediaFileCard
                    key={file.id}
                    file={file}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
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
