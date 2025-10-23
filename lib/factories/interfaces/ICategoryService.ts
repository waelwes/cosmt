import { Category, Subcategory, CategoryWithSubcategories } from '../../types/Category';

/**
 * Interface for Category Service
 * Defines the contract for category-related operations
 */
export interface ICategoryService {
  /**
   * Get all categories
   * @returns Promise<Category[]>
   */
  getCategories(): Promise<Category[]>;

  /**
   * Get category by ID
   * @param id - Category ID
   * @returns Promise<Category | null>
   */
  getCategoryById(id: number): Promise<Category | null>;

  /**
   * Get category by slug
   * @param slug - Category slug
   * @returns Promise<Category | null>
   */
  getCategoryBySlug(slug: string): Promise<Category | null>;

  /**
   * Get all subcategories
   * @returns Promise<Subcategory[]>
   */
  getSubcategories(): Promise<Subcategory[]>;

  /**
   * Get subcategories by category ID
   * @param categoryId - Category ID
   * @returns Promise<Subcategory[]>
   */
  getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]>;

  /**
   * Get subcategory by slug
   * @param slug - Subcategory slug
   * @returns Promise<Subcategory | null>
   */
  getSubcategoryBySlug(slug: string): Promise<Subcategory | null>;

  /**
   * Get categories with their subcategories
   * @returns Promise<CategoryWithSubcategories[]>
   */
  getCategoriesWithSubcategories(): Promise<CategoryWithSubcategories[]>;
}
