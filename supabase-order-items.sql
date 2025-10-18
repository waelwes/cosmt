-- COSMT Order Items Table
-- Run this in your Supabase SQL Editor to add order items functionality

-- First, update orders table to include customer_id
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_id VARCHAR(255);

-- Create index for customer_id
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);

-- Update the orders RLS policy to use both customer_id and customer fields
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (
  customer_id = auth.uid()::text OR customer = auth.uid()::text
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  product_image VARCHAR(500) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Enable RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Order Items Policies (after customer_id column exists)
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.customer_id = auth.uid()::text OR orders.customer = auth.uid()::text)
  )
);

CREATE POLICY "Admins can manage all order items" ON order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);