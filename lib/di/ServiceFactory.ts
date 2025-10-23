import { IServiceFactory } from './interfaces/IServiceFactory';
import { ICategoryService } from '../factories/interfaces/ICategoryService';
import { IProductService } from '../factories/interfaces/IProductService';
import { IConcernService } from '../factories/interfaces/IConcernService';
import { SupabaseCategoryService } from '../factories/implementations/SupabaseCategoryService';
import { SupabaseProductService } from '../factories/implementations/SupabaseProductService';
import { SupabaseConcernService } from '../factories/implementations/SupabaseConcernService';

/**
 * Service Factory for creating service instances
 * Implements the Factory pattern to create service instances
 */
export class ServiceFactory implements IServiceFactory {
  private categoryService: ICategoryService | null = null;
  private productService: IProductService | null = null;
  private concernService: IConcernService | null = null;

  /**
   * Create or get the CategoryService instance
   * @returns ICategoryService instance
   */
  public createCategoryService(): ICategoryService {
    if (!this.categoryService) {
      this.categoryService = new SupabaseCategoryService();
    }
    return this.categoryService;
  }

  /**
   * Create or get the ProductService instance
   * @returns IProductService instance
   */
  public createProductService(): IProductService {
    if (!this.productService) {
      this.productService = new SupabaseProductService();
    }
    return this.productService;
  }

  /**
   * Create or get the ConcernService instance
   * @returns IConcernService instance
   */
  public createConcernService(): IConcernService {
    if (!this.concernService) {
      this.concernService = new SupabaseConcernService();
    }
    return this.concernService;
  }
}
