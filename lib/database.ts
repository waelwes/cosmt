// Database configuration and models
// This file will handle database connections and data models

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  status: 'active' | 'inactive';
  rating: number;
  reviews: number;
  image: string;
  isBestSeller: boolean;
  isOnSale: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingStatus: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'returned';
  date: string;
  items: number;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  tier: 'regular' | 'premium' | 'vip';
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  joinDate: string;
  location: string;
  avatar: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock database - In a real app, this would be replaced with actual database calls
class Database {
  private products: Product[] = [
    {
      id: 1,
      name: 'Hair Mask - Deep Conditioning',
      brand: 'COSMT',
      category: 'Hair Care',
      price: 89.99,
      originalPrice: 119.99,
      stock: 45,
      status: 'active',
      rating: 4.8,
      reviews: 124,
      image: '/api/placeholder/300/300',
      isBestSeller: true,
      isOnSale: true,
      description: 'Deep conditioning hair mask for all hair types',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      name: 'Vitamin C Serum',
      brand: 'COSMT',
      category: 'Skincare',
      price: 65.50,
      originalPrice: null,
      stock: 78,
      status: 'active',
      rating: 4.6,
      reviews: 89,
      image: '/api/placeholder/300/300',
      isBestSeller: false,
      isOnSale: false,
      description: 'Brightening vitamin C serum for radiant skin',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: 3,
      name: 'Moisturizing Cream',
      brand: 'COSMT',
      category: 'Skincare',
      price: 42.00,
      originalPrice: 55.00,
      stock: 0,
      status: 'inactive',
      rating: 4.2,
      reviews: 67,
      image: '/api/placeholder/300/300',
      isBestSeller: false,
      isOnSale: true,
      description: 'Hydrating moisturizer for dry skin',
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-12')
    }
  ];

  private orders: Order[] = [
    {
      id: 'ORD-001',
      customer: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      phone: '+90 555 123 4567',
      total: 89.99,
      status: 'completed',
      paymentStatus: 'paid',
      shippingStatus: 'delivered',
      date: '2024-01-15',
      items: 2,
      shippingAddress: 'İstanbul, Turkey',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-16')
    },
    {
      id: 'ORD-002',
      customer: 'Ayşe Demir',
      email: 'ayse@example.com',
      phone: '+90 555 234 5678',
      total: 125.50,
      status: 'processing',
      paymentStatus: 'paid',
      shippingStatus: 'preparing',
      date: '2024-01-14',
      items: 3,
      shippingAddress: 'Ankara, Turkey',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-15')
    }
  ];

  private customers: Customer[] = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      phone: '+90 555 123 4567',
      status: 'active',
      tier: 'premium',
      totalOrders: 12,
      totalSpent: 1250.50,
      lastOrder: '2024-01-15',
      joinDate: '2023-06-15',
      location: 'İstanbul, Turkey',
      avatar: '/api/placeholder/40/40',
      rating: 4.8,
      createdAt: new Date('2023-06-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      name: 'Ayşe Demir',
      email: 'ayse@example.com',
      phone: '+90 555 234 5678',
      status: 'active',
      tier: 'regular',
      totalOrders: 8,
      totalSpent: 456.75,
      lastOrder: '2024-01-14',
      joinDate: '2023-08-20',
      location: 'Ankara, Turkey',
      avatar: '/api/placeholder/40/40',
      rating: 4.5,
      createdAt: new Date('2023-08-20'),
      updatedAt: new Date('2024-01-14')
    }
  ];

  // Products CRUD
  async getProducts(): Promise<Product[]> {
    return [...this.products];
  }

  async getProduct(id: number): Promise<Product | null> {
    return this.products.find(p => p.id === id) || null;
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: Math.max(...this.products.map(p => p.id)) + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.products[index];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.products.splice(index, 1);
    return true;
  }

  // Orders CRUD
  async getOrders(): Promise<Order[]> {
    return [...this.orders];
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.orders.find(o => o.id === id) || null;
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: `ORD-${String(this.orders.length + 1).padStart(3, '0')}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    
    this.orders[index] = {
      ...this.orders[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.orders[index];
  }

  async deleteOrder(id: string): Promise<boolean> {
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) return false;
    
    this.orders.splice(index, 1);
    return true;
  }

  // Customers CRUD
  async getCustomers(): Promise<Customer[]> {
    return [...this.customers];
  }

  async getCustomer(id: number): Promise<Customer | null> {
    return this.customers.find(c => c.id === id) || null;
  }

  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const newCustomer: Customer = {
      ...customer,
      id: Math.max(...this.customers.map(c => c.id)) + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  async updateCustomer(id: number, updates: Partial<Customer>): Promise<Customer | null> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.customers[index] = {
      ...this.customers[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.customers[index];
  }

  async deleteCustomer(id: number): Promise<boolean> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.customers.splice(index, 1);
    return true;
  }
}

export const db = new Database();
