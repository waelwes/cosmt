import { useState, useEffect } from 'react';
import { ServiceContainer } from '@/lib/di/ServiceContainer';
import { IProductService } from '@/lib/factories/interfaces/IProductService';
import { useOptimizedBestSellers, useOptimizedNewProducts, useOptimizedOnSaleProducts } from './useOptimizedData';
import { ICategoryService } from '@/lib/factories/interfaces/ICategoryService';

// Hook for fetching storefront data
export function useStorefrontData() {
  const { bestSellers, loading: bestSellersLoading, error: bestSellersError } = useOptimizedBestSellers();
  const { newProducts, loading: newProductsLoading, error: newProductsError } = useOptimizedNewProducts();
  const { onSaleProducts, loading: onSaleProductsLoading, error: onSaleProductsError } = useOptimizedOnSaleProducts();

  const loading = bestSellersLoading || newProductsLoading || onSaleProductsLoading;
  const error = bestSellersError || newProductsError || onSaleProductsError;

  return {
    bestSellers,
    newProducts,
    onSaleProducts,
    loading,
    error,
    refetch: () => {
      // The optimized hooks handle refetching automatically
      console.log('Refetch triggered - handled by optimized hooks');
    }
  };
}

// Hook for fetching a single product
export function useProduct(id: number) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get product service from container - uses real Supabase data
        const productService: IProductService = ServiceContainer
          .getInstance()
          .getServiceFactory()
          .createProductService();

        const productData = await productService.getProductById(id);
        setProduct(productData);
      } catch (err) {
        console.error('❌ useProduct: Error fetching product:', {
          productId: id,
          error: err,
          errorMessage: err?.message,
          errorStack: err?.stack,
          errorType: typeof err
        });
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error };
}

// Hook for fetching products by category (includes all subcategories)
export function useProductsByCategory(categoryId: string) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get services from container
        const productService: IProductService = ServiceContainer
          .getInstance()
          .getServiceFactory()
          .createProductService();
        
        const categoryService: ICategoryService = ServiceContainer
          .getInstance()
          .getServiceFactory()
          .createCategoryService();

        // Get all subcategories for this category
        const subcategories = await categoryService.getSubcategoriesByCategory(parseInt(categoryId));
        const subcategoryIds = subcategories.map(sub => sub.id);
        
        // Get all products and filter by category_id (including subcategories)
        const allProducts = await productService.getProducts();
        const productsData = allProducts.filter(product => 
          product.category_id && (
            product.category_id.toString() === categoryId ||
            subcategoryIds.includes(product.category_id)
          )
        );
        
        setProducts(productsData);
      } catch (err) {
        console.error('❌ useProductsByCategory: Error fetching products by category:', {
          categoryId,
          error: err,
          errorMessage: err?.message,
          errorStack: err?.stack,
          errorType: typeof err
        });
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId]);

  return { products, loading, error };
}
