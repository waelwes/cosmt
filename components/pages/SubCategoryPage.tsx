'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { getSubCategories } from '../../data/categories';
import { getProductsBySubcategory, Product } from '../../data/products';
import { PageLayout } from '../layout/PageLayout';

interface SubCategoryPageProps {
  categorySlug: string;
  subCategorySlug: string;
  title: string;
  description: string;
}

export const SubCategoryPage: React.FC<SubCategoryPageProps> = ({
  categorySlug,
  subCategorySlug,
  title,
  description,
}) => {
  const [subCategories, setSubCategories] = useState<Array<{ id: string; name: string; slug: string; description: string; image: string; productCount: number }>>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get subcategories
        const fetchedSubCategories = getSubCategories(categorySlug);
        setSubCategories(fetchedSubCategories);

        // Get featured products from this subcategory
        const products = getProductsBySubcategory(categorySlug, subCategorySlug);
        setFeaturedProducts(products.slice(0, 6)); // Show first 6 products
      } catch (error) {
        console.error('Error fetching data:', error);
        setSubCategories([]);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug, subCategorySlug]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/categories' },
    { label: categorySlug ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1) : 'Category', href: categorySlug ? `/categories/${categorySlug}` : '/categories' },
    { label: title },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="cosmt-container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="cosmt-container py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-cosmt-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-cosmt-lg text-gray-600 max-w-3xl">{description}</p>
        </div>

        {/* Subcategories Grid */}
        {subCategories.length > 0 && (
          <div className="mb-16">
            <h2 className="text-cosmt-2xl font-bold text-gray-900 mb-8">Shop by Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {subCategories.map((subCategory) => (
                <Link
                  key={subCategory.id}
                  href={`/categories/${categorySlug}/${subCategory.slug}`}
                  className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={subCategory.image || '/api/placeholder/400/300'}
                      alt={subCategory.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-cosmt-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-200">
                      {subCategory.name}
                    </h3>
                    <p className="text-cosmt-sm text-gray-600 mb-2">{subCategory.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-cosmt-2xl font-bold text-gray-900">Featured Products</h2>
              <Link href={`/categories/${categorySlug}/${subCategorySlug}`}>
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isNew && (
                      <span className="absolute top-3 left-3 bg-green-600 text-white text-cosmt-xs px-2 py-1 rounded">
                        NEW
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="absolute top-3 right-3 bg-gray-800 text-white text-cosmt-xs px-2 py-1 rounded">
                        BEST SELLER
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-cosmt-base font-semibold text-gray-900 mb-1 line-clamp-2">
                      <Link href={`/product/${product.id}`} className="hover:text-green-600 transition-colors duration-200">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-cosmt-sm text-gray-600 mb-2">{product.brand}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-cosmt-lg font-bold text-gray-900">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span>
                        {product.originalPrice && (
                          <span className="text-cosmt-sm text-gray-500 line-through">${typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
