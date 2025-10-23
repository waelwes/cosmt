-- Fix RLS Policies for COSMT E-commerce
-- Run this in your Supabase SQL Editor to fix the "row violates row-level security policy" error

-- First, check if RLS is enabled on the products table
-- If it's not enabled, enable it
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow all operations on products" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON products;

-- Create comprehensive policies for the products table
-- Allow all operations for now (you can restrict this later based on your needs)

-- Policy 1: Allow all users to read products (for public access)
CREATE POLICY "Enable read access for all users" ON products
    FOR SELECT USING (true);

-- Policy 2: Allow all users to insert products (for admin operations)
CREATE POLICY "Enable insert for all users" ON products
    FOR INSERT WITH CHECK (true);

-- Policy 3: Allow all users to update products (for admin operations)
CREATE POLICY "Enable update for all users" ON products
    FOR UPDATE USING (true);

-- Policy 4: Allow all users to delete products (for admin operations)
CREATE POLICY "Enable delete for all users" ON products
    FOR DELETE USING (true);

-- Also fix RLS for other tables if they exist
-- Orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations on orders" ON orders;
CREATE POLICY "Enable all operations on orders" ON orders FOR ALL USING (true);

-- Customers table
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations on customers" ON customers;
CREATE POLICY "Enable all operations on customers" ON customers FOR ALL USING (true);

-- Categories table (if it exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories') THEN
        ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow all operations on categories" ON categories;
        CREATE POLICY "Enable all operations on categories" ON categories FOR ALL USING (true);
    END IF;
END $$;

-- Subcategories table (if it exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subcategories') THEN
        ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow all operations on subcategories" ON subcategories;
        CREATE POLICY "Enable all operations on subcategories" ON subcategories FOR ALL USING (true);
    END IF;
END $$;

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('products', 'orders', 'customers', 'categories', 'subcategories')
ORDER BY tablename, policyname;
