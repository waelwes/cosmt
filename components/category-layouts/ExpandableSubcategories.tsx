'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';

interface Subcategory {
  id: number;
  name: string;
  slug: string;
}

interface ChildCategory {
  id: number;
  name: string;
  slug: string;
  categoryId?: number;
  parent_id?: number;
  parentId?: number;
}

interface ExpandableSubcategoriesProps {
  categorySlug: string;
  subcategories: Subcategory[];
  childCategories: ChildCategory[];
  products: any[];
  locale: string;
}

export const ExpandableSubcategories: React.FC<ExpandableSubcategoriesProps> = ({
  categorySlug,
  subcategories,
  childCategories,
  products,
  locale,
}) => {
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<number>>(new Set());
  const [isCategoriesVisible, setIsCategoriesVisible] = useState<boolean>(true);

  const toggleSubcategory = (subcategoryId: number) => {
    const newExpanded = new Set(expandedSubcategories);
    if (newExpanded.has(subcategoryId)) {
      newExpanded.delete(subcategoryId);
    } else {
      newExpanded.add(subcategoryId);
    }
    setExpandedSubcategories(newExpanded);
  };

  const getProductCount = (categoryId: number) => {
    return products.filter((p: any) => {
      const catId = p.categories?.id || p.category_id;
      const childCatId = p.child_categories?.id || p.child_category_id;
      return catId === categoryId || childCatId === categoryId;
    }).length;
  };

  const getChildCategoriesForSubcategory = (subcategoryId: number) => {
    return childCategories.filter(child => {
      const parentId = child.parent_id || child.parentId || child.categoryId;
      return parentId === subcategoryId;
    });
  };

  // Filter to show only allowed subcategories
  const allowedSubcategories = [
    'Shampoo',
    'Hair conditioner',
    'Hair Care Oils',
    'Hair Serum',
    'Hair Mask',
    'Shapers',
    'Hair Equipment',
    'Hairbrush and Comb',
    'Hair Dye Care',
    'Bond Intensive Care',
    'Keratin and Straightening Treatment',
    'Perm Products',
    'Hairdressing Equipment'
  ];

  const filteredSubcategories = subcategories.filter(subcat => 
    allowedSubcategories.includes(subcat.name)
  ).sort((a, b) => {
    const indexA = allowedSubcategories.indexOf(a.name);
    const indexB = allowedSubcategories.indexOf(b.name);
    return indexA - indexB;
  });

  return (
    <div>
      <div className={`flex items-center justify-between ${isCategoriesVisible ? 'mb-4 pb-4 border-b border-gray-200' : 'mb-0'}`}>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <img src="/Category.svg" alt="Category" className="w-5 h-5 mr-2" />
          Categories
        </h3>
        <button
          onClick={() => setIsCategoriesVisible(!isCategoriesVisible)}
          className="p-1 rounded transition-colors"
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
        {filteredSubcategories.map((subcat) => {
          const isExpanded = expandedSubcategories.has(subcat.id);
          const childCats = getChildCategoriesForSubcategory(subcat.id);
          const hasChildren = childCats.length > 0;
          const productCount = getProductCount(subcat.id);

          return (
            <div key={subcat.id} className="rounded-md overflow-hidden">
              {/* Subcategory Header */}
              <div className="flex items-center justify-between p-2 transition-colors rounded-md">
                <Link
                  href={`/${locale}/categories/${categorySlug}/${subcat.slug}`}
                  className="flex-1 text-sm text-gray-700 transition-colors"
                  style={{ color: 'inherit' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#003d38'}
                  onMouseLeave={(e) => e.currentTarget.style.color = ''}
                >
                  {subcat.name}
                </Link>
                {hasChildren && (
                  <button
                    onClick={() => toggleSubcategory(subcat.id)}
                    className="ml-2 p-1 rounded transition-colors"
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

              {/* Child Categories */}
              {hasChildren && isExpanded && (
                <div>
                  {childCats.map((childCat) => {
                    const childProductCount = getProductCount(childCat.id);
                    return (
                      <Link
                        key={childCat.id}
                        href={`/${locale}/categories/${categorySlug}/${subcat.slug}/${childCat.slug}`}
                        className="flex items-center px-4 py-2 transition-colors group"
                      >
                        <span className="text-sm text-gray-600 pl-6" style={{ color: 'inherit' }}>
                          <style dangerouslySetInnerHTML={{__html: `
                            .group:hover span { color: #003d38 !important; }
                          `}} />
                          {childCat.name}
                        </span>
                      </Link>
                    );
                  })}
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
