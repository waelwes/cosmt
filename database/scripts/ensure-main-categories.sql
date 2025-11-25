-- Ensure Main Categories Exist and Are Active
-- This script creates all main categories if they don't exist
-- Run this in your Supabase SQL Editor

DO $$
BEGIN
    -- Hair Care
    INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active)
    VALUES ('Hair Care', 'hair-care', 'Professional hair care products for all hair types', NULL, 2, true)
    ON CONFLICT (slug) DO UPDATE SET is_active = true, parent_id = NULL;
    
    -- Skin Care
    INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active)
    VALUES ('Skin Care', 'skin-care', 'Complete skin care solutions for all skin types', NULL, 1, true)
    ON CONFLICT (slug) DO UPDATE SET is_active = true, parent_id = NULL;
    
    -- Makeup
    INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active)
    VALUES ('Makeup', 'makeup', 'Professional makeup products for every look', NULL, 3, true)
    ON CONFLICT (slug) DO UPDATE SET is_active = true, parent_id = NULL;
    
    -- Fragrance
    INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active)
    VALUES ('Fragrance', 'fragrance', 'Discover your signature scent with our curated collection of premium fragrances', NULL, 4, true)
    ON CONFLICT (slug) DO UPDATE SET is_active = true, parent_id = NULL;
    
    -- Personal Care
    INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active)
    VALUES ('Personal Care', 'personal-care', 'Essential personal care products for daily hygiene and wellness', NULL, 5, true)
    ON CONFLICT (slug) DO UPDATE SET is_active = true, parent_id = NULL;
    
    -- Mother and Baby
    INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active)
    VALUES ('Mother and Baby', 'mother-baby', 'Gentle and safe products for mothers and babies', NULL, 6, true)
    ON CONFLICT (slug) DO UPDATE SET is_active = true, parent_id = NULL;
    
    -- Brands
    INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active)
    VALUES ('Brands', 'brands', 'Shop by your favorite beauty brands', NULL, 7, true)
    ON CONFLICT (slug) DO UPDATE SET is_active = true, parent_id = NULL;
    
    -- Discover
    INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active)
    VALUES ('Discover', 'discover', 'Discover new and trending beauty products', NULL, 8, true)
    ON CONFLICT (slug) DO UPDATE SET is_active = true, parent_id = NULL;
    
    -- Electronic
    INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active)
    VALUES ('Electronic', 'electronic', 'Beauty and wellness electronic devices', NULL, 9, true)
    ON CONFLICT (slug) DO UPDATE SET is_active = true, parent_id = NULL;
    
    RAISE NOTICE 'Main categories ensured successfully!';
END $$;

-- Verify all main categories exist and are active
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

