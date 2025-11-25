import { supabase } from './supabase';
import { Database } from './supabase';
// import { measureAsync } from '../utils/performance';

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
  subcategory: row.subcategory,
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
  updatedAt: new Date(row.updated_at),
  // Add new fields
  sku: (row as any).sku,
  tags: (row as any).tags,
  weight: (row as any).weight,
  dimensions: (row as any).dimensions,
  metaTitle: (row as any).meta_title,
  metaDescription: (row as any).meta_description,
  metaKeywords: (row as any).meta_keywords,
  lowStockThreshold: (row as any).low_stock_threshold,
  manageStock: (row as any).manage_stock,
  enableVariants: (row as any).enable_variants,
  variants: (row as any).variants,
  relatedProducts: (row as any).related_products,
  images: (row as any).images || []
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
    subcategory?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
    return (async () => {
      console.log('🔍 Database: getProducts query', filters);
      console.log('🗄️ Database query starting with filters:', filters);
      const startTime = Date.now();

      // Add timeout for queries (10 seconds max - increased from 5)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Query timeout after 10 seconds')), 10000)
      );
    
    const page = filters?.page || 1;
    const limit = filters?.limit || 20; // Default to 20 products per page
    const offset = (page - 1) * limit;
    
    // First get total count
    let countQuery = supabase.from('products').select('*', { count: 'exact', head: true });
    
    // Apply filters to count query
    if (filters?.search) {
      countQuery = countQuery.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,category.ilike.%${filters.search}%`);
    }
    if (filters?.category && filters.category !== 'all') {
      countQuery = countQuery.ilike('category', filters.category);
    }
    if (filters?.subcategory && filters.subcategory !== 'all') {
      countQuery = countQuery.eq('subcategory', filters.subcategory);
    }
    if (filters?.status && filters.status !== 'all') {
      countQuery = countQuery.eq('status', filters.status);
    }
    
    const { count, error: countError } = await countQuery;
    
    if (countError) {
      console.error('❌ Count query error:', countError);
      throw new Error('Failed to count products');
    }
    
    const total = count || 0;
    const totalPages = Math.ceil(total / limit);
    
    // Now get the actual products with pagination - only select needed columns
    let query = supabase.from('products').select(`
      id,
      name,
      brand,
      category,
      price,
      original_price,
      stock,
      status,
      rating,
      reviews,
      image,
      is_best_seller,
      is_on_sale,
      description,
      created_at,
      updated_at,
      sku,
      tags,
      weight,
      dimensions,
      meta_title,
      meta_description,
      meta_keywords,
      low_stock_threshold,
      manage_stock,
      enable_variants,
      variants,
      related_products,
      images
    `).range(offset, offset + limit - 1);

    // Apply filters
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,category.ilike.%${filters.search}%`);
    }

    if (filters?.category && filters.category !== 'all') {
      query = query.ilike('category', filters.category);
    }

    if (filters?.subcategory && filters.subcategory !== 'all') {
      query = query.eq('subcategory', filters.subcategory);
    }

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'name';
    const sortOrder = filters?.sortOrder || 'asc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Execute query with timeout
    try {
      const { data, error } = await Promise.race([query, timeoutPromise]) as any;
    
      const queryTime = Date.now() - startTime;
      console.log(`⏱️ Database query completed in ${queryTime}ms`);
      console.log('📊 Products found:', data?.length || 0);

      if (error) {
        console.error('❌ Database error:', error);
        throw new Error('Failed to fetch products');
      }

      const transformedProducts = data?.map(transformProduct) || [];
      console.log('✅ Transformed products:', transformedProducts.length);
      console.log('✅ First product sample:', transformedProducts[0]);
      console.log(`📄 Page ${page} of ${totalPages} (${total} total products)`);
      
      return {
        products: transformedProducts,
        total,
        page,
        totalPages
      };
    } catch (timeoutError) {
      console.error('❌ Query timeout:', timeoutError);
      throw new Error('Database query timed out. Please try again.');
    }
    });
  }

  async getProduct(id: number): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        brand,
        category,
        price,
        original_price,
        stock,
        status,
        rating,
        reviews,
        image,
        is_best_seller,
        is_on_sale,
        description,
        created_at,
        updated_at,
        sku,
        tags,
        weight,
        dimensions,
        meta_title,
        meta_description,
        meta_keywords,
        low_stock_threshold,
        manage_stock,
        enable_variants,
        variants,
        related_products,
        images
      `)
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
      subcategory: product.subcategory,
      price: product.price,
      original_price: product.originalPrice,
      stock: product.stock,
      status: product.status,
      rating: product.rating,
      reviews: product.reviews,
      image: product.image,
      is_best_seller: product.isBestSeller,
      is_on_sale: product.isOnSale,
      description: product.description,
      // Add new fields
      sku: (product as any).sku,
      tags: (product as any).tags,
      weight: (product as any).weight,
      dimensions: (product as any).dimensions,
      meta_title: (product as any).metaTitle,
      meta_description: (product as any).metaDescription,
      meta_keywords: (product as any).metaKeywords,
      low_stock_threshold: (product as any).lowStockThreshold,
      manage_stock: (product as any).manageStock,
      enable_variants: (product as any).enableVariants,
      variants: (product as any).variants,
      related_products: (product as any).relatedProducts,
      images: (product as any).images || []
    };
    
    // Base64 images are now properly handled with TEXT column

    const { data, error } = await supabase
      .from('products')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating product:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Database error: ${error.message}`);
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
