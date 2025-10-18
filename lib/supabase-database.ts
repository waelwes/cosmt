import { supabase } from './supabase';
import { Database } from './supabase';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];

type Customer = Database['public']['Tables']['customers']['Row'];
type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
type CustomerUpdate = Database['public']['Tables']['customers']['Update'];

// Helper function to transform database row to our interface
const transformProduct = (row: Product) => ({
  id: row.id,
  name: row.name,
  brand: row.brand,
  category: row.category,
  price: row.price,
  originalPrice: row.original_price,
  stock: row.stock,
  status: row.status,
  rating: row.rating,
  reviews: row.reviews,
  image: row.image,
  isBestSeller: row.is_best_seller,
  isOnSale: row.is_on_sale,
  description: row.description,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at)
});

const transformOrder = (row: Order) => ({
  id: row.id,
  customer: row.customer,
  email: row.email,
  phone: row.phone,
  total: row.total,
  status: row.status,
  paymentStatus: row.payment_status,
  shippingStatus: row.shipping_status,
  date: row.date,
  items: row.items,
  shippingAddress: row.shipping_address,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at)
});

const transformCustomer = (row: Customer) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  status: row.status,
  tier: row.tier,
  totalOrders: row.total_orders,
  totalSpent: row.total_spent,
  lastOrder: row.last_order,
  joinDate: row.join_date,
  location: row.location,
  avatar: row.avatar,
  rating: row.rating,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at)
});

// Supabase Database Service
class SupabaseDatabase {
  // Products CRUD
  async getProducts(filters?: {
    search?: string;
    category?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Product[]> {
    let query = supabase.from('products').select('*');

    // Apply filters
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,category.ilike.%${filters.search}%`);
    }

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'name';
    const sortOrder = filters?.sortOrder || 'asc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }

    return data?.map(transformProduct) || [];
  }

  async getProduct(id: number): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product');
    }

    return data ? transformProduct(data) : null;
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const insertData: ProductInsert = {
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      original_price: product.originalPrice,
      stock: product.stock,
      status: product.status,
      rating: product.rating,
      reviews: product.reviews,
      image: product.image,
      is_best_seller: product.isBestSeller,
      is_on_sale: product.isOnSale,
      description: product.description
    };

    const { data, error } = await supabase
      .from('products')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }

    return transformProduct(data);
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
    const updateData: ProductUpdate = {};

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.brand !== undefined) updateData.brand = updates.brand;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.originalPrice !== undefined) updateData.original_price = updates.originalPrice;
    if (updates.stock !== undefined) updateData.stock = updates.stock;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.rating !== undefined) updateData.rating = updates.rating;
    if (updates.reviews !== undefined) updateData.reviews = updates.reviews;
    if (updates.image !== undefined) updateData.image = updates.image;
    if (updates.isBestSeller !== undefined) updateData.is_best_seller = updates.isBestSeller;
    if (updates.isOnSale !== undefined) updateData.is_on_sale = updates.isOnSale;
    if (updates.description !== undefined) updateData.description = updates.description;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }

    return data ? transformProduct(data) : null;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }

    return true;
  }

  // Orders CRUD
  async getOrders(filters?: {
    search?: string;
    status?: string;
    dateRange?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Order[]> {
    let query = supabase.from('orders').select('*');

    // Apply filters
    if (filters?.search) {
      query = query.or(`customer.ilike.%${filters.search}%,email.ilike.%${filters.search}%,id.ilike.%${filters.search}%`);
    }

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        default:
          startDate = new Date(0);
      }

      query = query.gte('date', startDate.toISOString().split('T')[0]);
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'date';
    const sortOrder = filters?.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to fetch orders');
    }

    return data?.map(transformOrder) || [];
  }

  async getOrder(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error fetching order:', error);
      throw new Error('Failed to fetch order');
    }

    return data ? transformOrder(data) : null;
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const insertData: OrderInsert = {
      customer: order.customer,
      email: order.email,
      phone: order.phone,
      total: order.total,
      status: order.status,
      payment_status: order.paymentStatus,
      shipping_status: order.shippingStatus,
      date: order.date,
      items: order.items,
      shipping_address: order.shippingAddress
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }

    return transformOrder(data);
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    const updateData: OrderUpdate = {};

    if (updates.customer !== undefined) updateData.customer = updates.customer;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.total !== undefined) updateData.total = updates.total;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.paymentStatus !== undefined) updateData.payment_status = updates.paymentStatus;
    if (updates.shippingStatus !== undefined) updateData.shipping_status = updates.shippingStatus;
    if (updates.date !== undefined) updateData.date = updates.date;
    if (updates.items !== undefined) updateData.items = updates.items;
    if (updates.shippingAddress !== undefined) updateData.shipping_address = updates.shippingAddress;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error updating order:', error);
      throw new Error('Failed to update order');
    }

    return data ? transformOrder(data) : null;
  }

  async deleteOrder(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting order:', error);
      throw new Error('Failed to delete order');
    }

    return true;
  }

  // Customers CRUD
  async getCustomers(filters?: {
    search?: string;
    status?: string;
    tier?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Customer[]> {
    let query = supabase.from('customers').select('*');

    // Apply filters
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
    }

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.tier && filters.tier !== 'all') {
      query = query.eq('tier', filters.tier);
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'name';
    const sortOrder = filters?.sortOrder || 'asc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching customers:', error);
      throw new Error('Failed to fetch customers');
    }

    return data?.map(transformCustomer) || [];
  }

  async getCustomer(id: number): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error fetching customer:', error);
      throw new Error('Failed to fetch customer');
    }

    return data ? transformCustomer(data) : null;
  }

  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const insertData: CustomerInsert = {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
      tier: customer.tier,
      total_orders: customer.totalOrders,
      total_spent: customer.totalSpent,
      last_order: customer.lastOrder,
      join_date: customer.joinDate,
      location: customer.location,
      avatar: customer.avatar,
      rating: customer.rating
    };

    const { data, error } = await supabase
      .from('customers')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating customer:', error);
      throw new Error('Failed to create customer');
    }

    return transformCustomer(data);
  }

  async updateCustomer(id: number, updates: Partial<Customer>): Promise<Customer | null> {
    const updateData: CustomerUpdate = {};

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.tier !== undefined) updateData.tier = updates.tier;
    if (updates.totalOrders !== undefined) updateData.total_orders = updates.totalOrders;
    if (updates.totalSpent !== undefined) updateData.total_spent = updates.totalSpent;
    if (updates.lastOrder !== undefined) updateData.last_order = updates.lastOrder;
    if (updates.joinDate !== undefined) updateData.join_date = updates.joinDate;
    if (updates.location !== undefined) updateData.location = updates.location;
    if (updates.avatar !== undefined) updateData.avatar = updates.avatar;
    if (updates.rating !== undefined) updateData.rating = updates.rating;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error updating customer:', error);
      throw new Error('Failed to update customer');
    }

    return data ? transformCustomer(data) : null;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting customer:', error);
      throw new Error('Failed to delete customer');
    }

    return true;
  }
}

export const supabaseDb = new SupabaseDatabase();
