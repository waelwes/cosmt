-- Activate All Main Categories
-- This script ensures all existing main categories are set to is_active = true
-- Run this in your Supabase SQL Editor

-- Update all main categories (parent_id IS NULL) to be active
UPDATE categories 
SET is_active = true 
WHERE parent_id IS NULL;

-- Also ensure specific main categories are active
UPDATE categories 
SET is_active = true, parent_id = NULL
WHERE slug IN (
    'hair-care',
    'skin-care',
    'makeup',
    'fragrance',
    'personal-care',
    'mother-baby',
    'brands',
    'discover',
    'electronic'
);

-- Verify the update
SELECT 
    id,
    name,
    slug,
    is_active,
    parent_id,
    sort_order
FROM categories 
WHERE parent_id IS NULL
ORDER BY sort_order;

-- Check specifically for hair-care
SELECT 
    id,
    name,
    slug,
    is_active,
    parent_id
FROM categories 
WHERE slug = 'hair-care';

