/**
 * Category interface
 */
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Subcategory interface
 */
export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  categoryId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  children?: Subcategory[]; // Child categories (3rd level)
}

/**
 * Category with subcategories interface
 */
export interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}
