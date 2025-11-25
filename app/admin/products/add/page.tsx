'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  ArrowLeft,
  Save,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCrudOperations } from '@/hooks/useAdminData';
// Removed static categories import - now using dynamic data from API
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  childCategory?: string;
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
  // Enhanced fields
  sku?: string;
  tags?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  lowStockThreshold?: number;
  manageStock?: boolean;
  enableVariants?: boolean;
  variants?: ProductVariant[];
  images?: string[];
  relatedProducts?: number[];
}

interface ProductVariant {
  id: string;
  name: string;
  options: Record<string, string>;
  price: number;
  sku: string;
  stock: number;
  image?: string;
}

export default function AddProductPage() {
  // State for categories and subcategories
  const [categories, setCategories] = useState<{id: number; name: string; slug: string; level?: number; parentId?: number}[]>([]);
  const [subcategories, setSubcategories] = useState<{id: number; name: string; slug: string}[]>([]);
  const [allChildCategories, setAllChildCategories] = useState<{id: number; name: string; slug: string}[]>([]);

  const [formData, setFormData] = useState<Product>({
    id: 0,
    name: '',
    brand: '',
    category: 'Hair Care',
    subcategory: '',
    childCategory: '',
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
    updatedAt: new Date(),
    // Enhanced fields
    sku: '',
    tags: [],
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    lowStockThreshold: 10,
    manageStock: true,
    enableVariants: false,
    variants: [],
    images: [],
    relatedProducts: []
  });

  // Image upload states
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories and subcategories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch main categories
        const categoriesResponse = await fetch('/api/admin/categories?level=1');
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
        
        // Fetch ALL child categories (level 2) independently
        const allSubcategoriesResponse = await fetch('/api/admin/categories?level=2');
        const allSubcategoriesData = await allSubcategoriesResponse.json();
        
        if (allSubcategoriesData.success) {
          setAllChildCategories(allSubcategoriesData.data);
          // Also set as subcategories for backward compatibility
          setSubcategories(allSubcategoriesData.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const [activeTab, setActiveTab] = useState('basic');
  const [variantOptions, setVariantOptions] = useState<Record<string, string[]>>({
    color: [],
    size: [],
    finish: []
  });
  const [newTag, setNewTag] = useState('');
  const [availableChildCategories, setAvailableChildCategories] = useState<{id: number; name: string; slug: string}[]>([]);
  const [availableCategories, setAvailableCategories] = useState<{id: number; name: string; slug: string; level: number; parentId?: number}[]>([]);

  // Update available categories when categories state changes
  useEffect(() => {
    setAvailableCategories(categories);
  }, [categories]);

  // Set available child categories separately (Level 2 from all sources)
  useEffect(() => {
    if (allChildCategories.length > 0) {
      // Use all child categories (level 2) for the child categories dropdown
      setAvailableChildCategories(allChildCategories);
    } else if (subcategories.length > 0) {
      // Fallback to loaded subcategories
      setAvailableChildCategories(subcategories);
    }
  }, [allChildCategories, subcategories]);

  // For subcategories dropdown, we'll fetch level 3+ categories
  // This will be set when a child category is selected
  const [level3Categories, setLevel3Categories] = useState<{id: number; name: string; slug: string}[]>([]);

  // Handle category change and fetch subcategories
  const handleCategoryNameChange = async (categoryName: string) => {
    setFormData(prev => ({ ...prev, category: categoryName, subcategory: '' }));
    
    // Find the selected category to get its ID
    const selectedCategory = availableCategories.find(cat => cat.name === categoryName);
    if (selectedCategory) {
      try {
        const response = await fetch(`/api/admin/categories?level=2&parentId=${selectedCategory.id}`);
        const data = await response.json();
        
        if (data.success) {
          setSubcategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    }
  };

  // Image upload handlers
  const handleImageSelect = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== fileArray.length) {
      alert('Some files were skipped. Please ensure all files are PNG, JPG, or GIF and under 10MB.');
    }

    setSelectedImages(prev => [...prev, ...validFiles]);
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleImageSelect(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const { create, loading: crudLoading } = useCrudOperations<Product>(
    '/api/admin/products',
    () => {
      console.log('Product created successfully!');
      alert('Product saved successfully!');
      // Reset form after successful creation
      setFormData({
        id: 0,
        name: '',
        brand: '',
        category: 'Hair Care',
        subcategory: '',
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
      setSelectedImages([]);
      setImagePreviews([]);
      setIsSubmitting(false);
    },
    (error) => {
      console.error('Failed to create product:', error);
      alert(`Failed to save product: ${error}`);
      setIsSubmitting(false);
    }
  );

  // Form validation function
  const validateForm = (product: Product, uploadedImages: File[] = []): Record<string, string> => {
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

    // Check if there's either a valid image URL OR uploaded images
    const hasValidImageUrl = product.image && isValidUrl(product.image);
    const hasUploadedImages = uploadedImages.length > 0;
    
    if (!hasValidImageUrl && !hasUploadedImages) {
      errors.image = 'Please either upload images or provide a valid image URL';
    } else if (product.image && !isValidUrl(product.image)) {
      errors.image = 'Please enter a valid image URL';
    }

    return errors;
  };

  // URL validation helper
  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleUpdateField = (field: keyof Product, value: unknown) => {
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

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleAddVariantOption = (optionType: string, value: string) => {
    if (value.trim() && !variantOptions[optionType].includes(value.trim())) {
      setVariantOptions(prev => ({
        ...prev,
        [optionType]: [...prev[optionType], value.trim()]
      }));
    }
  };

  const handleRemoveVariantOption = (optionType: string, value: string) => {
    setVariantOptions(prev => ({
      ...prev,
      [optionType]: prev[optionType].filter(v => v !== value)
    }));
  };

  const generateVariants = () => {
    const options = Object.entries(variantOptions).filter(([, values]) => values.length > 0);
    if (options.length === 0) return [];

    const combinations: ProductVariant[] = [];
    
    const generateCombinations = (current: Record<string, string>, remaining: [string, string[]][]) => {
      if (remaining.length === 0) {
        const name = Object.values(current).join(' / ');
        combinations.push({
          id: Math.random().toString(36).substr(2, 9),
          name,
          options: { ...current },
          price: formData.price,
          sku: `${formData.sku || 'SKU'}-${Object.values(current).join('-').toUpperCase()}`,
          stock: formData.stock,
          image: formData.image
        });
        return;
      }

      const [optionType, values] = remaining[0];
      values.forEach(value => {
        generateCombinations({ ...current, [optionType]: value }, remaining.slice(1));
      });
    };

    generateCombinations({}, options);
    return combinations;
  };

  const handleSave = async () => {
    // Validate form
    const errors = validateForm(formData, selectedImages);
    setFormErrors(errors);
    
    // If there are validation errors, don't proceed
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
      alert('Please fix the validation errors before saving.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert uploaded images to base64 strings for storage
      const imageUrls = await Promise.all(
        selectedImages.map(async (file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result as string;
              resolve(result);
            };
            reader.readAsDataURL(file);
          });
        })
      );

      const newProduct = {
        ...formData,
        id: Date.now(), // Generate a temporary ID for mock data
        createdAt: new Date(),
        updatedAt: new Date(),
        variants: formData.enableVariants ? generateVariants() : [],
        images: imageUrls.length > 0 ? imageUrls : [formData.image], // Use uploaded images or fallback to placeholder
        image: imageUrls.length > 0 ? imageUrls[0] : formData.image // Set first uploaded image as main image
      };
      
      await create(newProduct);
      
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Card Container */}
      <div className="analytics-card p-0">
        {/* Header */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link 
                href="/admin/products"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Products
              </Link>
              <div className="h-5 w-px bg-gray-300"></div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Product</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => window.history.back()}
                className="px-3 py-1.5"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleSave} 
                className="px-3 py-1.5 flex items-center space-x-1"
                disabled={crudLoading || isSubmitting}
              >
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Product</span>
                </>
              </Button>
            </div>
          </div>
        </div>

        {/* Validation Errors Summary */}
        {Object.keys(formErrors).length > 0 && (
          <div className="px-6 py-4 bg-red-50 border-l-4 border-red-400">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Please fix the following errors:
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {Object.entries(formErrors).map(([field, error]) => (
                      <li key={field}>
                        <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-4 py-0">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-scroll hide-scrollbar space-x-6 tab-navigation">
              {[
                { id: 'basic', label: 'Basic Information' },
                { id: 'pricing', label: 'Pricing & Inventory' },
                { id: 'variants', label: 'Product Variants' },
                { id: 'media', label: 'Media & Images' },
                { id: 'seo', label: 'SEO & Marketing' },
                { id: 'shipping', label: 'Shipping & Dimensions' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 font-medium text-sm transition-colors duration-200 rounded-none whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-[#00514B]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  style={{ borderRadius: '0' }}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-4">
          {activeTab === 'basic' && (
            <div className="space-y-4">
              {/* Basic Information Tab */}
              <h3 className="text-base font-semibold text-gray-900 mb-3">Basic Information</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleUpdateField('name', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-text ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter product name"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleUpdateField('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-text resize-none"
                    placeholder="Enter product description"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleCategoryNameChange(e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer ${
                      formErrors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {availableCategories.length > 0 ? (
                      availableCategories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Loading categories...</option>
                    )}
                  </select>
                  {formErrors.category && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {formErrors.category}
                    </p>
                  )}
                </div>

                {/* Child Category Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Child Category (Level 2) <span className="text-xs text-gray-500">e.g. Perfume and Deodorant, Solar Products</span>
                  </label>
                  <select
                    value={formData.childCategory || ''}
                    onChange={(e) => {
                      handleUpdateField('childCategory', e.target.value);
                      // Fetch level 3 categories when a child category is selected
                      const selectedChildCat = availableChildCategories.find(c => c.name === e.target.value);
                      if (selectedChildCat) {
                        fetch(`/api/admin/categories?level=3&parentId=${selectedChildCat.id}`)
                          .then(res => res.json())
                          .then(data => {
                            if (data.success) {
                              setLevel3Categories(data.data);
                            }
                          })
                          .catch(err => console.error('Error fetching level 3 categories:', err));
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer"
                    disabled={availableChildCategories.length === 0}
                  >
                    <option value="">Select a child category (optional)</option>
                    {availableChildCategories.length > 0 ? (
                      availableChildCategories.map((childCat) => (
                        <option key={childCat.id} value={childCat.name}>
                          {childCat.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Loading child categories...</option>
                    )}
                  </select>
                  {availableChildCategories.length === 0 && (
                    <p className="mt-1 text-xs text-blue-600">
                      No child categories available or loading...
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand *
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => handleUpdateField('brand', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-text ${
                      formErrors.brand ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter brand name"
                  />
                  {formErrors.brand && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {formErrors.brand}
                    </p>
                  )}
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku || ''}
                    onChange={(e) => handleUpdateField('sku', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-text"
                    placeholder="Enter SKU"
                  />
                </div>

                {/* Subcategories Dropdown (Level 3+) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory (Level 3+) <span className="text-xs text-gray-500">e.g. Perfume, Deodorant, Sunscreen</span>
                  </label>
                  <select
                    value={formData.subcategory || ''}
                    onChange={(e) => handleUpdateField('subcategory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer"
                    disabled={level3Categories.length === 0}
                  >
                    <option value="">Select a subcategory (optional)</option>
                    {level3Categories.length > 0 ? (
                      level3Categories.map((subcat) => (
                        <option key={subcat.id} value={subcat.name}>
                          {subcat.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        {formData.childCategory ? 'No subcategories available for this child category' : 'Select a child category first'}
                      </option>
                    )}
                  </select>
                  {!formData.childCategory && level3Categories.length === 0 && (
                    <p className="mt-1 text-xs text-amber-600">
                      Please select a child category first to see subcategories
                    </p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-text"
                      placeholder="Add tags"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleAddTag}
                      className="px-4 py-2"
                    >
                      Add
                    </Button>
                  </div>
                  {formData.tags && formData.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cosmt-primary-light text-cosmt-primary"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-cosmt-primary hover:text-cosmt-primary-dark"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-4">
              {/* Pricing & Inventory Tab */}
              <h3 className="text-base font-semibold text-gray-900 mb-3">Pricing & Inventory</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleUpdateField('price', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-text ${
                      formErrors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {formErrors.price}
                    </p>
                  )}
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice || ''}
                    onChange={(e) => handleUpdateField('originalPrice', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-text"
                    placeholder="0.00"
                  />
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleUpdateField('stock', parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-text ${
                      formErrors.stock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {formErrors.stock && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {formErrors.stock}
                    </p>
                  )}
                </div>

                {/* Low Stock Threshold */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={formData.lowStockThreshold || 10}
                    onChange={(e) => handleUpdateField('lowStockThreshold', parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-text"
                    placeholder="10"
                  />
                </div>

                {/* Manage Stock Toggle */}
                <div className="lg:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="manageStock"
                      checked={formData.manageStock || false}
                      onChange={(e) => handleUpdateField('manageStock', e.target.checked)}
                      className="h-4 w-4 text-cosmt-primary focus:ring-cosmt-primary border-gray-300 rounded"
                    />
                    <label htmlFor="manageStock" className="ml-2 block text-sm text-gray-700">
                      Manage stock for this product
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'variants' && (
            <div className="space-y-4">
              {/* Product Variants Tab */}
              <h3 className="text-base font-semibold text-gray-900 mb-3">Product Variants</h3>
              
              <div className="space-y-4">
                {/* Enable Variants Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableVariants"
                    checked={formData.enableVariants || false}
                    onChange={(e) => handleUpdateField('enableVariants', e.target.checked)}
                    className="h-4 w-4 text-cosmt-primary focus:ring-cosmt-primary border-gray-300 rounded"
                  />
                  <label htmlFor="enableVariants" className="ml-2 block text-sm text-gray-700">
                    Enable product variants (different colors, sizes, etc.)
                  </label>
                </div>

                {formData.enableVariants && (
                  <div className="space-y-4">
                    {/* Variant Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {Object.entries(variantOptions).map(([optionType, values]) => (
                        <div key={optionType} className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700 capitalize">
                            {optionType} Options
                          </label>
                          <div className="space-y-2">
                            {values.map((value, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                                <span className="text-sm text-gray-700">{value}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariantOption(optionType, value)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                placeholder={`Add ${optionType}`}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-text"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddVariantOption(optionType, e.currentTarget.value);
                                    e.currentTarget.value = '';
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  const input = document.querySelector(`input[placeholder="Add ${optionType}"]`) as HTMLInputElement;
                                  if (input) {
                                    handleAddVariantOption(optionType, input.value);
                                    input.value = '';
                                  }
                                }}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Generated Variants Preview */}
                    {generateVariants().length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-3">
                          Generated Variants ({generateVariants().length})
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Variant</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {generateVariants().map((variant) => (
                                <tr key={variant.id}>
                                  <td className="px-3 py-2 text-sm text-gray-900">{variant.name}</td>
                                  <td className="px-3 py-2 text-sm text-gray-900">${variant.price.toFixed(2)}</td>
                                  <td className="px-3 py-2 text-sm text-gray-900 font-mono">{variant.sku}</td>
                                  <td className="px-3 py-2 text-sm text-gray-900">{variant.stock}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4">
              {/* SEO & Marketing Tab */}
              <h3 className="text-base font-semibold text-gray-900 mb-3">SEO & Marketing</h3>
              
              <div className="space-y-4">
                {/* Meta Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle || ''}
                    onChange={(e) => handleUpdateField('metaTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-text"
                    placeholder="Enter meta title for SEO"
                    maxLength={60}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.metaTitle?.length || 0}/60 characters
                  </p>
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.metaDescription || ''}
                    onChange={(e) => handleUpdateField('metaDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-text"
                    placeholder="Enter meta description for SEO"
                    maxLength={160}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.metaDescription?.length || 0}/160 characters
                  </p>
                </div>

                {/* Meta Keywords */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    value={formData.metaKeywords || ''}
                    onChange={(e) => handleUpdateField('metaKeywords', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-text"
                    placeholder="Enter keywords separated by commas"
                  />
                </div>

                {/* Product Flags */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Product Flags</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isBestSeller"
                        checked={formData.isBestSeller}
                        onChange={(e) => handleUpdateField('isBestSeller', e.target.checked)}
                        className="h-4 w-4 text-cosmt-primary focus:ring-cosmt-primary border-gray-300 rounded"
                      />
                      <label htmlFor="isBestSeller" className="ml-2 block text-sm text-gray-700">
                        Best Seller
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isOnSale"
                        checked={formData.isOnSale}
                        onChange={(e) => handleUpdateField('isOnSale', e.target.checked)}
                        className="h-4 w-4 text-cosmt-primary focus:ring-cosmt-primary border-gray-300 rounded"
                      />
                      <label htmlFor="isOnSale" className="ml-2 block text-sm text-gray-700">
                        On Sale
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              {/* Shipping & Dimensions Tab */}
              <h3 className="text-base font-semibold text-gray-900 mb-3">Shipping & Dimensions</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight || ''}
                    onChange={(e) => handleUpdateField('weight', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-text"
                    placeholder="0.0"
                  />
                </div>

                {/* Dimensions */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Dimensions (cm)
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Length</label>
                      <input
                        type="number"
                        value={formData.dimensions?.length || ''}
                        onChange={(e) => handleUpdateField('dimensions', {
                          ...formData.dimensions,
                          length: parseFloat(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-text"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Width</label>
                      <input
                        type="number"
                        value={formData.dimensions?.width || ''}
                        onChange={(e) => handleUpdateField('dimensions', {
                          ...formData.dimensions,
                          width: parseFloat(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-text"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Height</label>
                      <input
                        type="number"
                        value={formData.dimensions?.height || ''}
                        onChange={(e) => handleUpdateField('dimensions', {
                          ...formData.dimensions,
                          height: parseFloat(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-text"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-4">
              {/* Media & Images Tab */}
              <h3 className="text-base font-semibold text-gray-900 mb-3">Media & Images</h3>
              
              <div className="space-y-4">
                {/* Main Product Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Product Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Image
                        src={formData.image || '/api/placeholder/300/300'}
                        alt="Product"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => handleUpdateField('image', e.target.value)}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-text ${
                          formErrors.image ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter image URL"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Enter a valid image URL (or upload images above)
                      </p>
                      {formErrors.image && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          {formErrors.image}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Images *
                  </label>
                  <p className="text-xs text-gray-500 mb-4">
                    Upload product images or provide a valid image URL below
                  </p>
                  
                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            width={96}
                            height={96}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Area */}
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragOver 
                        ? 'border-[#00514B] bg-[#00514B]/5' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/jpg,image/gif"
                      onChange={(e) => handleImageSelect(e.target.files)}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="space-y-2">
                        <div className="text-gray-500">
                          <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-[#00514B]">Click to upload</span> or drag and drop
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                        {selectedImages.length > 0 && (
                          <p className="text-xs text-green-600">
                            {selectedImages.length} image(s) selected
                          </p>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}