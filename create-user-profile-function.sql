-- Create user profile function for RLS bypass
-- Run this in your Supabase SQL Editor

-- Create the create_user_profile function
CREATE OR REPLACE FUNCTION public.create_user_profile(
  user_id UUID,
  user_email TEXT,
  user_full_name TEXT
)
RETURNS TABLE(
  id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert the user profile
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    role,
    status
  ) VALUES (
    user_id,
    user_email,
    user_full_name,
    'customer',
    'active'
  );
  
  -- Return the created profile
  RETURN QUERY
  SELECT 
    up.id,
    up.email,
    up.full_name,
    up.role,
    up.status,
    up.created_at,
    up.updated_at
  FROM public.user_profiles up
  WHERE up.id = user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_user_profile TO authenticated;