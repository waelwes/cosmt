'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { generateProductUrl } from '@/utils/slug';
import { Product } from '@/lib/types/Product';
import { Category, Subcategory } from '@/lib/types/Category';

interface ProductDetailPageProps {
  product: Product;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  subcategory?: {
    id: number;
    name: string;
    slug: string;
  };
}

export function ProductDetailPage({ product, category, subcategory }: ProductDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Build a safe image list: remove empty strings/nulls and always provide a placeholder
  const placeholderMain = '/images/product-placeholder.jpg';
  const rawImages = Array.isArray(product.images) ? product.images : [];
  const primaryImage = typeof product.image === 'string' && product.image.trim().length > 0 ? product.image : null;
  const images = [...rawImages, primaryImage].filter((src) => typeof src === 'string' && src.trim().length > 0);
  const safeCurrentImage = images[selectedImage] && images[selectedImage].trim().length > 0 ? images[selectedImage] : placeholderMain;
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/categories' },
    { label: category?.name || product.categories?.name || 'Category', href: `/categories/${category?.slug || product.categories?.slug || 'category'}` },
    { label: subcategory?.name || product.subcategories?.name || 'Subcategory', href: `/categories/${category?.slug || product.categories?.slug || 'category'}/${subcategory?.slug || product.subcategories?.slug || 'subcategory'}` },
    { label: product.name, href: '#' },
  ];

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'how-to-use', label: 'How to Use' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="min-h-screen" style={{backgroundColor: '#fbfbfb'}}>
      {/* Breadcrumbs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="cosmt-container py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                {crumb.href === '#' ? (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-green-600 transition-colors duration-200">
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="cosmt-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <Image
                src={safeCurrentImage}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index ? 'border-green-500 shadow-md' : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <Image
                      src={(typeof image === 'string' && image.trim().length > 0) ? image : '/images/product-placeholder.jpg'}
                      alt={`${product.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              {product.brand && (
                <p className="text-lg text-gray-600">by {product.brand}</p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-green-600">
                ${product.price.toFixed(2)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-2xl text-gray-500 line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
              {product.is_on_sale && (
                <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                  Sale
                </span>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <label className="text-lg font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x border-gray-300 text-lg font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-lg py-3 px-6 rounded-lg font-semibold transition-colors duration-200">
                  Add to Cart
                </Button>
                <Button variant="outline" className="px-6 py-3 border-gray-300 hover:bg-gray-50 transition-colors duration-200">
                  ♡
                </Button>
                <Button variant="outline" className="px-6 py-3 border-gray-300 hover:bg-gray-50 transition-colors duration-200">
                  Share
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="text-lg">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-600 font-medium">✗ Out of Stock</span>
              )}
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="px-6 py-8">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {product.description || 'No description available.'}
                  </p>
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Ingredients information will be displayed here.
                  </p>
                </div>
              )}

              {activeTab === 'how-to-use' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    How to use instructions will be displayed here.
                  </p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Customer reviews will be displayed here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;