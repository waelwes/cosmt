import useSWR from 'swr';
import { ServiceContainer } from '@/lib/di/ServiceContainer';
import { IProductService } from '@/lib/factories/interfaces/IProductService';
import { ICategoryService } from '@/lib/factories/interfaces/ICategoryService';
import { networkOptimizedCache } from '@/lib/optimizations/networkOptimizations';

// Cache service instances to prevent recreation
let productServiceInstance: IProductService | null = null;
let categoryServiceInstance: ICategoryService | null = null;

const getProductService = () => {
  if (!productServiceInstance) {
    productServiceInstance = ServiceContainer.getInstance().getServiceFactory().createProductService();
  }
  return productServiceInstance;
};

const getCategoryService = () => {
  if (!categoryServiceInstance) {
    categoryServiceInstance = ServiceContainer.getInstance().getServiceFactory().createCategoryService();
  }
  return categoryServiceInstance;
};

// Optimized product fetcher with network-optimized cache
const fetchProducts = async () => {
  return await networkOptimizedCache.get('products', async () => {
    const productService = getProductService();
    return await productService.getProducts();
  });
};

// Optimized categories fetcher with network-optimized cache
const fetchCategoriesWithSubcategories = async () => {
  return await networkOptimizedCache.get('categories', async () => {
    const categoryService = getCategoryService();
    return await categoryService.getCategoriesWithSubcategories();
  });
};

// Import network-optimized SWR config
import { getOptimizedCacheConfig } from '@/lib/optimizations/networkOptimizations';

// SWR configuration optimized for network conditions
const swrConfig = getOptimizedCacheConfig();

// Optimized hooks with SWR
export function useOptimizedProducts() {
  const { data, error, isLoading, mutate } = useSWR(
    'optimized-products',
    fetchProducts,
    swrConfig
  );

  return {
    products: data || [],
    error,
    loading: isLoading,
    refetch: mutate,
  };
}

export function useOptimizedCategories() {
  const { data, error, isLoading, mutate } = useSWR(
    'optimized-categories',
    fetchCategoriesWithSubcategories,
    swrConfig
  );

  return {
    categories: data || [],
    error,
    loading: isLoading,
    refetch: mutate,
  };
}

// Hook for products by category with optimized filtering
export function useOptimizedProductsByCategory(categoryId: string) {
  const { products, loading: productsLoading, error: productsError } = useOptimizedProducts();
  const { categories, loading: categoriesLoading, error: categoriesError } = useOptimizedCategories();

  const isLoading = productsLoading || categoriesLoading;
  const error = productsError || categoriesError;

  // Get subcategories for this category
  const category = categories.find(cat => cat.id.toString() === categoryId);
  const subcategoryIds = category?.subcategories?.map(sub => sub.id) || [];

  // Filter products efficiently
  const filteredProducts = products.filter(product => 
    product.category_id && (
      product.category_id.toString() === categoryId ||
      subcategoryIds.includes(product.category_id)
    )
  );

  return {
    products: filteredProducts,
    loading: isLoading,
    error,
  };
}

// Hook for best sellers with optimized filtering
export function useOptimizedBestSellers() {
  const { products, loading, error } = useOptimizedProducts();

  const bestSellers = products
    .filter(product => product.is_best_seller)
    .slice(0, 8);

  return {
    bestSellers,
    loading,
    error,
  };
}

// Hook for new products with optimized filtering
export function useOptimizedNewProducts() {
  const { products, loading, error } = useOptimizedProducts();

  const newProducts = products
    .filter(product => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(product.created_at) > thirtyDaysAgo;
    })
    .slice(0, 8);

  return {
    newProducts,
    loading,
    error,
  };
}

// Hook for on-sale products with optimized filtering
export function useOptimizedOnSaleProducts() {
  const { products, loading, error } = useOptimizedProducts();

  const onSaleProducts = products
    .filter(product => product.is_on_sale)
    .slice(0, 8);

  return {
    onSaleProducts,
    loading,
    error,
  };
}
