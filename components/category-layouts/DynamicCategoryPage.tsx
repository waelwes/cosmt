'use client';

import React from 'react';
import { CategoryPage } from '../pages/CategoryPage';
import { Category } from '../../data/categories';

interface DynamicCategoryPageProps {
  category: Category;
}

/**
 * DynamicCategoryPage - A wrapper component for dynamically rendering category pages
 * This component can be extended to support different layouts based on category type or configuration
 */
export const DynamicCategoryPage: React.FC<DynamicCategoryPageProps> = ({ category }) => {
  // For now, we'll use the standard CategoryPage component
  // This can be extended to support different layouts based on category properties
  return <CategoryPage category={category} />;
};

export default DynamicCategoryPage;

