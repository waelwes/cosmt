'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { categories, getMainCategories } from '../../data/categories';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const mainCategories = getMainCategories();

  if (!isOpen) return null;

  return (
    <div 
      className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 max-h-96 overflow-y-auto"
      onMouseEnter={() => setActiveCategory(activeCategory)} // Keep menu open when hovering over it
    >
      <div className="cosmt-container py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Categories */}
          <div className="lg:col-span-1">
            <h3 className="text-cosmt-base font-semibold text-gray-900 mb-3">Shop by Category</h3>
            <div className="space-y-1">
              {mainCategories.slice(0, 8).map((category) => (
                <button
                  key={category.id}
                  onMouseEnter={() => setActiveCategory(category.id)}
                  className="w-full text-left px-3 py-2 text-cosmt-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors duration-200 flex items-center justify-between"
                >
                  <span>{category.name}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>

          {/* Sub Categories */}
          <div className="lg:col-span-3">
            {activeCategory && (
              <div className="space-y-4">
                {mainCategories
                  .find(cat => cat.id === activeCategory)
                  ?.children?.slice(0, 6).map((subCategory) => (
                    <div key={subCategory.id} className="space-y-2">
                          <Link
                            href={`/categories/${subCategory.slug}`}
                            className="block text-cosmt-base font-semibold text-gray-900 hover:text-green-600 transition-colors duration-200"
                            onClick={onClose}
                          >
                            {subCategory.name}
                          </Link>
                      
                      {subCategory.children && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 ml-3">
                          {subCategory.children.slice(0, 6).map((item) => (
                            <Link
                              key={item.id}
                              href={`/categories/${item.slug}`}
                              className="block text-cosmt-xs text-gray-600 hover:text-green-600 transition-colors duration-200 py-1"
                              onClick={onClose}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Featured Categories */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-cosmt-base font-semibold text-gray-900 mb-3">Featured Collections</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {mainCategories.slice(0, 4).map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="group block"
                    onClick={onClose}
                  >
                <div className="relative aspect-square overflow-hidden mb-1">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={120}
                    height={120}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-cosmt-xs font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                  {category.name}
                </h4>
                <p className="text-cosmt-xs text-gray-500">
                  {category.productCount} products
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
