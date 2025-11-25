'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { generateProductUrl } from '@/utils/slug';
import { Product } from '@/lib/types/Product';
import { Category, Subcategory } from '@/lib/types/Category';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

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
      <Header />
      
      <div className="cosmt-container py-4 sm:py-6 lg:py-8">
        {/* Breadcrumbs - Above product content */}
        <nav className="mb-4 sm:mb-6">
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 overflow-x-auto">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                {crumb.href === '#' ? (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="transition-colors duration-200 hover:[color:#003d38]">
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={safeCurrentImage}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index ? 'shadow-md' : 'border-gray-200'
                    }`}
                    style={selectedImage === index ? { borderColor: '#003d38' } : {}}
                    onMouseEnter={(e) => {
                      if (selectedImage !== index) {
                        e.currentTarget.style.borderColor = '#003d38';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedImage !== index) {
                        e.currentTarget.style.borderColor = '';
                      }
                    }}
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
          <div className="space-y-4 relative">
            {/* Share Button - Top Right */}
            <div className="absolute top-0 right-0 z-10">
              <Button variant="outline" className="p-2 border border-gray-300 hover:bg-gray-50 transition-colors duration-200">
                <Share2 className="w-4 h-4 text-gray-600 hover:text-gray-900" />
              </Button>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{product.name}</h1>
              {product.brand && (
                <p className="text-xs sm:text-sm text-gray-600">by {product.brand}</p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-xl sm:text-2xl font-bold" style={{ color: '#003d38' }}>
                ${product.price.toFixed(2)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-lg text-gray-500 line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
              {product.is_on_sale && (
                <span className="text-white text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: '#003d38' }}>
                  Sale
                </span>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <label className="text-xs sm:text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 border-x border-gray-300 text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-2 sm:space-x-3">
                <Button 
                  className="flex-1 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-semibold transition-colors duration-200"
                  style={{ backgroundColor: '#003d38' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#002a25'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003d38'}
                >
                  Add to Cart
                </Button>
                <Button variant="outline" className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-red-600" />
                </Button>
              </div>
            </div>

            {/* Stock Status - Below Add to Cart */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Stock Status</h3>
              {product.stock > 0 ? (
                <p className="font-medium text-xs sm:text-sm" style={{ color: '#003d38' }}>✓ In Stock ({product.stock} available)</p>
              ) : (
                <p className="text-red-600 font-medium text-xs sm:text-sm">✗ Out of Stock</p>
              )}
            </div>

            {/* Information Card - Below Stock Status */}
            <div className="mt-3 sm:mt-4">
              <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {/* Shipping Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Shipping to</h3>
                    <p className="text-xs text-gray-700 mb-1">Free flat rate shipping on orders over 536,92TL</p>
                    <p className="text-xs text-gray-600">Estimated to be delivered on 29/11/2025-09/12/2025.</p>
                  </div>

                  {/* Return Policy */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Return Policy</h3>
                    <p className="text-xs text-gray-700">Return Policy</p>
                  </div>

                  {/* Shopping Security */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Shopping Security</h3>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-700">Safe Payments</p>
                      <p className="text-xs text-gray-700">Privacy Protection</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-8 sm:mt-16">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-2 sm:space-x-8 px-3 sm:px-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-[#003d38] text-[#003d38]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="px-4 sm:px-6 py-4 sm:py-8">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">
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
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default ProductDetailPage;