'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import { ServiceContainer } from '../../lib/di/ServiceContainer';
import { ICategoryService } from '../../lib/factories/interfaces/ICategoryService';
import { CategoryWithSubcategories } from '../../lib/types/Category';
import { useOptimizedCategories } from '../../hooks/useOptimizedData';

// Static fallback data for when database is offline
const STATIC_SKIN_CARE_DATA = {
  id: 1,
  name: 'Skin Care',
  slug: 'skin-care',
  subcategories: [
    {
      id: 1,
      name: 'Facial Cleansing',
      slug: 'facial-cleansing',
      children: [
        { id: 1, name: 'Moisturizer', slug: 'facial-cleansing-moisturizer' },
        { id: 2, name: 'Sensitive Skin', slug: 'facial-cleansing-sensitive-skin' },
        { id: 3, name: 'Oily Skin', slug: 'facial-cleansing-oily-skin' },
        { id: 4, name: 'Purifying', slug: 'facial-cleansing-purifying' },
        { id: 5, name: 'Makeup Remover', slug: 'facial-cleansing-makeup-remover' }
      ]
    },
    {
      id: 2,
      name: 'Face Cream',
      slug: 'face-cream',
      children: [
        { id: 6, name: 'Moisturizer', slug: 'face-cream-moisturizer' },
        { id: 7, name: 'Sensitive Skin', slug: 'face-cream-sensitive-skin' },
        { id: 8, name: 'Oily Skin', slug: 'face-cream-oily-skin' },
        { id: 9, name: 'Anti-Aging', slug: 'face-cream-anti-aging' },
        { id: 10, name: 'Anti-Stain', slug: 'face-cream-anti-stain' }
      ]
    },
    {
      id: 3,
      name: 'Face Serum',
      slug: 'face-serum',
      children: [
        { id: 11, name: 'Enlightening', slug: 'face-serum-enlightening' },
        { id: 12, name: 'Anti-Wrinkle', slug: 'face-serum-anti-wrinkle' },
        { id: 13, name: 'Loss of Firmness', slug: 'face-serum-loss-of-firmness' },
        { id: 14, name: 'Anti-Stain', slug: 'face-serum-anti-stain' },
        { id: 15, name: 'Oily Skin', slug: 'face-serum-oily-skin' }
      ]
    },
    {
      id: 4,
      name: 'Face Mask',
      slug: 'face-mask',
      children: [
        { id: 16, name: 'Cleaning', slug: 'face-mask-cleaning' },
        { id: 17, name: 'Moisturizer', slug: 'face-mask-moisturizer' },
        { id: 18, name: 'Enlightening', slug: 'face-mask-enlightening' },
        { id: 19, name: 'Oily Skin', slug: 'face-mask-oily-skin' },
        { id: 20, name: 'Loss of Firmness', slug: 'face-mask-loss-of-firmness' }
      ]
    },
    {
      id: 5,
      name: 'Eye Contour Care',
      slug: 'eye-contour-care',
      children: [
        { id: 21, name: 'Enlightening', slug: 'eye-contour-enlightening' },
        { id: 22, name: 'Loss of Firmness', slug: 'eye-contour-loss-of-firmness' },
        { id: 23, name: 'Sensitive Skin', slug: 'eye-contour-sensitive-skin' }
      ]
    },
    {
      id: 6,
      name: 'Lip Care',
      slug: 'lip-care',
      children: [
        { id: 24, name: 'Dermocosmetics', slug: 'lip-care-dermocosmetics' },
        { id: 25, name: 'Cream', slug: 'lip-care-cream' },
        { id: 26, name: 'Lipstick', slug: 'lip-care-lipstick' }
      ]
    },
    {
      id: 8,
      name: 'Dermocosmetic Skin Care',
      slug: 'dermocosmetic-skin-care',
      children: []
    }
  ]
};

const STATIC_HAIR_CARE_DATA = {
  id: 2,
  name: 'Hair Care',
  slug: 'hair-care',
  subcategories: [
    {
      id: 8,
      name: 'Shampoo',
      slug: 'shampoo',
      children: [
        { id: 27, name: 'Volumizing', slug: 'shampoo-volumizing' },
        { id: 28, name: 'Moisturizing', slug: 'shampoo-moisturizing' },
        { id: 29, name: 'Anti-Dandruff', slug: 'shampoo-anti-dandruff' }
      ]
    },
    {
      id: 9,
      name: 'Conditioner',
      slug: 'conditioner',
      children: [
        { id: 30, name: 'Deep Conditioning', slug: 'conditioner-deep' },
        { id: 31, name: 'Leave-In', slug: 'conditioner-leave-in' },
        { id: 32, name: 'Repair', slug: 'conditioner-repair' }
      ]
    },
    {
      id: 10,
      name: 'Hair Mask',
      slug: 'hair-mask',
      children: [
        { id: 33, name: 'Hydrating', slug: 'hair-mask-hydrating' },
        { id: 34, name: 'Keratin', slug: 'hair-mask-keratin' },
        { id: 35, name: 'Protein', slug: 'hair-mask-protein' }
      ]
    }
  ]
};

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string; // Add category name prop
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, categoryName }) => {
  const { categories: mainCategories, loading, error } = useOptimizedCategories();
  const [useStaticData, setUseStaticData] = useState(false);

  // Use static data as fallback if there's an error
  useEffect(() => {
    if (error && !loading) {
      setUseStaticData(true);
    }
  }, [error, loading]);

  // Determine which data to use
  const displayCategories = useStaticData ? [STATIC_SKIN_CARE_DATA, STATIC_HAIR_CARE_DATA] : mainCategories;

  if (!isOpen) return null;

  if (loading && mainCategories.length === 0 && !useStaticData) {
    return (
      <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="cosmt-container py-4">
          <div className="flex items-center justify-center py-8">
            <span className="text-gray-600">Loading categories...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !useStaticData) {
    return (
      <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="cosmt-container py-4">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <span className="text-gray-600">Categories not available</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeCategoryData = displayCategories.find(cat => cat.name === categoryName);

  return (
    <div 
      className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
    >
      <div className="cosmt-container py-12">
        
        {/* Sub Categories - Organized layout */}
        <div className="grid grid-cols-4 gap-6 ml-12">
          {activeCategoryData
            ?.subcategories?.slice(0, 8).map((subCategory, index) => (
               <div key={subCategory.id} className="space-y-2 pt-2">
                 {/* Main Subcategory */}
                 <Link
                  href={`/categories/${activeCategoryData?.slug}/${subCategory.slug}`}
                   className="block font-semibold text-gray-900 hover:text-green-600 transition-colors duration-200 mb-3"
                   style={{ fontSize: '15px' }}
                   onClick={onClose}
                 >
                   {subCategory.name}
                 </Link>
                 
                 {/* Child Subcategories */}
                  {subCategory.children && subCategory.children.length > 0 && (
                   <div className="space-y-1.5">
                     {subCategory.children.slice(0, 6).map((child) => (
                       <Link
                         key={child.id}
                        href={`/categories/${activeCategoryData?.slug}/${subCategory.slug}/${child.slug}`}
                         className="block text-gray-600 hover:text-green-600 transition-colors duration-200 py-1"
                         style={{ fontSize: '13px' }}
                         onClick={onClose}
                       >
                         {child.name}
                       </Link>
                     ))}
                   </div>
                 )}
               </div>
            ))}
        </div>
      </div>
    </div>
  );
};
