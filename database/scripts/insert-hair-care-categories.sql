-- Insert Hair Care subcategories and child categories
-- Run this in your Supabase SQL Editor

DO $$
DECLARE
    hair_care_id INTEGER;
    shampoo_id INTEGER;
    conditioner_id INTEGER;
    hair_mask_id INTEGER;
BEGIN
    -- Get Hair Care category ID
    SELECT id INTO hair_care_id FROM categories WHERE slug = 'hair-care';

    IF hair_care_id IS NULL THEN
        RAISE EXCEPTION 'Hair Care category not found. Please ensure it exists in the database.';
    END IF;

    RAISE NOTICE 'Inserting Hair Care subcategories (ID: %)', hair_care_id;

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

    -- Insert child categories for Shampoo
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Volumizing', 'shampoo-volumizing', 'Volumizing shampoo', shampoo_id, 1),
    ('Moisturizing', 'shampoo-moisturizing', 'Moisturizing shampoo', shampoo_id, 2),
    ('Anti-Dandruff', 'shampoo-anti-dandruff', 'Anti-dandruff shampoo', shampoo_id, 3)
    ON CONFLICT (slug) DO NOTHING;

    -- Insert child categories for Conditioner
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Deep Conditioning', 'conditioner-deep', 'Deep conditioning products', conditioner_id, 1),
    ('Leave-In', 'conditioner-leave-in', 'Leave-in conditioner', conditioner_id, 2),
    ('Repair', 'conditioner-repair', 'Repair conditioner', conditioner_id, 3)
    ON CONFLICT (slug) DO NOTHING;

    -- Insert child categories for Hair Mask
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Hydrating', 'hair-mask-hydrating', 'Hydrating hair mask', hair_mask_id, 1),
    ('Keratin', 'hair-mask-keratin', 'Keratin treatment mask', hair_mask_id, 2),
    ('Protein', 'hair-mask-protein', 'Protein treatment mask', hair_mask_id, 3)
    ON CONFLICT (slug) DO NOTHING;

    RAISE NOTICE 'Hair Care categories inserted successfully!';
END $$;


