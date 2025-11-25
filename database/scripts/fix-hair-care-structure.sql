-- Comprehensive Hair Care Structure Fix
-- This script ensures Hair Care categories are properly structured
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
    -- Get or create Hair Care main category
    SELECT id INTO hair_care_id FROM categories WHERE slug = 'hair-care';
    
    IF hair_care_id IS NULL THEN
        INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) 
        VALUES ('Hair Care', 'hair-care', 'Professional hair care products for all hair types', NULL, 2, true)
        RETURNING id INTO hair_care_id;
        RAISE NOTICE 'Created Hair Care main category (ID: %)', hair_care_id;
    ELSE
        -- Ensure it's active
        UPDATE categories SET is_active = true WHERE id = hair_care_id;
        RAISE NOTICE 'Hair Care main category exists (ID: %)', hair_care_id;
    END IF;

    -- 1. Shampoo
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Shampoo', 'shampoo', 'Hair cleansing products', hair_care_id, 1)
    ON CONFLICT (slug) DO UPDATE SET parent_id = hair_care_id
    RETURNING id INTO shampoo_id;

    -- 2. Conditioner
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Conditioner', 'conditioner', 'Hair conditioning products', hair_care_id, 2)
    ON CONFLICT (slug) DO UPDATE SET parent_id = hair_care_id
    RETURNING id INTO conditioner_id;

    -- 3. Hair Mask
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Hair Mask', 'hair-mask', 'Deep conditioning hair treatments', hair_care_id, 3)
    ON CONFLICT (slug) DO UPDATE SET parent_id = hair_care_id
    RETURNING id INTO hair_mask_id;

    -- 4. Hair Treatment (NEW)
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Hair Treatment', 'hair-treatment', 'Professional hair treatments and serums', hair_care_id, 4)
    ON CONFLICT (slug) DO UPDATE SET parent_id = hair_care_id
    RETURNING id INTO hair_treatment_id;

    -- 5. Hair Styling (NEW)
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Hair Styling', 'hair-styling', 'Hair styling products and tools', hair_care_id, 5)
    ON CONFLICT (slug) DO UPDATE SET parent_id = hair_care_id
    RETURNING id INTO hair_styling_id;

    -- 6. Hair Accessories (NEW)
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Hair Accessories', 'hair-accessories', 'Hair accessories and tools', hair_care_id, 6)
    ON CONFLICT (slug) DO UPDATE SET parent_id = hair_care_id
    RETURNING id INTO hair_accessories_id;

    -- Insert child categories for Shampoo
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Volumizing', 'shampoo-volumizing', 'Volumizing shampoo', shampoo_id, 1),
    ('Moisturizing', 'shampoo-moisturizing', 'Moisturizing shampoo', shampoo_id, 2),
    ('Anti-Dandruff', 'shampoo-anti-dandruff', 'Anti-dandruff shampoo', shampoo_id, 3),
    ('Color Protection', 'shampoo-color-protection', 'Color-safe shampoo', shampoo_id, 4),
    ('Repair', 'shampoo-repair', 'Repair shampoo', shampoo_id, 5)
    ON CONFLICT (slug) DO NOTHING;

    -- Insert child categories for Conditioner
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Deep Conditioning', 'conditioner-deep', 'Deep conditioning products', conditioner_id, 1),
    ('Leave-In', 'conditioner-leave-in', 'Leave-in conditioner', conditioner_id, 2),
    ('Repair', 'conditioner-repair', 'Repair conditioner', conditioner_id, 3),
    ('Color Protection', 'conditioner-color-protection', 'Color-safe conditioner', conditioner_id, 4),
    ('Volumizing', 'conditioner-volumizing', 'Volumizing conditioner', conditioner_id, 5)
    ON CONFLICT (slug) DO NOTHING;

    -- Insert child categories for Hair Mask
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Hydrating', 'hair-mask-hydrating', 'Hydrating hair mask', hair_mask_id, 1),
    ('Keratin', 'hair-mask-keratin', 'Keratin treatment mask', hair_mask_id, 2),
    ('Protein', 'hair-mask-protein', 'Protein treatment mask', hair_mask_id, 3),
    ('Repair', 'hair-mask-repair', 'Repair hair mask', hair_mask_id, 4),
    ('Color Protection', 'hair-mask-color-protection', 'Color-safe hair mask', hair_mask_id, 5)
    ON CONFLICT (slug) DO NOTHING;

    -- Insert child categories for Hair Treatment
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Hair Serum', 'hair-serum', 'Hair treatment serums', hair_treatment_id, 1),
    ('Hair Oil', 'hair-oil', 'Hair treatment oils', hair_treatment_id, 2),
    ('Scalp Treatment', 'scalp-treatment', 'Scalp care products', hair_treatment_id, 3),
    ('Hair Growth', 'hair-growth', 'Hair growth treatments', hair_treatment_id, 4)
    ON CONFLICT (slug) DO NOTHING;

    -- Insert child categories for Hair Styling
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Hair Gel', 'hair-gel', 'Hair styling gel', hair_styling_id, 1),
    ('Hair Spray', 'hair-spray', 'Hair styling spray', hair_styling_id, 2),
    ('Hair Wax', 'hair-wax', 'Hair styling wax', hair_styling_id, 3),
    ('Hair Mousse', 'hair-mousse', 'Hair styling mousse', hair_styling_id, 4),
    ('Heat Protection', 'heat-protection', 'Heat protection products', hair_styling_id, 5)
    ON CONFLICT (slug) DO NOTHING;

    -- Insert child categories for Hair Accessories
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Hair Brushes', 'hair-brushes', 'Hair brushes and combs', hair_accessories_id, 1),
    ('Hair Clips', 'hair-clips', 'Hair clips and pins', hair_accessories_id, 2),
    ('Hair Bands', 'hair-bands', 'Hair bands and ties', hair_accessories_id, 3),
    ('Hair Dryers', 'hair-dryers', 'Hair dryers and tools', hair_accessories_id, 4)
    ON CONFLICT (slug) DO NOTHING;

    RAISE NOTICE 'Hair Care categories structure updated successfully!';
    RAISE NOTICE 'Total subcategories: 6';
    RAISE NOTICE 'Total child categories: 30+';
END $$;

-- Verify the complete Hair Care structure
SELECT 
  c1.name as main_category,
  c2.name as subcategory,
  c3.name as child_category
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN categories c3 ON c3.parent_id = c2.id
WHERE c1.slug = 'hair-care'
ORDER BY c2.sort_order, c3.sort_order;

