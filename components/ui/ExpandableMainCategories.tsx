'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';

interface Subcategory {
  id: number;
  name: string;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  subcategories?: Subcategory[];
}

interface ExpandableMainCategoriesProps {
  categories: Category[];
  locale: string;
  subcategoriesText: string;
  categoriesTitle: string;
}

export const ExpandableMainCategories: React.FC<ExpandableMainCategoriesProps> = ({
  categories,
  locale,
  subcategoriesText,
  categoriesTitle
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [isCategoriesVisible, setIsCategoriesVisible] = useState<boolean>(true);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  return (
    <div>
      <div className={`flex items-center justify-between ${isCategoriesVisible ? 'mb-4 pb-4 border-b border-gray-200' : 'mb-0'}`}>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <img src="/Category.svg" alt="Category" className="w-5 h-5 mr-2" />
          {categoriesTitle}
        </h3>
        <button
          onClick={() => setIsCategoriesVisible(!isCategoriesVisible)}
          className="p-1 transition-colors"
          aria-label={isCategoriesVisible ? 'Hide categories' : 'Show categories'}
        >
          {isCategoriesVisible ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
      {isCategoriesVisible && (
        <div className="space-y-1">
          {categories.map((category) => {
        const hasSubcategories = Array.isArray(category.subcategories) && category.subcategories.length > 0;
        const isExpanded = expandedCategories.has(category.id);

        return (
          <div key={category.id} className="overflow-hidden">
            {/* Category Header */}
            <div className="flex items-center justify-between p-2 transition-colors">
              <Link
                href={`/${locale}/categories/${category.slug}`}
                className="flex-1 text-sm text-gray-700 font-medium transition-colors"
                style={{ color: 'inherit' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#003d38'}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                {category.name}
              </Link>
              {hasSubcategories && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCategory(category.id);
                  }}
                  className="ml-2 p-1 transition-colors"
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              )}
            </div>

            {/* Subcategories */}
            {hasSubcategories && isExpanded && (
              <div>
                {category.subcategories!.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={`/${locale}/categories/${category.slug}/${subcategory.slug}`}
                    className="flex items-center px-4 py-2 transition-colors group"
                  >
                    <span className="text-sm text-gray-600 pl-6" style={{ color: 'inherit' }}>
                      <style dangerouslySetInnerHTML={{__html: `
                        .group:hover span { color: #003d38 !important; }
                      `}} />
                      {subcategory.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
        </div>
      )}
    </div>
  );
};
