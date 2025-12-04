import { createClient } from '@supabase/supabase-js';
import { IProductService } from '../interfaces/IProductService';
import { Product } from '../../types/Product';
import { requestDeduplicator } from '../../utils/requestDeduplication';

export class SupabaseProductService implements IProductService {
  private supabase;

  constructor() {
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Missing Supabase environment variables');
      console.error('Please run: node create-env-file.js');
      throw new Error('Missing Supabase environment variables');
    }

    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }

  private checkSupabaseConnection(): void {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }
  }

  async getProducts(): Promise<Product[]> {
    this.checkSupabaseConnection();

    // Use request deduplication to prevent multiple simultaneous calls
    return await requestDeduplicator.deduplicate('getProducts', async () => {
      try {
        console.log('🔍 ProductService: getProducts - Starting...');
        // Step 1: fetch products with optimized query and limiting
        const { data: products, error: productsError } = await this.supabase
          .from('products')
          .select(`
          id, name, brand, price, original_price, stock, status,
          rating, reviews, image, is_best_seller, is_on_sale, description,
          category_id, child_category_id,
          categories!products_category_id_fkey(id, name, slug, parent_id),
          child_categories:categories!products_child_category_id_fkey(id, name, slug, parent_id),
          created_at, updated_at
        `)
          .eq('status', 'active')
          .order('name')
          .limit(100); // Limit to prevent fetching too many products

        console.log('🔍 ProductService: Query result - products:', products?.length, 'error:', productsError);

        if (productsError) {
          console.error('❌ Error fetching products (Full Object):', JSON.stringify(productsError, null, 2));
          console.error('❌ Error details:', {
            message: (productsError as any).message,
            details: (productsError as any).details,
            hint: (productsError as any).hint,
            code: (productsError as any).code
          });
          return [];
        }

        if (!products) {
          console.warn('⚠️ No products returned and no error reported from Supabase.');
        }

        const baseProducts = products || [];
        console.log('🔍 ProductService: Raw products count:', baseProducts.length);

        console.log('🔍 ProductService: Returning', baseProducts.length, 'products');
        return baseProducts as any;
      } catch (error) {
        console.error('❌ Exception in getProducts:', error);
        return [];
      }
    });
  }

  async getProductById(id: number): Promise<Product | null> {
    this.checkSupabaseConnection();

    try {
      // Fetch base product
      const { data: product, error: productError } = await this.supabase
        .from('products')
        .select(`
          id, name, brand, price, original_price, stock, status,
          rating, reviews, image, is_best_seller, is_on_sale, description,
          category_id, child_category_id,
          categories!products_category_id_fkey(id, name, slug, parent_id),
          child_categories:categories!products_child_category_id_fkey(id, name, slug, parent_id),
          created_at, updated_at
        `)
        .eq('id', id)
        .eq('status', 'active')
        .single();

      if (productError) {
        console.error('❌ Error fetching product by ID:', productError);
        return null;
      }

      if (!product) return null;

      return product as any;
    } catch (error) {
      console.error('❌ Exception in getProductById:', error);
      return null;
    }
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    this.checkSupabaseConnection();

    try {
      const { data: products, error } = await this.supabase
        .from('products')
        .select(`
          id, name, brand, price, original_price, stock, status,
          rating, reviews, image, is_best_seller, is_on_sale, description,
          category_id, child_category_id,
          categories!products_category_id_fkey(id, name, slug, parent_id),
          child_categories:categories!products_child_category_id_fkey(id, name, slug, parent_id),
          created_at, updated_at
        `)
        .eq('category_id', categoryId)
        .eq('status', 'active')
        .order('name');

      if (error) {
        console.error('❌ Error fetching products by category:', error);
        return [];
      }

      return products || [];
    } catch (error) {
      console.error('❌ Exception in getProductsByCategory:', error);
      return [];
    }
  }

  async getProductsBySubcategory(subcategoryId: number): Promise<Product[]> {
    this.checkSupabaseConnection();

    try {
      const { data: products, error } = await this.supabase
        .from('products')
        .select(`
          id, name, brand, price, original_price, stock, status,
          rating, reviews, image, is_best_seller, is_on_sale, description,
          category_id, child_category_id,
          categories!products_category_id_fkey(id, name, slug, parent_id),
          child_categories:categories!products_child_category_id_fkey(id, name, slug, parent_id),
          created_at, updated_at
        `)
        .eq('category_id', subcategoryId)
        .eq('status', 'active')
        .order('name');

      if (error) {
        console.error('❌ Error fetching products by subcategory:', error);
        return [];
      }

      return products || [];
    } catch (error) {
      console.error('❌ Exception in getProductsBySubcategory:', error);
      return [];
    }
  }

  async getProductsByCategories(categoryIds: number[]): Promise<Product[]> {
    this.checkSupabaseConnection();

    try {
      const { data: products, error } = await this.supabase
        .from('products')
        .select(`
          id, name, brand, price, original_price, stock, status,
          rating, reviews, image, is_best_seller, is_on_sale, description,
          category_id, child_category_id,
          categories!products_category_id_fkey(id, name, slug, parent_id),
          child_categories:categories!products_child_category_id_fkey(id, name, slug, parent_id),
          created_at, updated_at
        `)
        .in('category_id', categoryIds)
        .eq('status', 'active')
        .order('name');

      if (error) {
        console.error('❌ Error fetching products by categories:', error);
        return [];
      }

      return products || [];
    } catch (error) {
      console.error('❌ Exception in getProductsByCategories:', error);
      return [];
    }
  }

  async updateProduct(id: number, data: Partial<Product>): Promise<Product | null> {
    this.checkSupabaseConnection();

    try {
      const { data: updatedProduct, error } = await this.supabase
        .from('products')
        .update({
          name: data.name,
          brand: data.brand,
          price: data.price,
          original_price: data.original_price,
          description: data.description,
          image: data.image,
          stock: data.stock,
          status: data.status,
          category_id: data.category_id,
          is_best_seller: data.is_best_seller,
          is_on_sale: data.is_on_sale,
          rating: data.rating,
          reviews: data.reviews,
          sku: data.sku,
          tags: data.tags,
          weight: data.weight,
          dimensions: data.dimensions,
          meta_title: data.meta_title,
          meta_description: data.meta_description,
          meta_keywords: data.meta_keywords,
          low_stock_threshold: data.low_stock_threshold,
          manage_stock: data.manage_stock,
          enable_variants: data.enable_variants,
          variants: data.variants,
          related_products: data.related_products,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          id, name, brand, price, original_price, stock, status,
          rating, reviews, image, is_best_seller, is_on_sale, description,
          category_id, child_category_id,
          categories!products_category_id_fkey(id, name, slug, parent_id),
          child_categories:categories!products_child_category_id_fkey(id, name, slug, parent_id),
          created_at, updated_at
        `)
        .single();

      if (error) {
        console.error('❌ Error updating product:', error);
        return null;
      }

      return updatedProduct;
    } catch (error) {
      console.error('❌ Exception in updateProduct:', error);
      return null;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    this.checkSupabaseConnection();

    try {
      const { error } = await this.supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting product:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Exception in deleteProduct:', error);
      return false;
    }
  }
}
