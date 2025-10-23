'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Save,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCrudOperations } from '@/hooks/useAdminData';
// Removed static categories import - now using dynamic data from API
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  childCategory?: string;
  category_id?: number;
  subcategory_id?: number;
  child_category_id?: number;
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

export default function EditProductPage() {
  const params = useParams();
  
  // State for categories, subcategories, and child categories
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [childCategories, setChildCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const productId = params.id;
  
  const [formData, setFormData] = useState<Product>({
    id: 0,
    name: '',
    brand: '',
    category: 'Hair Care',
    subcategory: '',
    childCategory: '',
    category_id: undefined,
    subcategory_id: undefined,
    child_category_id: undefined,
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
  const [loading, setLoading] = useState(true);
  const [availableSubcategories, setAvailableSubcategories] = useState<{id: string; name: string; slug: string}[]>([]);
  const [availableChildCategories, setAvailableChildCategories] = useState<{id: string; name: string; slug: string}[]>([]);
  const [availableCategories, setAvailableCategories] = useState<{id: number; name: string; slug: string; level: number; parentId?: number}[]>([]);
  
  // Fetch categories and subcategories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        
        // Fetch main categories
        const categoriesResponse = await fetch('/api/admin/categories?level=1');
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesData.success) {
          setCategories(categoriesData.data);
          setAvailableCategories(categoriesData.data);
        }
        
        // Fetch subcategories for the first category if available
        if (categoriesData.data && categoriesData.data.length > 0) {
          const firstCategoryId = categoriesData.data[0].id;
          const subcategoriesResponse = await fetch(`/api/admin/categories?level=2&parentId=${firstCategoryId}`);
          const subcategoriesData = await subcategoriesResponse.json();
          
          if (subcategoriesData.success) {
            setSubcategories(subcategoriesData.data);
            setAvailableSubcategories(subcategoriesData.data);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  const handleCategoryChange = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/admin/categories?level=2&parentId=${categoryId}`);
      const data = await response.json();
      
      if (data.success) {
        setSubcategories(data.data);
        setAvailableSubcategories(data.data);
        // Clear child categories when category changes
        setChildCategories([]);
        setAvailableChildCategories([]);
        setFormData(prev => ({ ...prev, subcategory: '', childCategory: '', subcategory_id: undefined, child_category_id: undefined }));
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  // Fetch child categories when subcategory changes
  const handleSubcategoryChange = async (subcategoryId: string) => {
    try {
      const response = await fetch(`/api/admin/categories?level=2&parentId=${subcategoryId}`);
      const data = await response.json();
      
      if (data.success) {
        setChildCategories(data.data);
        setAvailableChildCategories(data.data);
        // Clear child category selection when subcategory changes
        setFormData(prev => ({ ...prev, childCategory: '', child_category_id: undefined }));
      }
    } catch (error) {
      console.error('Error fetching child categories:', error);
    }
  };

  // Handle category name change
  const handleCategoryNameChange = async (categoryName: string) => {
    const selectedCategory = availableCategories.find(cat => cat.name === categoryName);
    setFormData(prev => ({ 
      ...prev, 
      category: categoryName, 
      subcategory: '', 
      childCategory: '',
      category_id: selectedCategory?.id,
      subcategory_id: undefined,
      child_category_id: undefined
    }));
    
    if (selectedCategory) {
      await handleCategoryChange(selectedCategory.id.toString());
    }
  };

  // Handle subcategory name change
  const handleSubcategoryNameChange = async (subcategoryName: string) => {
    const selectedSubcategory = availableSubcategories.find(sub => sub.name === subcategoryName);
    setFormData(prev => ({ 
      ...prev, 
      subcategory: subcategoryName, 
      childCategory: '',
      subcategory_id: selectedSubcategory?.id ? parseInt(selectedSubcategory.id) : undefined,
      child_category_id: undefined
    }));
    
    if (selectedSubcategory) {
      await handleSubcategoryChange(selectedSubcategory.id);
    }
  };

  // Handle child category name change
  const handleChildCategoryNameChange = (childCategoryName: string) => {
    const selectedChildCategory = availableChildCategories.find(child => child.name === childCategoryName);
    setFormData(prev => ({ 
      ...prev, 
      childCategory: childCategoryName,
      child_category_id: selectedChildCategory?.id ? parseInt(selectedChildCategory.id) : undefined
    }));
  };
  
  // Image management state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const { update, loading: crudLoading } = useCrudOperations<Product>(
    '/api/admin/products',
    () => {
      // Reset form after successful update
      setFormErrors({});
      setIsSubmitting(false);
      // Navigate back to products list
      window.location.href = '/admin/products';
    },
    (error) => {
      console.error('Failed to update product:', error);
      setIsSubmitting(false);
    }
  );

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products/${productId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          // Transform the API data to match form structure
          const transformedData = {
            ...result.data,
            category: result.data.categories?.name || result.data.category || '',
            subcategory: result.data.subcategories?.name || result.data.subcategory || '',
            childCategory: result.data.child_categories?.name || result.data.childCategory || '',
            category_id: result.data.category_id,
            subcategory_id: result.data.subcategory_id,
            child_category_id: result.data.child_category_id,
            originalPrice: result.data.original_price || result.data.originalPrice,
            isBestSeller: result.data.is_best_seller || result.data.isBestSeller || false,
            isOnSale: result.data.is_on_sale || result.data.isOnSale || false,
            createdAt: result.data.created_at || result.data.createdAt,
            updatedAt: result.data.updated_at || result.data.updatedAt
          };
          setFormData(transformedData);
          
          // If we have a category, fetch its subcategories
          if (transformedData.category_id) {
            await handleCategoryChange(transformedData.category_id.toString());
            
            // If we have a subcategory, fetch its child categories
            if (transformedData.subcategory_id) {
              await handleSubcategoryChange(transformedData.subcategory_id.toString());
            }
          }
        } else {
          console.error('Failed to load product:', result.error);
          // Fallback to mock data if API fails
          const mockProduct: Product = {
            id: Number(productId),
            name: 'Hair Mask',
            brand: 'L\'Oréal',
            category: 'Hair Care',
            price: 25.99,
            originalPrice: 35.99,
            stock: 150,
            status: 'active',
            rating: 4.5,
            reviews: 128,
            image: '/api/placeholder/300/300',
            isBestSeller: true,
            isOnSale: true,
            description: 'Professional hair mask for deep conditioning and repair.',
            createdAt: new Date(),
            updatedAt: new Date()
          };
          setFormData(mockProduct);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to load product:', error);
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

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

  // Image handling functions
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
    );
    
    if (validFiles.length !== files.length) {
      alert('Some files were skipped. Please select only image files under 10MB.');
    }
    
    setSelectedImages(prev => [...prev, ...validFiles]);
    
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
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
    );
    
    if (validFiles.length !== files.length) {
      alert('Some files were skipped. Please select only image files under 10MB.');
    }
    
    setSelectedImages(prev => [...prev, ...validFiles]);
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllImages = () => {
    setSelectedImages([]);
    setImagePreviews([]);
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

      const updatedProduct = {
        ...formData,
        // Use uploaded images if available, otherwise keep existing image
        image: imageUrls.length > 0 ? imageUrls[0] : formData.image,
        images: imageUrls.length > 0 ? imageUrls : [formData.image],
        // Ensure we send the correct category IDs
        category_id: formData.category_id,
        subcategory_id: formData.subcategory_id,
        child_category_id: formData.child_category_id
      };
      
      // Update product with new image data

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Product updated successfully!');
        // Success - redirect to products list
        window.location.href = '/admin/products';
      } else {
        console.error('Failed to update product:', result.error);
        alert(`Failed to update product: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to update product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Form Card */}
      <div className="analytics-card p-0">
        {/* Card Header */}
        <div className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin/products"
                className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Products
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Product</h1>
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
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              </Button>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="px-6 py-6">
          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleUpdateField('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cosmt-primary focus:border-transparent ${
                    formErrors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  }`}
                  placeholder="Enter product name"
                  required
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleUpdateField('brand', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cosmt-primary focus:border-transparent ${
                    formErrors.brand ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  }`}
                  placeholder="Enter brand name"
                  required
                />
                {formErrors.brand && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.brand}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleCategoryNameChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cosmt-primary focus:border-transparent ${
                    formErrors.category ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  }`}
                  required
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
                  <p className="text-xs text-red-500 mt-1">{formErrors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subcategory
                </label>
                <select
                  value={formData.subcategory || ''}
                  onChange={(e) => handleSubcategoryNameChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cosmt-primary focus:border-transparent"
                  disabled={availableSubcategories.length === 0}
                >
                  <option value="">Select a subcategory (optional)</option>
                  {availableSubcategories.length > 0 ? (
                    availableSubcategories.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.name}>
                        {subcategory.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {formData.category ? 'No subcategories available' : 'Select a category first'}
                    </option>
                  )}
                </select>
                {availableSubcategories.length === 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    No subcategories available for this category
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Child Category
                </label>
                <select
                  value={formData.childCategory || ''}
                  onChange={(e) => handleChildCategoryNameChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cosmt-primary focus:border-transparent"
                  disabled={availableChildCategories.length === 0}
                >
                  <option value="">Select a child category (optional)</option>
                  {availableChildCategories.length > 0 ? (
                    availableChildCategories.map((childCategory) => (
                      <option key={childCategory.id} value={childCategory.name}>
                        {childCategory.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {formData.subcategory ? 'No child categories available' : 'Select a subcategory first'}
                    </option>
                  )}
                </select>
                {availableChildCategories.length === 0 && formData.subcategory && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    No child categories available for this subcategory
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleUpdateField('status', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cosmt-primary focus:border-transparent"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleUpdateField('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cosmt-primary focus:border-transparent resize-none"
                placeholder="Enter detailed product description..."
              />
            </div>
            </div>

            {/* Pricing & Inventory */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Pricing & Inventory</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleUpdateField('price', parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cosmt-primary focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Original Price ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.originalPrice || ''}
                    onChange={(e) => handleUpdateField('originalPrice', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full pl-7 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cosmt-primary focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Leave empty if not on sale</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleUpdateField('stock', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cosmt-primary focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>

            {/* Product Features */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Product Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">Best Seller</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Mark as a best-selling product</p>
                    </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => handleUpdateField('isBestSeller', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cosmt-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:!bg-cosmt-primary"></div>
                  </label>
                </div>
                
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">On Sale</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Mark as a discounted product</p>
                    </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isOnSale}
                      onChange={(e) => handleUpdateField('isOnSale', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cosmt-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:!bg-cosmt-primary"></div>
                  </label>
                </div>
              </div>
              
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Initial Rating
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => handleUpdateField('rating', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cosmt-primary focus:border-transparent"
                      placeholder="0.0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Initial Reviews Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.reviews}
                      onChange={(e) => handleUpdateField('reviews', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cosmt-primary focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Product Images</h4>
              
              {/* Current Image Display */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                    <img
                      src={formData.image || '/api/placeholder/300/300'}
                      alt="Current product image"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/300/300';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Current product image</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Upload new images below to replace</p>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload New Images
                </label>
              
              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
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
                      ? 'border-cosmt-primary bg-cosmt-primary/5'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer block"
                >
                  <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </label>
              </div>

              {/* Clear All Button */}
              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={clearAllImages}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear all images
                  </button>
                </div>
              )}

                {/* Image URL Fallback */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Or enter image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleUpdateField('image', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cosmt-primary focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enter a valid image URL as fallback
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
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
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          </Button>
        </div>
      </div>
    </div>
  );
}
