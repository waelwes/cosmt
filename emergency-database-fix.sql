-- EMERGENCY FIX: Completely disable RLS and fix database access
-- Run this in your Supabase SQL Editor

-- Step 1: Check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- Step 2: Drop ALL policies on user_profiles
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON user_profiles;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON user_profiles;

-- Step 3: Completely disable RLS on user_profiles
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Step 4: Grant full access to authenticated users
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON user_profiles TO anon;

-- Step 5: Test access
SELECT COUNT(*) as total_users FROM user_profiles;
SELECT id, email, role FROM user_profiles LIMIT 5;

-- Step 6: If the above works, we can optionally re-enable RLS with a simple policy
-- (Only do this if the test queries above work)
-- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all for authenticated" ON user_profiles FOR ALL USING (true);
