/**
 * Product interface
 */
export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
  categoryId: number;
  subcategoryId?: number;
  brand?: string;
  sku?: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  tags?: string[];
  specifications?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  categories?: {
    id: number;
    name: string;
    slug: string;
  };
  subcategories?: {
    id: number;
    name: string;
    slug: string;
  };
}
