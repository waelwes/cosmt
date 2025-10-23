# Supabase Setup Guide

## 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 2. Database Schema

Run these SQL commands in your Supabase SQL editor to create the required tables:

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  stock INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  image VARCHAR(500) NOT NULL,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_on_sale BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_rating ON products(rating);
```

### Orders Table
```sql
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  customer VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  shipping_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (shipping_status IN ('pending', 'preparing', 'shipped', 'delivered', 'returned')),
  date DATE NOT NULL,
  items INTEGER NOT NULL,
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_date ON orders(date);
CREATE INDEX idx_orders_customer ON orders(customer);
```

### Customers Table
```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  tier VARCHAR(20) NOT NULL DEFAULT 'regular' CHECK (tier IN ('regular', 'premium', 'vip')),
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  last_order DATE,
  join_date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  avatar VARCHAR(500) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_tier ON customers(tier);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_rating ON customers(rating);
```

### Sample Data
```sql
-- Insert sample products
INSERT INTO products (name, brand, category, price, original_price, stock, status, rating, reviews, image, is_best_seller, is_on_sale, description) VALUES
('Hair Mask - Deep Conditioning', 'Luxe Beauty', 'Hair Care', 89.99, 119.99, 45, 'active', 4.8, 124, '/api/placeholder/300/300', true, true, 'Deep conditioning hair mask for all hair types'),
('Vitamin C Serum', 'Glow Essentials', 'Skincare', 65.50, NULL, 78, 'active', 4.6, 89, '/api/placeholder/300/300', false, false, 'Brightening vitamin C serum for radiant skin'),
('Moisturizing Cream', 'Pure Care', 'Skincare', 42.00, 55.00, 0, 'inactive', 4.2, 67, '/api/placeholder/300/300', false, true, 'Hydrating moisturizer for dry skin');

-- Insert sample orders
INSERT INTO orders (id, customer, email, phone, total, status, payment_status, shipping_status, date, items, shipping_address) VALUES
('ORD-001', 'Ahmet Yılmaz', 'ahmet@example.com', '+90 555 123 4567', 89.99, 'completed', 'paid', 'delivered', '2024-01-15', 2, 'İstanbul, Turkey'),
('ORD-002', 'Ayşe Demir', 'ayse@example.com', '+90 555 234 5678', 125.50, 'processing', 'paid', 'preparing', '2024-01-14', 3, 'Ankara, Turkey');

-- Insert sample customers
INSERT INTO customers (name, email, phone, status, tier, total_orders, total_spent, last_order, join_date, location, avatar, rating) VALUES
('Ahmet Yılmaz', 'ahmet@example.com', '+90 555 123 4567', 'active', 'premium', 12, 1250.50, '2024-01-15', '2023-06-15', 'İstanbul, Turkey', '/api/placeholder/40/40', 4.8),
('Ayşe Demir', 'ayse@example.com', '+90 555 234 5678', 'active', 'regular', 8, 456.75, '2024-01-14', '2023-08-20', 'Ankara, Turkey', '/api/placeholder/40/40', 4.5);
```

## 3. Row Level Security (RLS)

Enable RLS for better security:

```sql
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your authentication needs)
-- For now, allow all operations (you can restrict this later)
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all operations on customers" ON customers FOR ALL USING (true);
```

## 4. Getting Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select an existing one
3. Go to Settings > API
4. Copy the Project URL and anon public key
5. Add them to your `.env.local` file

## 5. Testing the Connection

After setting up the environment variables and database schema, your admin dashboard will automatically use Supabase instead of mock data.

The API routes will now:
- Fetch data from your Supabase database
- Support real-time updates
- Handle authentication and authorization
- Provide better performance and scalability
