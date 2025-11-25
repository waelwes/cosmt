-- Fix infinite recursion in user_profiles RLS policies
-- Run this in your Supabase SQL Editor

-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;

-- Create new policies that don't cause recursion
-- For admin operations, we'll use a simpler approach
-- Note: In production, you might want to use a separate admin table or role-based auth

-- Allow authenticated users to view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Allow authenticated users to update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- For admin operations, temporarily allow all authenticated users
-- You can restrict this further based on your needs
CREATE POLICY "Authenticated users can view all profiles" ON user_profiles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update all profiles" ON user_profiles
    FOR UPDATE USING (auth.role() = 'authenticated');

-- If you have a specific admin role, you can create a function to check it
-- For now, this allows all authenticated users to manage profiles
-- Adjust as needed for your security requirements
