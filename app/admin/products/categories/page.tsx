'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Layers,
  Star,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Folder,
  Loader2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ServiceContainer } from '@/lib/di/ServiceContainer';
import { ICategoryService } from '@/lib/factories/interfaces/ICategoryService';
import { CategoryWithSubcategories } from '@/lib/types/Category';

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [showViewModal, setShowViewModal] = useState<CategoryWithSubcategories | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    sort_order: 0,
    is_active: true,
    meta_title: '',
    meta_description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Admin: Fetching categories from database...');
        
        // Get category service from container - uses real Supabase data
        const categoryService: ICategoryService = ServiceContainer
          .getInstance()
          .getServiceFactory()
          .createCategoryService();
        
        const data = await categoryService.getCategoriesWithSubcategories();
        console.log('🔍 Admin: Categories fetched:', data);
        setCategories(data);
      } catch (err) {
        console.error('❌ Admin: Error fetching categories:', err);
        setError('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || (selectedStatus === 'active' ? category.is_active : !category.is_active);
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  // Action handlers
  const handleView = (category: CategoryWithSubcategories) => {
    setShowViewModal(category);
  };

  const handleEdit = (category: CategoryWithSubcategories) => {
    // Navigate to edit page or open edit modal
    console.log('Edit category:', category);
    alert(`Edit functionality for "${category.name}" - To be implemented`);
  };

  const handleDelete = (categoryId: number) => {
    setShowDeleteModal(categoryId);
  };

  const confirmDelete = async (categoryId: number) => {
    try {
      console.log('Deleting category:', categoryId);
      // TODO: Implement actual delete functionality
      alert(`Delete functionality for category ID ${categoryId} - To be implemented`);
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleAddCategory = () => {
    setNewCategory({
      name: '',
      slug: '',
      description: '',
      image: '',
      sort_order: 0,
      is_active: true,
      meta_title: '',
      meta_description: ''
    });
    setShowAddModal(true);
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Get category service from container
      const categoryService: ICategoryService = ServiceContainer
        .getInstance()
        .getServiceFactory()
        .createCategoryService();

      // Create the category with proper data structure
      const categoryData = {
        name: newCategory.name.trim(),
        slug: newCategory.slug.trim() || newCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: newCategory.description.trim() || null,
        image: newCategory.image.trim() || null,
        sort_order: newCategory.sort_order,
        is_active: newCategory.is_active,
        meta_title: newCategory.meta_title.trim() || null,
        meta_description: newCategory.meta_description.trim() || null
      };

      console.log('Creating category:', categoryData);
      
      // For now, we'll simulate the creation since we need to implement the createCategory method
      // TODO: Implement actual category creation
      alert(`Category "${newCategory.name}" would be created successfully!`);
      
      // Close modal and reset form
      setShowAddModal(false);
      setNewCategory({
        name: '',
        slug: '',
        description: '',
        image: '',
        sort_order: 0,
        is_active: true,
        meta_title: '',
        meta_description: ''
      });
      
      // Refresh categories list
      // await fetchCategories();
      
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setNewCategory(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      // Auto-generate slug when name changes and slug is empty
      if (field === 'name' && typeof value === 'string' && !prev.slug) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      
      return updated;
    });
  };

  const renderCategory = (category: CategoryWithSubcategories) => (
    <div key={category.id} className="mb-4">
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded mb-2 hover:bg-gray-50 dark:hover:bg-gray-700 analytics-card">
        <div className="flex items-center">
          <Folder className="w-5 h-5 mr-3 text-blue-500" />
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {category.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {category.description || 'No description'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {category.subcategories?.length || 0} subcategories
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(category.is_active)}`}>
            {category.is_active ? 'Active' : 'Inactive'}
          </span>
          <div className="flex space-x-1">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => handleView(category)}
              title="View Category"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => handleEdit(category)}
              title="Edit Category"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => handleDelete(category.id)}
              title="Delete Category"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Render subcategories */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="ml-8 space-y-2">
          {category.subcategories.map((subcategory) => (
            <div key={subcategory.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
              <div className="flex items-center">
                <Folder className="w-4 h-4 mr-3 text-gray-400" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {subcategory.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {subcategory.description || 'No description'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subcategory.is_active)}`}>
                  {subcategory.is_active ? 'Active' : 'Inactive'}
                </span>
                <div className="flex space-x-1">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleView({ ...subcategory, subcategories: [] } as CategoryWithSubcategories)}
                    title="View Subcategory"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleEdit({ ...subcategory, subcategories: [] } as CategoryWithSubcategories)}
                    title="Edit Subcategory"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleDelete(subcategory.id)}
                    title="Delete Subcategory"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 categories-page" style={{ backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Product Categories</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Organize your products with categories and subcategories</p>
        </div>
        <Button 
          variant="primary" 
          className="flex items-center"
          onClick={handleAddCategory}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="analytics-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="analytics-card p-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No categories found</h3>
            <p className="text-gray-500 dark:text-gray-400">No categories are available at the moment</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="analytics-card p-12">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Error loading categories</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Categories List */}
      {!loading && !error && (
        <div className="space-y-2">
          {filteredCategories.map((category) => renderCategory(category))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="analytics-card p-12">
            <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No categories found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first category'}
            </p>
            <Button 
              variant="primary"
              onClick={handleAddCategory}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>
      )}

      {/* View Category Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowViewModal(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Category Details</h3>
              <button 
                onClick={() => setShowViewModal(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <p className="text-sm text-gray-900 dark:text-gray-100">{showViewModal.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <p className="text-sm text-gray-900 dark:text-gray-100">{showViewModal.description || 'No description'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(showViewModal.is_active)}`}>
                  {showViewModal.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subcategories</label>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {showViewModal.subcategories?.length || 0} subcategories
                </p>
              </div>
              
              {showViewModal.subcategories && showViewModal.subcategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subcategory List</label>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {showViewModal.subcategories.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <span className="text-sm text-gray-900 dark:text-gray-100">{sub.name}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sub.is_active)}`}>
                          {sub.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDeleteModal(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-600">Delete Category</h3>
              <button 
                onClick={() => setShowDeleteModal(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this category? This action cannot be undone and will also delete all associated subcategories.
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowDeleteModal(null)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={() => confirmDelete(showDeleteModal)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Category
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Category</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitCategory} className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter category name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={newCategory.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="auto-generated-from-name"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from name</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter category description (optional)"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category Image URL
                </label>
                <input
                  type="url"
                  value={newCategory.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com/category-image.jpg"
                />
              </div>
              
              {/* SEO Fields */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">SEO Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={newCategory.meta_title}
                      onChange={(e) => handleInputChange('meta_title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                      placeholder="SEO title for search engines"
                      maxLength={255}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      value={newCategory.meta_description}
                      onChange={(e) => handleInputChange('meta_description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                      placeholder="SEO description for search engines"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
              
              {/* Settings */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={newCategory.sort_order}
                      onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                  </div>
                  
                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newCategory.is_active}
                        onChange={(e) => handleInputChange('is_active', e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Active (visible to customers)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  type="button"
                  variant="secondary" 
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || !newCategory.name.trim()}
                >
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Category
                  </>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}