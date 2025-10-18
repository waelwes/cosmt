import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          name: string;
          brand: string;
          category: string;
          price: number;
          original_price: number | null;
          stock: number;
          status: 'active' | 'inactive';
          rating: number;
          reviews: number;
          image: string;
          is_best_seller: boolean;
          is_on_sale: boolean;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          brand: string;
          category: string;
          price: number;
          original_price?: number | null;
          stock: number;
          status: 'active' | 'inactive';
          rating?: number;
          reviews?: number;
          image: string;
          is_best_seller?: boolean;
          is_on_sale?: boolean;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          brand?: string;
          category?: string;
          price?: number;
          original_price?: number | null;
          stock?: number;
          status?: 'active' | 'inactive';
          rating?: number;
          reviews?: number;
          image?: string;
          is_best_seller?: boolean;
          is_on_sale?: boolean;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer: string;
          email: string;
          phone: string;
          total: number;
          status: 'pending' | 'processing' | 'completed' | 'cancelled';
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          shipping_status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'returned';
          date: string;
          items: number;
          shipping_address: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer: string;
          email: string;
          phone: string;
          total: number;
          status: 'pending' | 'processing' | 'completed' | 'cancelled';
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          shipping_status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'returned';
          date: string;
          items: number;
          shipping_address: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer?: string;
          email?: string;
          phone?: string;
          total?: number;
          status?: 'pending' | 'processing' | 'completed' | 'cancelled';
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          shipping_status?: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'returned';
          date?: string;
          items?: number;
          shipping_address?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: number;
          name: string;
          email: string;
          phone: string;
          status: 'active' | 'inactive' | 'suspended';
          tier: 'regular' | 'premium' | 'vip';
          total_orders: number;
          total_spent: number;
          last_order: string;
          join_date: string;
          location: string;
          avatar: string;
          rating: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          email: string;
          phone: string;
          status: 'active' | 'inactive' | 'suspended';
          tier: 'regular' | 'premium' | 'vip';
          total_orders?: number;
          total_spent?: number;
          last_order?: string;
          join_date: string;
          location: string;
          avatar: string;
          rating?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          email?: string;
          phone?: string;
          status?: 'active' | 'inactive' | 'suspended';
          tier?: 'regular' | 'premium' | 'vip';
          total_orders?: number;
          total_spent?: number;
          last_order?: string;
          join_date?: string;
          location?: string;
          avatar?: string;
          rating?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
