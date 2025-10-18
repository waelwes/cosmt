-- COSMT E-commerce Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension for user IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'moderator')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
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

-- Orders Table
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

-- Customers Table
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

-- Insert sample data
INSERT INTO products (name, brand, category, price, original_price, stock, status, rating, reviews, image, is_best_seller, is_on_sale, description) VALUES
('Hair Mask - Deep Conditioning', 'COSMT', 'Hair Care', 89.99, 119.99, 45, 'active', 4.8, 124, '/api/placeholder/300/300', true, true, 'Deep conditioning hair mask for all hair types'),
('Vitamin C Serum', 'COSMT', 'Skincare', 65.50, NULL, 78, 'active', 4.6, 89, '/api/placeholder/300/300', false, false, 'Brightening vitamin C serum for radiant skin'),
('Moisturizing Cream', 'COSMT', 'Skincare', 42.00, 55.00, 0, 'inactive', 4.2, 67, '/api/placeholder/300/300', false, true, 'Hydrating moisturizer for dry skin'),
('Anti-Aging Night Cream', 'COSMT', 'Skincare', 95.00, 120.00, 23, 'active', 4.9, 156, '/api/placeholder/300/300', true, true, 'Advanced anti-aging night cream with retinol'),
('Hair Shampoo - Volumizing', 'COSMT', 'Hair Care', 35.75, NULL, 67, 'active', 4.3, 89, '/api/placeholder/300/300', false, false, 'Volumizing shampoo for fine hair');

INSERT INTO orders (id, customer, email, phone, total, status, payment_status, shipping_status, date, items, shipping_address) VALUES
('ORD-001', 'Ahmet Yılmaz', 'ahmet@example.com', '+90 555 123 4567', 89.99, 'completed', 'paid', 'delivered', '2024-01-15', 2, 'İstanbul, Turkey'),
('ORD-002', 'Ayşe Demir', 'ayse@example.com', '+90 555 234 5678', 125.50, 'processing', 'paid', 'preparing', '2024-01-14', 3, 'Ankara, Turkey'),
('ORD-003', 'Mehmet Kaya', 'mehmet@example.com', '+90 555 345 6789', 67.25, 'pending', 'pending', 'pending', '2024-01-16', 1, 'İzmir, Turkey'),
('ORD-004', 'Fatma Öz', 'fatma@example.com', '+90 555 456 7890', 234.75, 'completed', 'paid', 'delivered', '2024-01-13', 4, 'Bursa, Turkey');

INSERT INTO customers (name, email, phone, status, tier, total_orders, total_spent, last_order, join_date, location, avatar, rating) VALUES
('Ahmet Yılmaz', 'ahmet@example.com', '+90 555 123 4567', 'active', 'premium', 12, 1250.50, '2024-01-15', '2023-06-15', 'İstanbul, Turkey', '/api/placeholder/40/40', 4.8),
('Ayşe Demir', 'ayse@example.com', '+90 555 234 5678', 'active', 'regular', 8, 456.75, '2024-01-14', '2023-08-20', 'Ankara, Turkey', '/api/placeholder/40/40', 4.5),
('Mehmet Kaya', 'mehmet@example.com', '+90 555 345 6789', 'active', 'vip', 25, 2890.25, '2024-01-16', '2023-03-10', 'İzmir, Turkey', '/api/placeholder/40/40', 4.9),
('Fatma Öz', 'fatma@example.com', '+90 555 456 7890', 'inactive', 'regular', 3, 234.75, '2024-01-13', '2023-12-01', 'Bursa, Turkey', '/api/placeholder/40/40', 4.2);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON user_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all profiles" ON user_profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products Policies
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Orders Policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid()::text = customer);
CREATE POLICY "Admins can manage all orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Customers Policies
CREATE POLICY "Admins can manage customers" ON customers FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
