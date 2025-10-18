'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft,
  Save,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCrudOperations } from '@/hooks/useAdminData';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  status: 'active' | 'inactive';
  rating: number;
  reviews: number;
  image: string;
  isBestSeller: boolean;
  isOnSale: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function AddProductPage() {
  const [formData, setFormData] = useState<Product>({
    id: 0,
    name: '',
    brand: '',
    category: 'Hair Care',
    price: 0,
    originalPrice: null,
    stock: 0,
    status: 'active',
    rating: 0,
    reviews: 0,
    image: '/api/placeholder/300/300',
    isBestSeller: false,
    isOnSale: false,
    description: '',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { create, loading: crudLoading } = useCrudOperations<Product>(
    '/api/admin/products',
    () => {
      // Reset form after successful creation
      setFormData({
        id: 0,
        name: '',
        brand: '',
        category: 'Hair Care',
        price: 0,
        originalPrice: null,
        stock: 0,
        status: 'active',
        rating: 0,
        reviews: 0,
        image: '/api/placeholder/300/300',
        isBestSeller: false,
        isOnSale: false,
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      setFormErrors({});
      setIsSubmitting(false);
    },
    (error) => {
      console.error('Failed to create product:', error);
      setIsSubmitting(false);
    }
  );

  // Form validation function
  const validateForm = (product: Product): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!product.name.trim()) {
      errors.name = 'Product name is required';
    } else if (product.name.trim().length < 2) {
      errors.name = 'Product name must be at least 2 characters';
    }

    if (!product.brand.trim()) {
      errors.brand = 'Brand is required';
    } else if (product.brand.trim().length < 2) {
      errors.brand = 'Brand must be at least 2 characters';
    }

    if (!product.category) {
      errors.category = 'Category is required';
    }

    if (product.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (product.stock < 0) {
      errors.stock = 'Stock cannot be negative';
    }

    if (product.originalPrice && product.originalPrice <= product.price) {
      errors.originalPrice = 'Original price must be greater than current price';
    }

    if (product.rating < 0 || product.rating > 5) {
      errors.rating = 'Rating must be between 0 and 5';
    }

    if (product.reviews < 0) {
      errors.reviews = 'Reviews count cannot be negative';
    }

    if (product.image && !isValidUrl(product.image)) {
      errors.image = 'Please enter a valid image URL';
    }

    return errors;
  };

  // URL validation helper
  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleUpdateField = (field: keyof Product, value: any) => {
    const updatedProduct = { ...formData, [field]: value };
    setFormData(updatedProduct);
    
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    // Validate form
    const errors = validateForm(formData);
    setFormErrors(errors);
    
    // If there are validation errors, don't proceed
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newProduct = {
        ...formData,
        id: Date.now(), // Generate a temporary ID for mock data
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await create(newProduct);
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            href="/admin/products"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Products
          </Link>
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="secondary" 
            onClick={() => window.history.back()}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave} 
            className="px-4 py-2 flex items-center space-x-2"
            disabled={crudLoading || isSubmitting}
          >
            {crudLoading || isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Product</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Horizontal Line */}
      <div className="border-b border-gray-300"></div>

      {/* Form Content */}
      <div className="bg-white rounded-lg border border-gray-300 p-6">
        <div className="space-y-8">
          {/* Basic Information */}
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleUpdateField('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cosmt-primary focus:border-cosmt-primary ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                  required
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleUpdateField('brand', e.target.value)}
                  className={`w-full px-3 py-2 border rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cosmt-primary focus:border-cosmt-primary ${
                    formErrors.brand ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter brand name"
                  required
                />
                {formErrors.brand && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.brand}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleUpdateField('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-cosmt-primary focus:border-cosmt-primary ${
                    formErrors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Hair Care">Hair Care</option>
                  <option value="Skincare">Skincare</option>
                  <option value="Makeup">Makeup</option>
                  <option value="Fragrance">Fragrance</option>
                  <option value="Body Care">Body Care</option>
                  <option value="Natural & Organic">Natural & Organic</option>
                  <option value="Men's Grooming">Men's Grooming</option>
                  <option value="Mom & Baby">Mom & Baby</option>
                  <option value="Supplements">Supplements</option>
                  <option value="Tools & Devices">Tools & Devices</option>
                </select>
                {formErrors.category && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.category}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleUpdateField('status', e.target.value)}
                  className="w-full px-3 py-2 border rounded border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-cosmt-primary focus:border-cosmt-primary"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleUpdateField('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cosmt-primary focus:border-cosmt-primary resize-none"
                placeholder="Enter detailed product description..."
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Pricing & Inventory</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleUpdateField('price', parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 border rounded border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cosmt-primary focus:border-cosmt-primary"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.originalPrice || ''}
                    onChange={(e) => handleUpdateField('originalPrice', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full pl-7 pr-3 py-2 border rounded border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cosmt-primary focus:border-cosmt-primary"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty if not on sale</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleUpdateField('stock', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cosmt-primary focus:border-cosmt-primary"
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Product Features */}
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Product Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <h5 className="font-medium text-gray-900">Best Seller</h5>
                    <p className="text-sm text-gray-500">Mark as a best-selling product</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => handleUpdateField('isBestSeller', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cosmt-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cosmt-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <h5 className="font-medium text-gray-900">On Sale</h5>
                    <p className="text-sm text-gray-500">Mark as a discounted product</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isOnSale}
                      onChange={(e) => handleUpdateField('isOnSale', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cosmt-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cosmt-primary"></div>
                  </label>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Rating
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => handleUpdateField('rating', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cosmt-primary focus:border-cosmt-primary"
                    placeholder="0.0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Reviews Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reviews}
                    onChange={(e) => handleUpdateField('reviews', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cosmt-primary focus:border-cosmt-primary"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Product Image</h4>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                <img
                  src={formData.image}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleUpdateField('image', e.target.value)}
                  className="w-full px-3 py-2 border rounded border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cosmt-primary focus:border-cosmt-primary"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a valid image URL
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>
          <span className="text-red-500">*</span> Required fields
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="secondary" 
            onClick={() => window.history.back()}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave} 
            className="px-4 py-2 flex items-center space-x-2"
            disabled={crudLoading || isSubmitting}
          >
            {crudLoading || isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Product</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
