import { Product } from '../../types/Product';

/**
 * Interface for Product Service
 * Defines the contract for product-related operations
 */
export interface IProductService {
  /**
   * Get all products
   * @returns Promise<Product[]>
   */
  getProducts(): Promise<Product[]>;

  /**
   * Get product by ID
   * @param id - Product ID
   * @returns Promise<Product | null>
   */
  getProductById(id: number): Promise<Product | null>;

  /**
   * Get products by category ID
   * @param categoryId - Category ID
   * @returns Promise<Product[]>
   */
  getProductsByCategory(categoryId: number): Promise<Product[]>;

  /**
   * Get products by subcategory ID
   * @param subcategoryId - Subcategory ID
   * @returns Promise<Product[]>
   */
  getProductsBySubcategory(subcategoryId: number): Promise<Product[]>;

  /**
   * Get products by multiple category IDs
   * @param categoryIds - Array of category IDs
   * @returns Promise<Product[]>
   */
  getProductsByCategories(categoryIds: number[]): Promise<Product[]>;

  /**
   * Update product by ID
   * @param id - Product ID
   * @param data - Product data to update
   * @returns Promise<Product | null>
   */
  updateProduct(id: number, data: Partial<Product>): Promise<Product | null>;

  /**
   * Delete product by ID
   * @param id - Product ID
   * @returns Promise<boolean>
   */
  deleteProduct(id: number): Promise<boolean>;
}
