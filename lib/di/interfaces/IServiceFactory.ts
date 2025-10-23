import { ICategoryService } from '../../factories/interfaces/ICategoryService';
import { IProductService } from '../../factories/interfaces/IProductService';
import { IConcernService } from '../../factories/interfaces/IConcernService';

/**
 * Interface for Service Factory
 * Defines the contract for creating service instances
 */
export interface IServiceFactory {
  /**
   * Create or get the CategoryService instance
   * @returns ICategoryService instance
   */
  createCategoryService(): ICategoryService;

  /**
   * Create or get the ProductService instance
   * @returns IProductService instance
   */
  createProductService(): IProductService;

  /**
   * Create or get the ConcernService instance
   * @returns IConcernService instance
   */
  createConcernService(): IConcernService;
}
