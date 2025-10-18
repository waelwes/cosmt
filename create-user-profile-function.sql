-- Create User Profile Function (bypasses RLS)
-- Run this in your Supabase SQL Editor

-- Create a function that can create user profiles without RLS restrictions
CREATE OR REPLACE FUNCTION create_user_profile(
  user_id UUID,
  user_email TEXT,
  user_full_name TEXT DEFAULT ''
)
RETURNS user_profiles
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to bypass RLS
AS $$
DECLARE
  new_profile user_profiles;
BEGIN
  -- Insert the user profile
  INSERT INTO user_profiles (
    id,
    email,
    full_name,
    avatar_url,
    role,
    status,
    created_at,
    updated_at
  ) VALUES (
    user_id,
    user_email,
    user_full_name,
    '',
    'customer',
    'active',
    NOW(),
    NOW()
  )
  RETURNING * INTO new_profile;
  
  RETURN new_profile;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_user_profile(UUID, TEXT, TEXT) TO authenticated;

-- Test the function
SELECT 'User profile creation function created successfully' as status;
