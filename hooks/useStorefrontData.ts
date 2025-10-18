import { useState, useEffect } from 'react';
import { supabaseDb } from '@/lib/supabase-database';

// Hook for fetching storefront data
export function useStorefrontData() {
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [onSaleProducts, setOnSaleProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStorefrontData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all products
        const allProducts = await supabaseDb.getProducts({
          status: 'active',
          sortBy: 'created_at',
          sortOrder: 'desc'
        });

        // Filter products for different sections
        const bestSellersData = allProducts
          .filter(product => product.isBestSeller)
          .slice(0, 8);

        const newProductsData = allProducts
          .filter(product => {
            // Consider products created in the last 30 days as "new"
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return new Date(product.createdAt) > thirtyDaysAgo;
          })
          .slice(0, 8);

        const onSaleProductsData = allProducts
          .filter(product => product.isOnSale)
          .slice(0, 8);

        setBestSellers(bestSellersData);
        setNewProducts(newProductsData);
        setOnSaleProducts(onSaleProductsData);
      } catch (err) {
        console.error('Error fetching storefront data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchStorefrontData();
  }, []);

  return {
    bestSellers,
    newProducts,
    onSaleProducts,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      // Re-fetch data
      const fetchStorefrontData = async () => {
        try {
          const allProducts = await supabaseDb.getProducts({
            status: 'active',
            sortBy: 'created_at',
            sortOrder: 'desc'
          });

          const bestSellersData = allProducts
            .filter(product => product.isBestSeller)
            .slice(0, 8);

          const newProductsData = allProducts
            .filter(product => {
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return new Date(product.createdAt) > thirtyDaysAgo;
            })
            .slice(0, 8);

          const onSaleProductsData = allProducts
            .filter(product => product.isOnSale)
            .slice(0, 8);

          setBestSellers(bestSellersData);
          setNewProducts(newProductsData);
          setOnSaleProducts(onSaleProductsData);
        } catch (err) {
          console.error('Error refetching storefront data:', err);
          setError(err instanceof Error ? err.message : 'Failed to load products');
        } finally {
          setLoading(false);
        }
      };
      fetchStorefrontData();
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
        const productData = await supabaseDb.getProduct(id);
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
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

// Hook for fetching products by category
export function useProductsByCategory(category: string) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const productsData = await supabaseDb.getProducts({
          category,
          status: 'active',
          sortBy: 'name',
          sortOrder: 'asc'
        });
        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching products by category:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category]);

  return { products, loading, error };
}
