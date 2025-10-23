import { Concern, ProductConcern, ConcernWithProducts } from '../../types/Concern';

/**
 * Interface for Concern Service
 * Defines the contract for concern-related operations
 */
export interface IConcernService {
  /**
   * Get all concerns
   * @returns Promise<Concern[]>
   */
  getConcerns(): Promise<Concern[]>;

  /**
   * Get concerns by type (e.g., 'skin_concern', 'hair_concern')
   * @param type - Concern type
   * @returns Promise<Concern[]>
   */
  getConcernsByType(type: string): Promise<Concern[]>;

  /**
   * Get concern by ID
   * @param id - Concern ID
   * @returns Promise<Concern | null>
   */
  getConcernById(id: number): Promise<Concern | null>;

  /**
   * Get concern by slug
   * @param slug - Concern slug
   * @returns Promise<Concern | null>
   */
  getConcernBySlug(slug: string): Promise<Concern | null>;

  /**
   * Get products by concern ID
   * @param concernId - Concern ID
   * @returns Promise<any[]> - Array of products
   */
  getProductsByConcern(concernId: number): Promise<any[]>;

  /**
   * Get concerns for a specific product
   * @param productId - Product ID
   * @returns Promise<Concern[]>
   */
  getConcernsByProduct(productId: number): Promise<Concern[]>;

  /**
   * Get concerns with their associated products
   * @returns Promise<ConcernWithProducts[]>
   */
  getConcernsWithProducts(): Promise<ConcernWithProducts[]>;

  /**
   * Create a new concern
   * @param concern - Concern data
   * @returns Promise<Concern>
   */
  createConcern(concern: Partial<Concern>): Promise<Concern>;

  /**
   * Update an existing concern
   * @param id - Concern ID
   * @param concern - Updated concern data
   * @returns Promise<Concern>
   */
  updateConcern(id: number, concern: Partial<Concern>): Promise<Concern>;

  /**
   * Delete a concern
   * @param id - Concern ID
   * @returns Promise<boolean>
   */
  deleteConcern(id: number): Promise<boolean>;

  /**
   * Add concern to product
   * @param productId - Product ID
   * @param concernId - Concern ID
   * @returns Promise<ProductConcern>
   */
  addConcernToProduct(productId: number, concernId: number): Promise<ProductConcern>;

  /**
   * Remove concern from product
   * @param productId - Product ID
   * @param concernId - Concern ID
   * @returns Promise<boolean>
   */
  removeConcernFromProduct(productId: number, concernId: number): Promise<boolean>;
}
