// Data preloader for critical resources
import { networkOptimizedCache } from './networkOptimizations';
import { ServiceContainer } from '../di/ServiceContainer';

class DataPreloader {
  private static instance: DataPreloader;
  private preloadedKeys = new Set<string>();
  private preloadPromises = new Map<string, Promise<any>>();

  static getInstance(): DataPreloader {
    if (!DataPreloader.instance) {
      DataPreloader.instance = new DataPreloader();
    }
    return DataPreloader.instance;
  }

  // Preload critical data on app start
  async preloadCriticalData(): Promise<void> {
    console.log('🚀 Preloading critical data...');
    
    const criticalData = [
      { key: 'categories', priority: 'high' },
      { key: 'best-sellers', priority: 'high' },
      { key: 'new-products', priority: 'medium' },
      { key: 'on-sale-products', priority: 'medium' }
    ];

    // Preload high priority data first
    const highPriority = criticalData.filter(item => item.priority === 'high');
    const mediumPriority = criticalData.filter(item => item.priority === 'medium');

    // Start preloading high priority data immediately
    const highPriorityPromises = highPriority.map(item => this.preloadData(item.key));
    
    // Start medium priority data after a short delay
    setTimeout(() => {
      mediumPriority.forEach(item => this.preloadData(item.key));
    }, 100);

    // Wait for high priority data to complete
    await Promise.allSettled(highPriorityPromises);
    console.log('✅ Critical data preloading completed');
  }

  private async preloadData(key: string): Promise<void> {
    if (this.preloadedKeys.has(key) || this.preloadPromises.has(key)) {
      return; // Already preloaded or in progress
    }

    console.log(`🔄 Preloading ${key}...`);
    
    const promise = this.fetchDataByKey(key);
    this.preloadPromises.set(key, promise);

    try {
      await promise;
      this.preloadedKeys.add(key);
      console.log(`✅ Preloaded ${key}`);
    } catch (error) {
      console.warn(`⚠️ Failed to preload ${key}:`, error);
    } finally {
      this.preloadPromises.delete(key);
    }
  }

  private async fetchDataByKey(key: string): Promise<any> {
    switch (key) {
      case 'categories':
        const categoryService = ServiceContainer.getInstance().getServiceFactory().createCategoryService();
        return await networkOptimizedCache.get('categories', () => 
          categoryService.getCategoriesWithSubcategories()
        );
      
      case 'best-sellers':
        const productService = ServiceContainer.getInstance().getServiceFactory().createProductService();
        return await networkOptimizedCache.get('best-sellers', () => 
          productService.getBestSellers()
        );
      
      case 'new-products':
        return await networkOptimizedCache.get('new-products', () => 
          productService.getNewProducts()
        );
      
      case 'on-sale-products':
        return await networkOptimizedCache.get('on-sale-products', () => 
          productService.getOnSaleProducts()
        );
      
      default:
        throw new Error(`Unknown preload key: ${key}`);
    }
  }

  // Check if data is already preloaded
  isPreloaded(key: string): boolean {
    return this.preloadedKeys.has(key);
  }

  // Get preload status
  getPreloadStatus(): { preloaded: string[]; inProgress: string[] } {
    return {
      preloaded: Array.from(this.preloadedKeys),
      inProgress: Array.from(this.preloadPromises.keys())
    };
  }

  // Clear preload cache (useful for testing)
  clearPreloadCache(): void {
    this.preloadedKeys.clear();
    this.preloadPromises.clear();
  }
}

export const dataPreloader = DataPreloader.getInstance();
