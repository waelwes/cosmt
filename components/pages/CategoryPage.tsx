'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '../../data/categories';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { ProductGrid } from '../ui/ProductGrid';
import { CategoryFilters } from '../ui/CategoryFilters';
import { useCart } from '../../contexts/CartContext';
import { PageLayout } from '../layout/PageLayout';

interface CategoryPageProps {
  category: Category;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
  const { addToCart } = useCart();
  const [filters, setFilters] = useState({
    brand: 'All',
    priceRange: 'All',
    inStock: false,
  });
  const [sortOrder, setSortOrder] = useState('relevance');

  // Mock products data - in real app, this would come from API
  const mockProducts = [
    {
      id: 1,
      name: 'Hydrating Face Serum',
      brand: 'AVEDA',
      price: '$65.00',
      originalPrice: '$85.00',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&crop=center',
      rating: 4.9,
      reviews: 234,
      category: category.name,
      description: 'A powerful hydrating serum for radiant skin.',
      isNew: false,
      isBestSeller: true,
    },
    // Add more mock products...
  ];

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: category.name, href: `/categories/${category.slug}` },
  ];

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      description: product.description,
    });
  };

  return (
    <PageLayout>
      {/* Category Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          style={{ objectFit: 'cover' }}
          className="z-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10 flex items-center justify-center text-center">
          <div className="text-white cosmt-container">
            <h1 className="text-cosmt-4xl md:text-cosmt-5xl font-bold mb-3">{category.name}</h1>
            <p className="text-cosmt-base md:text-cosmt-lg max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      <div className="cosmt-container py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Subcategories */}
        {category.children && category.children.length > 0 && (
          <div className="mb-8">
            <h2 className="text-cosmt-xl font-semibold text-gray-900 mb-4">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {category.children.map((subCategory) => (
                <Link
                  key={subCategory.id}
                  href={`/categories/${category.slug}/${subCategory.slug}`}
                  className="group block text-center p-4 border border-gray-200 hover:border-green-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="relative aspect-square overflow-hidden mb-2">
                    <Image
                      src={subCategory.image}
                      alt={subCategory.name}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-cosmt-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                    {subCategory.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-1/4">
            <CategoryFilters
              filters={filters}
              setFilters={setFilters}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </aside>

          {/* Products Grid */}
          <main className="lg:w-3/4">
            <ProductGrid
              products={mockProducts}
              onAddToCart={handleAddToCart}
              showFilters={false}
            />
          </main>
        </div>
      </div>
    </PageLayout>
  );
};
