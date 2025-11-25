'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
}

interface ExpandableCategoriesProps {
  topLevelSubcategories?: Subcategory[];
  groupedChildren?: Record<number, { parent: Subcategory; children: Subcategory[] }>;
  categorySlug?: string;
}

export const ExpandableCategories: React.FC<ExpandableCategoriesProps> = ({
  topLevelSubcategories = [],
  groupedChildren = {},
  categorySlug = ''
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

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

  // Add safety checks
  if (!topLevelSubcategories || !Array.isArray(topLevelSubcategories)) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-500">No categories available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {topLevelSubcategories.map((sub) => {
        const hasChildren = groupedChildren && groupedChildren[sub.id] && groupedChildren[sub.id].children && groupedChildren[sub.id].children.length > 0;
        const isExpanded = expandedCategories.has(sub.id);

        return (
          <div key={sub.id} className="space-y-1">
            <div className="flex items-center">
              <Link 
                href={`/categories/${categorySlug}/${sub.slug}`} 
                className="flex-1 text-gray-700 hover:text-green-600 font-medium py-1"
              >
                {sub.name}
              </Link>
              {hasChildren && (
                <button
                  onClick={() => toggleCategory(sub.id)}
                  className="ml-2 p-1 transition-colors"
                >
                  <ChevronRight 
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      isExpanded ? 'rotate-90' : ''
                    }`} 
                  />
                </button>
              )}
            </div>
            {hasChildren && isExpanded && groupedChildren[sub.id] && groupedChildren[sub.id].children && groupedChildren[sub.id].children.length > 0 && (
              <div className="ml-6 space-y-1">
                {groupedChildren[sub.id].children.slice(0, 5).map((child) => (
                  <Link 
                    key={child.id} 
                    href={`/categories/${categorySlug}/${sub.slug}/${child.slug}`} 
                    className="block text-sm text-gray-600 hover:text-green-600 py-1 pl-2"
                  >
                    {child.name}
                  </Link>
                ))}
                {groupedChildren[sub.id].children.length > 5 && (
                  <span className="text-xs text-gray-500 pl-2">
                    +{groupedChildren[sub.id].children.length - 5} more
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
