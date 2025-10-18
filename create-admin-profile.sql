-- Create Admin Profile Manually
-- Run this in your Supabase SQL Editor

-- First, let's find the user ID for admin@cosmat.com
SELECT id, email FROM auth.users WHERE email = 'admin@cosmat.com';

-- If the user exists, create their profile
-- Replace 'USER_ID_HERE' with the actual user ID from the query above
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  avatar_url,
  role,
  status,
  created_at,
  updated_at
) 
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', 'Admin User'),
  COALESCE(au.raw_user_meta_data->>'avatar_url', ''),
  'admin',
  'active',
  NOW(),
  NOW()
FROM auth.users au
WHERE au.email = 'admin@cosmat.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  status = 'active',
  updated_at = NOW();

-- Verify the profile was created
SELECT * FROM user_profiles WHERE email = 'admin@cosmat.com';

SELECT 'Admin profile created/updated successfully' as status;
