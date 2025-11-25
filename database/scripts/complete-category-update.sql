-- Complete Category Structure Update Script
-- This script ensures all categories are properly structured and synchronized
-- Run this in your Supabase SQL Editor

-- Step 1: Add missing child categories for Dermocosmetic Personal Care
DO $$
DECLARE
    dermocosmetic_id INTEGER;
BEGIN
    -- Get Dermocosmetic Personal Care category ID
    SELECT id INTO dermocosmetic_id FROM categories WHERE slug = 'dermocosmetic-personal-care';

    IF dermocosmetic_id IS NULL THEN
        RAISE NOTICE 'Dermocosmetic Personal Care category not found. Skipping...';
    ELSE
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
    END IF;
END $$;

-- Step 2: Update Hair Care structure with additional subcategories
DO $$
DECLARE
    hair_care_id INTEGER;
    hair_treatment_id INTEGER;
    hair_styling_id INTEGER;
    hair_accessories_id INTEGER;
BEGIN
    -- Get Hair Care category ID
    SELECT id INTO hair_care_id FROM categories WHERE slug = 'hair-care';

    IF hair_care_id IS NULL THEN
        RAISE NOTICE 'Hair Care category not found. Skipping...';
    ELSE
        RAISE NOTICE 'Updating Hair Care structure (ID: %)', hair_care_id;

        -- Add new subcategories if they don't exist
        INSERT INTO categories (name, slug, description, parent_id, sort_order)
        VALUES ('Hair Treatment', 'hair-treatment', 'Professional hair treatments and serums', hair_care_id, 4)
        ON CONFLICT (slug) DO UPDATE SET parent_id = hair_care_id
        RETURNING id INTO hair_treatment_id;

        INSERT INTO categories (name, slug, description, parent_id, sort_order)
        VALUES ('Hair Styling', 'hair-styling', 'Hair styling products and tools', hair_care_id, 5)
        ON CONFLICT (slug) DO UPDATE SET parent_id = hair_care_id
        RETURNING id INTO hair_styling_id;

        INSERT INTO categories (name, slug, description, parent_id, sort_order)
        VALUES ('Hair Accessories', 'hair-accessories', 'Hair accessories and tools', hair_care_id, 6)
        ON CONFLICT (slug) DO UPDATE SET parent_id = hair_care_id
        RETURNING id INTO hair_accessories_id;

        -- Add child categories for existing subcategories
        -- Shampoo children
        INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
        ('Color Protection', 'shampoo-color-protection', 'Color-safe shampoo', (SELECT id FROM categories WHERE slug = 'shampoo'), 4),
        ('Repair', 'shampoo-repair', 'Repair shampoo', (SELECT id FROM categories WHERE slug = 'shampoo'), 5)
        ON CONFLICT (slug) DO NOTHING;

        -- Conditioner children
        INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
        ('Color Protection', 'conditioner-color-protection', 'Color-safe conditioner', (SELECT id FROM categories WHERE slug = 'conditioner'), 4),
        ('Volumizing', 'conditioner-volumizing', 'Volumizing conditioner', (SELECT id FROM categories WHERE slug = 'conditioner'), 5)
        ON CONFLICT (slug) DO NOTHING;

        -- Hair Mask children
        INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
        ('Repair', 'hair-mask-repair', 'Repair hair mask', (SELECT id FROM categories WHERE slug = 'hair-mask'), 4),
        ('Color Protection', 'hair-mask-color-protection', 'Color-safe hair mask', (SELECT id FROM categories WHERE slug = 'hair-mask'), 5)
        ON CONFLICT (slug) DO NOTHING;

        -- Hair Treatment children
        INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
        ('Hair Serum', 'hair-serum', 'Hair treatment serums', hair_treatment_id, 1),
        ('Hair Oil', 'hair-oil', 'Hair treatment oils', hair_treatment_id, 2),
        ('Scalp Treatment', 'scalp-treatment', 'Scalp care products', hair_treatment_id, 3),
        ('Hair Growth', 'hair-growth', 'Hair growth treatments', hair_treatment_id, 4)
        ON CONFLICT (slug) DO NOTHING;

        -- Hair Styling children
        INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
        ('Hair Gel', 'hair-gel', 'Hair styling gel', hair_styling_id, 1),
        ('Hair Spray', 'hair-spray', 'Hair styling spray', hair_styling_id, 2),
        ('Hair Wax', 'hair-wax', 'Hair styling wax', hair_styling_id, 3),
        ('Hair Mousse', 'hair-mousse', 'Hair styling mousse', hair_styling_id, 4),
        ('Heat Protection', 'heat-protection', 'Heat protection products', hair_styling_id, 5)
        ON CONFLICT (slug) DO NOTHING;

        -- Hair Accessories children
        INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
        ('Hair Brushes', 'hair-brushes', 'Hair brushes and combs', hair_accessories_id, 1),
        ('Hair Clips', 'hair-clips', 'Hair clips and pins', hair_accessories_id, 2),
        ('Hair Bands', 'hair-bands', 'Hair bands and ties', hair_accessories_id, 3),
        ('Hair Dryers', 'hair-dryers', 'Hair dryers and tools', hair_accessories_id, 4)
        ON CONFLICT (slug) DO NOTHING;

        RAISE NOTICE 'Hair Care structure updated successfully!';
    END IF;
END $$;

-- Step 3: Verify the complete structure
SELECT '=== PERSONAL CARE STRUCTURE ===' as info;
SELECT 
  c1.name as main_category,
  c2.name as subcategory,
  c3.name as child_category
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN categories c3 ON c3.parent_id = c2.id
WHERE c1.slug = 'personal-care'
ORDER BY c2.sort_order, c3.sort_order;

SELECT '=== HAIR CARE STRUCTURE ===' as info;
SELECT 
  c1.name as main_category,
  c2.name as subcategory,
  c3.name as child_category
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN categories c3 ON c3.parent_id = c2.id
WHERE c1.slug = 'hair-care'
ORDER BY c2.sort_order, c3.sort_order;

-- Step 4: Summary
SELECT '=== SUMMARY ===' as info;
SELECT 
  'Personal Care' as category,
  COUNT(DISTINCT c2.id) as subcategories,
  COUNT(c3.id) as child_categories
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN categories c3 ON c3.parent_id = c2.id
WHERE c1.slug = 'personal-care'

UNION ALL

SELECT 
  'Hair Care' as category,
  COUNT(DISTINCT c2.id) as subcategories,
  COUNT(c3.id) as child_categories
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN categories c3 ON c3.parent_id = c2.id
WHERE c1.slug = 'hair-care';

