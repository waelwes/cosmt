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
        { id: 29, name: 'Anti-Dandruff', slug: 'shampoo-anti-dandruff' },
        { id: 30, name: 'Color Protection', slug: 'shampoo-color-protection' },
        { id: 31, name: 'Repair', slug: 'shampoo-repair' }
      ]
    },
    {
      id: 9,
      name: 'Conditioner',
      slug: 'conditioner',
      children: [
        { id: 32, name: 'Deep Conditioning', slug: 'conditioner-deep' },
        { id: 33, name: 'Leave-In', slug: 'conditioner-leave-in' },
        { id: 34, name: 'Repair', slug: 'conditioner-repair' },
        { id: 35, name: 'Color Protection', slug: 'conditioner-color-protection' },
        { id: 36, name: 'Volumizing', slug: 'conditioner-volumizing' }
      ]
    },
    {
      id: 10,
      name: 'Hair Mask',
      slug: 'hair-mask',
      children: [
        { id: 37, name: 'Hydrating', slug: 'hair-mask-hydrating' },
        { id: 38, name: 'Keratin', slug: 'hair-mask-keratin' },
        { id: 39, name: 'Protein', slug: 'hair-mask-protein' },
        { id: 40, name: 'Repair', slug: 'hair-mask-repair' },
        { id: 41, name: 'Color Protection', slug: 'hair-mask-color-protection' }
      ]
    },
    {
      id: 11,
      name: 'Hair Treatment',
      slug: 'hair-treatment',
      children: [
        { id: 42, name: 'Hair Serum', slug: 'hair-serum' },
        { id: 43, name: 'Hair Oil', slug: 'hair-oil' },
        { id: 44, name: 'Scalp Treatment', slug: 'scalp-treatment' },
        { id: 45, name: 'Hair Growth', slug: 'hair-growth' }
      ]
    },
    {
      id: 12,
      name: 'Hair Styling',
      slug: 'hair-styling',
      children: [
        { id: 46, name: 'Hair Gel', slug: 'hair-gel' },
        { id: 47, name: 'Hair Spray', slug: 'hair-spray' },
        { id: 48, name: 'Hair Wax', slug: 'hair-wax' },
        { id: 49, name: 'Hair Mousse', slug: 'hair-mousse' },
        { id: 50, name: 'Heat Protection', slug: 'heat-protection' }
      ]
    },
    {
      id: 13,
      name: 'Hair Accessories',
      slug: 'hair-accessories',
      children: [
        { id: 51, name: 'Hair Brushes', slug: 'hair-brushes' },
        { id: 52, name: 'Hair Clips', slug: 'hair-clips' },
        { id: 53, name: 'Hair Bands', slug: 'hair-bands' },
        { id: 54, name: 'Hair Dryers', slug: 'hair-dryers' }
      ]
    }
  ]
};

const STATIC_PERSONAL_CARE_DATA = {
  id: 3,
  name: 'Personal Care',
  slug: 'personal-care',
  subcategories: [
    {
      id: 11,
      name: 'Perfume and Deodorant',
      slug: 'perfume-deodorant',
      children: [
        { id: 40, name: 'Perfume', slug: 'perfume' },
        { id: 41, name: 'Deodorant', slug: 'deodorant' },
        { id: 42, name: 'Body Sprays', slug: 'body-sprays' },
        { id: 43, name: 'Roll On', slug: 'roll-on' }
      ]
    },
    {
      id: 12,
      name: 'Solar Products',
      slug: 'solar-products',
      children: [
        { id: 44, name: 'Sunscreen', slug: 'sunscreen' },
        { id: 45, name: 'Bronzer', slug: 'bronzer' },
        { id: 46, name: 'After Sun Care', slug: 'after-sun-care' }
      ]
    },
    {
      id: 13,
      name: 'Body and Bath Products',
      slug: 'body-bath-products',
      children: [
        { id: 47, name: 'Hygiene Products', slug: 'hygiene-products' },
        { id: 48, name: 'Bathroom and Shower', slug: 'bathroom-shower' },
        { id: 49, name: 'Body Care', slug: 'body-care' }
      ]
    },
    {
      id: 14,
      name: 'Hand, Foot and Nail Care',
      slug: 'hand-foot-nail-care',
      children: [
        { id: 50, name: 'Mani Pedi', slug: 'mani-pedi' },
        { id: 51, name: 'Artificial Nails', slug: 'artificial-nails' },
        { id: 52, name: 'Hand and Foot Care', slug: 'hand-foot-care' },
        { id: 53, name: 'Nail Care and Nail Polish', slug: 'nail-care-polish' }
      ]
    },
    {
      id: 15,
      name: 'Hair Removal Products',
      slug: 'hair-removal-products',
      children: [
        { id: 54, name: 'Waxing', slug: 'waxing' },
        { id: 55, name: 'Hair Removal Cream', slug: 'hair-removal-cream' },
        { id: 56, name: 'Womens Razor Blades', slug: 'womens-razor-blades' }
      ]
    },
    {
      id: 16,
      name: 'Oral Health',
      slug: 'oral-health',
      children: [
        { id: 57, name: 'Mouthwash', slug: 'mouthwash' },
        { id: 58, name: 'Toothpaste', slug: 'toothpaste' },
        { id: 59, name: 'Toothbrushes and Cleaners', slug: 'toothbrushes-cleaners' },
        { id: 60, name: 'Dental Prosthetic Products', slug: 'dental-prosthetic' }
      ]
    },
    {
      id: 17,
      name: 'Eyebrow and Eyelash Care',
      slug: 'eyebrow-eyelash-care',
      children: [
        { id: 61, name: 'Nourishing Serum', slug: 'nourishing-serum' },
        { id: 62, name: 'Eyelash Lift', slug: 'eyelash-lift' }
      ]
    },
    {
      id: 18,
      name: 'Shaving Products',
      slug: 'shaving-products',
      children: [
        { id: 63, name: 'Shavers', slug: 'shavers' },
        { id: 64, name: 'Beard and Mustache Care', slug: 'beard-mustache-care' },
        { id: 65, name: 'Razor Blade', slug: 'razor-blade' },
        { id: 66, name: 'Shaving Brush', slug: 'shaving-brush' },
        { id: 67, name: 'Before and After Shaving', slug: 'before-after-shaving' }
      ]
    },
    {
      id: 19,
      name: 'Sexual Health',
      slug: 'sexual-health',
      children: [
        { id: 68, name: 'Okey', slug: 'okey' },
        { id: 69, name: 'Durex', slug: 'durex' }
      ]
    },
    {
      id: 20,
      name: 'Care Supplies',
      slug: 'care-supplies',
      children: [
        { id: 70, name: 'Tweezers', slug: 'tweezers' },
        { id: 71, name: 'Body Brush', slug: 'body-brush' },
        { id: 72, name: 'Eyebrow and Moustache Scissors', slug: 'eyebrow-moustache-scissors' },
        { id: 73, name: 'Dermaroller', slug: 'dermaroller' },
        { id: 74, name: 'Travel Kit', slug: 'travel-kit' }
      ]
    },
    {
      id: 21,
      name: 'Dermocosmetic Personal Care',
      slug: 'dermocosmetic-personal-care',
      children: [
        { id: 75, name: 'Dermocosmetic Face Care', slug: 'dermocosmetic-face-care' },
        { id: 76, name: 'Dermocosmetic Body Care', slug: 'dermocosmetic-body-care' },
        { id: 77, name: 'Dermocosmetic Hair Care', slug: 'dermocosmetic-hair-care' },
        { id: 78, name: 'Dermocosmetic Sun Care', slug: 'dermocosmetic-sun-care' },
        { id: 79, name: 'Dermocosmetic Anti-Aging', slug: 'dermocosmetic-anti-aging' },
        { id: 80, name: 'Dermocosmetic Acne Treatment', slug: 'dermocosmetic-acne-treatment' },
        { id: 81, name: 'Dermocosmetic Sensitive Skin', slug: 'dermocosmetic-sensitive-skin' },
        { id: 82, name: 'Dermocosmetic Men Care', slug: 'dermocosmetic-men-care' }
      ]
    }
  ]
};

const STATIC_MOTHER_BABY_DATA = {
  id: 4,
  name: 'Mother and Baby',
  slug: 'mother-baby',
  subcategories: [
    {
      id: 22,
      name: 'Maternal Care and Breastfeeding',
      slug: 'maternal-care-breastfeeding',
      children: [
        { id: 75, name: 'Breast Pump', slug: 'breast-pump' },
        { id: 76, name: 'Nipple Cream', slug: 'nipple-cream' },
        { id: 77, name: 'Breast Pad', slug: 'breast-pad' },
        { id: 78, name: 'Milk Storage Bag', slug: 'milk-storage-bag' }
      ]
    },
    {
      id: 23,
      name: 'Baby Bath Products',
      slug: 'baby-bath-products',
      children: [
        { id: 79, name: 'Baby Soaps', slug: 'baby-soaps' },
        { id: 80, name: 'Baby Shampoos', slug: 'baby-shampoos' },
        { id: 81, name: 'Body Cleansers', slug: 'body-cleansers' },
        { id: 82, name: 'Baby Hair Conditioners', slug: 'baby-hair-conditioners' }
      ]
    },
    {
      id: 24,
      name: 'Baby Sunscreens',
      slug: 'baby-sunscreens',
      children: [
        { id: 99, name: 'Mustela', slug: 'baby-sunscreens-mustela' },
        { id: 100, name: 'Baby', slug: 'baby-sunscreens-baby' },
        { id: 101, name: 'Avene', slug: 'baby-sunscreens-avene' },
        { id: 102, name: 'Vichy', slug: 'baby-sunscreens-vichy' },
        { id: 103, name: 'Badger', slug: 'baby-sunscreens-badger' }
      ]
    },
    {
      id: 25,
      name: 'Baby Body Care Products',
      slug: 'baby-body-care',
      children: [
        { id: 83, name: 'Diaper Rash Cream', slug: 'diaper-rash-cream' },
        { id: 84, name: 'Baby Oil', slug: 'baby-oil' },
        { id: 85, name: 'Baby Cologne', slug: 'baby-cologne' }
      ]
    },
    {
      id: 26,
      name: 'Baby Oral Care Products',
      slug: 'baby-oral-care',
      children: [
        { id: 86, name: 'Baby Toothbrushes', slug: 'baby-toothbrushes' },
        { id: 87, name: 'Baby Toothpastes', slug: 'baby-toothpastes' }
      ]
    },
    {
      id: 27,
      name: 'Baby Feeding Supplies',
      slug: 'baby-feeding-supplies',
      children: [
        { id: 88, name: 'Bottle', slug: 'bottle' },
        { id: 89, name: 'Pacifier', slug: 'pacifier' },
        { id: 90, name: 'Exercise Cups', slug: 'exercise-cups' },
        { id: 91, name: 'Baby Fork and Spoon', slug: 'baby-fork-spoon' }
      ]
    },
    {
      id: 28,
      name: 'Diaper and Wet Wipes',
      slug: 'diaper-wet-wipes',
      children: [
        { id: 92, name: 'Baby Diaper', slug: 'baby-diaper' },
        { id: 93, name: 'Baby wipes', slug: 'baby-wipes' }
      ]
    },
    {
      id: 29,
      name: 'Dermocosmetic Baby Products',
      slug: 'dermocosmetic-baby-products',
      children: [
        { id: 94, name: 'Baby Hygiene Products', slug: 'baby-hygiene-products' },
        { id: 95, name: 'Baby Care Oil', slug: 'baby-care-oil' },
        { id: 96, name: 'Baby Care Cream', slug: 'baby-care-cream' },
        { id: 97, name: 'Baby Care Kit', slug: 'baby-care-kit' },
        { id: 98, name: 'Baby Shampoo', slug: 'baby-shampoo-dermocosmetic' }
      ]
    }
  ]
};

const STATIC_BRANDS_DATA = {
  id: 5,
  name: 'Brands',
  slug: 'brands',
  subcategories: [
    {
      id: 30,
      name: 'Popular Brands',
      slug: 'popular-brands',
      children: [
        { id: 104, name: 'L\'Oréal', slug: 'loreal' },
        { id: 105, name: 'Maybelline', slug: 'maybelline' },
        { id: 106, name: 'Nivea', slug: 'nivea' },
        { id: 107, name: 'Garnier', slug: 'garnier' },
        { id: 108, name: 'The Body Shop', slug: 'the-body-shop' }
      ]
    },
    {
      id: 31,
      name: 'Luxury Brands',
      slug: 'luxury-brands',
      children: [
        { id: 109, name: 'Estée Lauder', slug: 'estee-lauder' },
        { id: 110, name: 'Chanel', slug: 'chanel' },
        { id: 111, name: 'Dior', slug: 'dior' },
        { id: 112, name: 'Yves Saint Laurent', slug: 'ysl' },
        { id: 113, name: 'Gucci', slug: 'gucci' }
      ]
    },
    {
      id: 32,
      name: 'Natural & Organic',
      slug: 'natural-organic',
      children: [
        { id: 114, name: 'The Ordinary', slug: 'the-ordinary' },
        { id: 115, name: 'Himalaya', slug: 'himalaya' },
        { id: 116, name: ' Burt\'s Bees', slug: 'burts-bees' },
        { id: 117, name: 'Pacifica', slug: 'pacifica' },
        { id: 118, name: 'Jason Natural', slug: 'jason-natural' }
      ]
    },
    {
      id: 33,
      name: 'Korean Beauty',
      slug: 'korean-beauty',
      children: [
        { id: 119, name: 'Sulwhasoo', slug: 'sulwhasoo' },
        { id: 120, name: 'Innisfree', slug: 'innisfree' },
        { id: 121, name: 'Etude House', slug: 'etude-house' },
        { id: 122, name: 'TonyMoly', slug: 'tonymoly' },
        { id: 123, name: 'Dr. Jart+', slug: 'dr-jart' }
      ]
    },
    {
      id: 34,
      name: 'Men\'s Grooming',
      slug: 'mens-grooming',
      children: [
        { id: 124, name: 'Gillette', slug: 'gillette' },
        { id: 125, name: 'Old Spice', slug: 'old-spice' },
        { id: 126, name: 'Axe', slug: 'axe' },
        { id: 127, name: 'Dolce & Gabbana', slug: 'dolce-gabbana' },
        { id: 128, name: 'Tom Ford', slug: 'tom-ford' }
      ]
    },
    {
      id: 35,
      name: 'Baby & Kids',
      slug: 'baby-kids',
      children: [
        { id: 129, name: 'Johnson\'s', slug: 'johnsons' },
        { id: 130, name: 'Pampers', slug: 'pampers' },
        { id: 131, name: 'Mustela', slug: 'mustela' },
        { id: 132, name: 'Cetaphil', slug: 'cetaphil' },
        { id: 133, name: 'Eucerin', slug: 'eucerin' }
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
  const [useStaticData, setUseStaticData] = useState(true); // Start with true to use static data

  // Use API data if available, fall back to static data
  useEffect(() => {
    // Use static data if API data is not yet loaded or there's an error
    if ((error && !loading) || (mainCategories.length === 0 && !loading)) {
      setUseStaticData(true);
    } else if (mainCategories.length > 0) {
      // Use API data if we have categories from the database
      setUseStaticData(false);
    }
  }, [error, loading, mainCategories.length]);

  // Determine which data to use
  const staticDataArray = [
    STATIC_SKIN_CARE_DATA,
    STATIC_HAIR_CARE_DATA,
    STATIC_PERSONAL_CARE_DATA,
    STATIC_MOTHER_BABY_DATA,
    STATIC_BRANDS_DATA
  ];
  const displayCategories = useStaticData ? staticDataArray : [...mainCategories, STATIC_BRANDS_DATA];

  // Log which data source is being used
  if (useStaticData) {
    console.log('Using static category data');
  } else {
    console.log('Using database categories:', mainCategories.length);
  }

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


  // Show message if no data found
  if (!activeCategoryData) {
    return null;
  }

  return (
    <>
      {/* Shadow Overlay Below Header Only */}
      <div 
        className="fixed left-0 right-0 bottom-0 bg-black/50 pointer-events-auto"
        onClick={onClose}
        style={{ 
          position: 'fixed',
          top: 'var(--header-height, 140px)',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%', 
          height: 'calc(100vh - var(--header-height, 140px))',
          zIndex: 45,
          transition: `opacity var(--cosmt-transition-duration) var(--cosmt-transition-easing)`
        }}
      />
      <div
        className="fixed left-1/2 transform -translate-x-1/2 bg-white border-t border-gray-200 shadow-lg"
        style={{
          top: 'var(--header-height, 140px)',
          zIndex: 46,
          maxWidth: '1220px',
          width: 'calc(100% - 3rem)'
        }}
        onMouseEnter={() => {
          // Keep menu open when hovering over it
          if (typeof window !== 'undefined') {
            // Dispatch a custom event to notify parent to keep menu open
            window.dispatchEvent(new CustomEvent('megaMenuMouseEnter'));
          }
        }}
        onMouseLeave={() => {
          // Close menu when leaving it
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('megaMenuMouseLeave'));
          }
        }}
      >
        <div className="px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Sub Categories - Organized layout */}
          {activeCategoryData.subcategories && activeCategoryData.subcategories.length > 0 ? (
            <div className="grid grid-cols-4 gap-6 ml-12">
              {activeCategoryData.subcategories.slice(0, 8).map((subCategory, index) => (
                <div key={subCategory.id} className="space-y-2 pt-2">
                  {/* Main Subcategory */}
                  <Link
                    href={`/categories/${activeCategoryData?.slug}/${subCategory.slug}`}
                    className="block font-semibold text-gray-900 transition-colors duration-200 mb-3"
                    style={{ color: 'inherit', fontSize: '15px' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#003d38'}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
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
                          className="block text-gray-600 transition-colors duration-200 py-1"
                          style={{ color: 'inherit', fontSize: '13px' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#003d38'}
                          onMouseLeave={(e) => e.currentTarget.style.color = ''}
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
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No subcategories available for {categoryName}</p>
              <Link
                href={`/categories/${activeCategoryData.slug}`}
                className="mt-4 inline-block font-medium"
                style={{ color: '#003d38' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#002a25'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#003d38'}
                onClick={onClose}
              >
                View all {activeCategoryData.name} products →
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
