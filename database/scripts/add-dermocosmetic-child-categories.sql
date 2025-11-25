-- Add missing child categories for Dermocosmetic Personal Care
-- Run this in your Supabase SQL Editor

DO $$
DECLARE
    dermocosmetic_id INTEGER;
BEGIN
    -- Get Dermocosmetic Personal Care category ID
    SELECT id INTO dermocosmetic_id FROM categories WHERE slug = 'dermocosmetic-personal-care';

    IF dermocosmetic_id IS NULL THEN
        RAISE EXCEPTION 'Dermocosmetic Personal Care category not found. Please run the personal care script first.';
    END IF;

    RAISE NOTICE 'Adding child categories to Dermocosmetic Personal Care (ID: %)', dermocosmetic_id;

    -- Insert child categories for Dermocosmetic Personal Care
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Dermocosmetic Face Care', 'dermocosmetic-face-care', 'Professional dermocosmetic facial treatments', dermocosmetic_id, 1),
    ('Dermocosmetic Body Care', 'dermocosmetic-body-care', 'Medical-grade body care products', dermocosmetic_id, 2),
    ('Dermocosmetic Hair Care', 'dermocosmetic-hair-care', 'Professional hair treatment products', dermocosmetic_id, 3),
    ('Dermocosmetic Sun Care', 'dermocosmetic-sun-care', 'Medical sun protection products', dermocosmetic_id, 4),
    ('Dermocosmetic Anti-Aging', 'dermocosmetic-anti-aging', 'Professional anti-aging treatments', dermocosmetic_id, 5),
    ('Dermocosmetic Acne Treatment', 'dermocosmetic-acne-treatment', 'Medical acne treatment products', dermocosmetic_id, 6),
    ('Dermocosmetic Sensitive Skin', 'dermocosmetic-sensitive-skin', 'Products for sensitive and reactive skin', dermocosmetic_id, 7),
    ('Dermocosmetic Men Care', 'dermocosmetic-men-care', 'Professional men''s dermocosmetic products', dermocosmetic_id, 8)
    ON CONFLICT (slug) DO NOTHING;

    RAISE NOTICE 'Dermocosmetic Personal Care child categories added successfully!';
END $$;

-- Verify the insertion
SELECT 
  c1.name as main_category,
  c2.name as subcategory,
  c3.name as child_category
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN categories c3 ON c3.parent_id = c2.id
WHERE c1.slug = 'personal-care' AND c2.slug = 'dermocosmetic-personal-care'
ORDER BY c3.sort_order;

