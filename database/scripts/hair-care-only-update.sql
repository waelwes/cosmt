-- Hair Care Structure Update Only
-- This script only updates Hair Care categories
-- Run this in your Supabase SQL Editor

DO $$
DECLARE
    hair_care_id INTEGER;
    shampoo_id INTEGER;
    conditioner_id INTEGER;
    hair_mask_id INTEGER;
    hair_treatment_id INTEGER;
    hair_styling_id INTEGER;
    hair_accessories_id INTEGER;
BEGIN
    -- Get Hair Care category ID
    SELECT id INTO hair_care_id FROM categories WHERE slug = 'hair-care';

    IF hair_care_id IS NULL THEN
        RAISE EXCEPTION 'Hair Care category not found. Please ensure it exists in the database.';
    END IF;

    RAISE NOTICE 'Updating Hair Care structure (ID: %)', hair_care_id;

    -- Get existing subcategory IDs
    SELECT id INTO shampoo_id FROM categories WHERE slug = 'shampoo' AND parent_id = hair_care_id;
    SELECT id INTO conditioner_id FROM categories WHERE slug = 'conditioner' AND parent_id = hair_care_id;
    SELECT id INTO hair_mask_id FROM categories WHERE slug = 'hair-mask' AND parent_id = hair_care_id;

    -- Add new subcategories
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

    -- Add child categories for Shampoo
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Color Protection', 'shampoo-color-protection', 'Color-safe shampoo', shampoo_id, 4),
    ('Repair', 'shampoo-repair', 'Repair shampoo', shampoo_id, 5)
    ON CONFLICT (slug) DO NOTHING;

    -- Add child categories for Conditioner
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Color Protection', 'conditioner-color-protection', 'Color-safe conditioner', conditioner_id, 4),
    ('Volumizing', 'conditioner-volumizing', 'Volumizing conditioner', conditioner_id, 5)
    ON CONFLICT (slug) DO NOTHING;

    -- Add child categories for Hair Mask
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Repair', 'hair-mask-repair', 'Repair hair mask', hair_mask_id, 4),
    ('Color Protection', 'hair-mask-color-protection', 'Color-safe hair mask', hair_mask_id, 5)
    ON CONFLICT (slug) DO NOTHING;

    -- Add child categories for Hair Treatment
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Hair Serum', 'hair-serum', 'Hair treatment serums', hair_treatment_id, 1),
    ('Hair Oil', 'hair-oil', 'Hair treatment oils', hair_treatment_id, 2),
    ('Scalp Treatment', 'scalp-treatment', 'Scalp care products', hair_treatment_id, 3),
    ('Hair Growth', 'hair-growth', 'Hair growth treatments', hair_treatment_id, 4)
    ON CONFLICT (slug) DO NOTHING;

    -- Add child categories for Hair Styling
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Hair Gel', 'hair-gel', 'Hair styling gel', hair_styling_id, 1),
    ('Hair Spray', 'hair-spray', 'Hair styling spray', hair_styling_id, 2),
    ('Hair Wax', 'hair-wax', 'Hair styling wax', hair_styling_id, 3),
    ('Hair Mousse', 'hair-mousse', 'Hair styling mousse', hair_styling_id, 4),
    ('Heat Protection', 'heat-protection', 'Heat protection products', hair_styling_id, 5)
    ON CONFLICT (slug) DO NOTHING;

    -- Add child categories for Hair Accessories
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Hair Brushes', 'hair-brushes', 'Hair brushes and combs', hair_accessories_id, 1),
    ('Hair Clips', 'hair-clips', 'Hair clips and pins', hair_accessories_id, 2),
    ('Hair Bands', 'hair-bands', 'Hair bands and ties', hair_accessories_id, 3),
    ('Hair Dryers', 'hair-dryers', 'Hair dryers and tools', hair_accessories_id, 4)
    ON CONFLICT (slug) DO NOTHING;

    RAISE NOTICE 'Hair Care structure updated successfully!';
    RAISE NOTICE 'Total subcategories: 6';
    RAISE NOTICE 'Total child categories: 30+';
END $$;

-- Verify the Hair Care structure
SELECT '=== HAIR CARE STRUCTURE ===' as info;
SELECT 
  c1.name as main_category,
  c2.name as subcategory,
  c2.sort_order as sub_order,
  c3.name as child_category,
  c3.sort_order as child_order
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN categories c3 ON c3.parent_id = c2.id
WHERE c1.slug = 'hair-care'
ORDER BY c2.sort_order, c3.sort_order;

