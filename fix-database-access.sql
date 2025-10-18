-- Comprehensive fix for user_profiles table access
-- Run this in your Supabase SQL Editor

-- First, let's check what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Drop ALL existing policies on user_profiles
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON user_profiles;

-- Disable RLS temporarily
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Create simple, working policies
CREATE POLICY "Allow all operations for authenticated users" ON user_profiles
  FOR ALL USING (auth.role() = 'authenticated');

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Test the table access
SELECT COUNT(*) FROM user_profiles;

-- Check if we can insert a test record (this will fail if there are still issues)
-- INSERT INTO user_profiles (id, email, full_name, role, status) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'test@example.com', 'Test User', 'customer', 'active')
-- ON CONFLICT (id) DO NOTHING;
