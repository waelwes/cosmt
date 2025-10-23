import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/types/Product';
import { ServiceContainer } from '@/lib/di/ServiceContainer';
import { IProductService } from '@/lib/factories/interfaces/IProductService';
import { networkOptimizedCache } from '@/lib/optimizations/networkOptimizations';

interface UseInfiniteProductsOptions {
  pageSize?: number;
  categoryId?: number;
  searchQuery?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  enabled?: boolean;
}

interface UseInfiniteProductsReturn {
  products: Product[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export function useInfiniteProducts(options: UseInfiniteProductsOptions = {}): UseInfiniteProductsReturn {
  const {
    pageSize = 20,
    categoryId,
    searchQuery,
    sortBy = 'name',
    sortOrder = 'asc',
    enabled = true
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const productService = ServiceContainer.getInstance().getServiceFactory().createProductService();

  // Generate cache key based on filters
  const getCacheKey = useCallback((page: number) => {
    const filters = {
      page,
      pageSize,
      categoryId,
      searchQuery,
      sortBy,
      sortOrder
    };
    return `products-page-${page}-${JSON.stringify(filters)}`;
  }, [pageSize, categoryId, searchQuery, sortBy, sortOrder]);

  // Fetch products for a specific page
  const fetchProducts = useCallback(async (page: number, append: boolean = false) => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const cacheKey = getCacheKey(page);
      
      const result = await networkOptimizedCache.get(cacheKey, async () => {
        console.log(`🔄 Fetching products page ${page}...`);
        
        // Use the product service to get paginated products
        const response = await productService.getProducts({
          page,
          limit: pageSize,
          categoryId,
          searchQuery,
          sortBy,
          sortOrder
        });

        return response;
      });

      if (append) {
        setProducts(prev => [...prev, ...result.products]);
      } else {
        setProducts(result.products);
      }

      setTotalCount(result.total);
      setHasMore(page < result.totalPages);
      setCurrentPage(page);

      console.log(`✅ Loaded ${result.products.length} products (page ${page}/${result.totalPages})`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch products');
      setError(error);
      console.error('❌ Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [enabled, getCacheKey, pageSize, categoryId, searchQuery, sortBy, sortOrder, productService]);

  // Load more products
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchProducts(currentPage + 1, true);
    }
  }, [loading, hasMore, currentPage, fetchProducts]);

  // Refresh all products
  const refresh = useCallback(() => {
    setProducts([]);
    setCurrentPage(0);
    setHasMore(true);
    setError(null);
    fetchProducts(1, false);
  }, [fetchProducts]);

  // Load initial products
  useEffect(() => {
    if (enabled) {
      refresh();
    }
  }, [enabled, refresh]);

  // Reset when filters change
  useEffect(() => {
    if (enabled) {
      refresh();
    }
  }, [categoryId, searchQuery, sortBy, sortOrder, enabled, refresh]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    products,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    totalCount,
    currentPage,
    totalPages
  };
}

// Hook for infinite scroll with intersection observer
export function useInfiniteScroll(
  loadMore: () => void,
  hasMore: boolean,
  loading: boolean,
  threshold: number = 0.1
) {
  const [sentinelRef, setSentinelRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        threshold,
        rootMargin: '100px' // Start loading 100px before the sentinel comes into view
      }
    );

    observer.observe(sentinelRef);

    return () => {
      observer.disconnect();
    };
  }, [sentinelRef, hasMore, loading, loadMore, threshold]);

  return setSentinelRef;
}
