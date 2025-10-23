import { supabase } from '../../supabase';
import { IConcernService } from '../interfaces/IConcernService';
import { Concern, ProductConcern, ConcernWithProducts } from '../../types/Concern';

export class SupabaseConcernService implements IConcernService {
  private supabaseClient = supabase;

  private checkSupabaseConnection(): void {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }
  }

  async getConcerns(): Promise<Concern[]> {
    this.checkSupabaseConnection();
    
    try {
      console.log('🔍 Fetching all concerns...');
      const { data, error } = await this.supabaseClient
        .from('concerns')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('❌ Error fetching concerns:', error);
        return [];
      }

      console.log('✅ Concerns fetched successfully:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ Exception in getConcerns:', error);
      return [];
    }
  }

  async getConcernsByType(type: string): Promise<Concern[]> {
    this.checkSupabaseConnection();
    
    try {
      console.log(`🔍 Fetching concerns by type: ${type}...`);
      const { data, error } = await this.supabaseClient
        .from('concerns')
        .select('*')
        .eq('type', type)
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('❌ Error fetching concerns by type:', error);
        return [];
      }

      console.log(`✅ Concerns of type ${type} fetched successfully:`, data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ Exception in getConcernsByType:', error);
      return [];
    }
  }

  async getConcernById(id: number): Promise<Concern | null> {
    this.checkSupabaseConnection();
    
    try {
      const { data, error } = await this.supabaseClient
        .from('concerns')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('❌ Error fetching concern by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Exception in getConcernById:', error);
      return null;
    }
  }

  async getConcernBySlug(slug: string): Promise<Concern | null> {
    this.checkSupabaseConnection();
    
    try {
      const { data, error } = await this.supabaseClient
        .from('concerns')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('❌ Error fetching concern by slug:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Exception in getConcernBySlug:', error);
      return null;
    }
  }

  async getProductsByConcern(concernId: number): Promise<any[]> {
    this.checkSupabaseConnection();
    
    try {
      console.log(`🔍 Fetching products for concern ID: ${concernId}...`);
      const { data, error } = await this.supabaseClient
        .from('product_concerns')
        .select(`
          *,
          products (
            *
          )
        `)
        .eq('concern_id', concernId);

      if (error) {
        console.error('❌ Error fetching products by concern:', error);
        return [];
      }

      const products = data?.map(item => item.products).filter(Boolean) || [];
      console.log(`✅ Products for concern ${concernId} fetched successfully:`, products.length);
      return products;
    } catch (error) {
      console.error('❌ Exception in getProductsByConcern:', error);
      return [];
    }
  }

  async getConcernsByProduct(productId: number): Promise<Concern[]> {
    this.checkSupabaseConnection();
    
    try {
      console.log(`🔍 Fetching concerns for product ID: ${productId}...`);
      const { data, error } = await this.supabaseClient
        .from('product_concerns')
        .select(`
          *,
          concerns (
            *
          )
        `)
        .eq('product_id', productId);

      if (error) {
        console.error('❌ Error fetching concerns by product:', error);
        return [];
      }

      const concerns = data?.map(item => item.concerns).filter(Boolean) || [];
      console.log(`✅ Concerns for product ${productId} fetched successfully:`, concerns.length);
      return concerns;
    } catch (error) {
      console.error('❌ Exception in getConcernsByProduct:', error);
      return [];
    }
  }

  async getConcernsWithProducts(): Promise<ConcernWithProducts[]> {
    this.checkSupabaseConnection();
    
    try {
      console.log('🔍 Fetching concerns with products...');
      const concerns = await this.getConcerns();
      const concernsWithProducts: ConcernWithProducts[] = [];

      for (const concern of concerns) {
        const products = await this.getProductsByConcern(concern.id);
        concernsWithProducts.push({
          concern,
          products
        });
      }

      console.log('✅ Concerns with products fetched successfully:', concernsWithProducts.length);
      return concernsWithProducts;
    } catch (error) {
      console.error('❌ Exception in getConcernsWithProducts:', error);
      return [];
    }
  }

  async createConcern(concern: Partial<Concern>): Promise<Concern> {
    this.checkSupabaseConnection();
    
    try {
      const { data, error } = await this.supabaseClient
        .from('concerns')
        .insert(concern)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create concern: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('❌ Exception in createConcern:', error);
      throw error;
    }
  }

  async updateConcern(id: number, concern: Partial<Concern>): Promise<Concern> {
    this.checkSupabaseConnection();
    
    try {
      const { data, error } = await this.supabaseClient
        .from('concerns')
        .update(concern)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update concern: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('❌ Exception in updateConcern:', error);
      throw error;
    }
  }

  async deleteConcern(id: number): Promise<boolean> {
    this.checkSupabaseConnection();
    
    try {
      const { error } = await this.supabaseClient
        .from('concerns')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete concern: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('❌ Exception in deleteConcern:', error);
      throw error;
    }
  }

  async addConcernToProduct(productId: number, concernId: number): Promise<ProductConcern> {
    this.checkSupabaseConnection();
    
    try {
      const { data, error } = await this.supabaseClient
        .from('product_concerns')
        .insert({
          product_id: productId,
          concern_id: concernId
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to add concern to product: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('❌ Exception in addConcernToProduct:', error);
      throw error;
    }
  }

  async removeConcernFromProduct(productId: number, concernId: number): Promise<boolean> {
    this.checkSupabaseConnection();
    
    try {
      const { error } = await this.supabaseClient
        .from('product_concerns')
        .delete()
        .eq('product_id', productId)
        .eq('concern_id', concernId);

      if (error) {
        throw new Error(`Failed to remove concern from product: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('❌ Exception in removeConcernFromProduct:', error);
      throw error;
    }
  }
}
