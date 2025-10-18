-- Make a user admin by email
-- Replace 'your-email@example.com' with the actual email you want to make admin

-- First, let's see what users exist
SELECT id, email, role, status FROM user_profiles;

-- Update a specific user to admin role
-- Replace 'your-email@example.com' with your actual email
UPDATE user_profiles 
SET role = 'admin', status = 'active'
WHERE email = 'your-email@example.com';

-- Verify the update
SELECT id, email, role, status FROM user_profiles WHERE email = 'your-email@example.com';
