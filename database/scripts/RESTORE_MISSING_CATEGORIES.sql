-- IMPORTANT: Restore Missing Categories Script
-- This will insert Hair Care, Skin Care, and Personal Care if they're missing
-- Run this to restore your categories

-- Step 1: Check what categories currently exist
SELECT 'Current Main Categories:' as info;
SELECT id, name, slug, parent_id, is_active FROM categories WHERE parent_id IS NULL ORDER BY id;

-- Step 2: Insert Hair Care if missing
DO $$
DECLARE
    hair_care_exists BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM categories WHERE slug = 'hair-care') INTO hair_care_exists;
    
    IF NOT hair_care_exists THEN
        RAISE NOTICE 'Hair Care category is MISSING - Inserting now...';
        
        INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
        VALUES ('Hair Care', 'hair-care', 'Professional hair care products for all hair types', NULL, true, 5)
        ON CONFLICT (slug) DO NOTHING;
        
        RAISE NOTICE 'Hair Care category created!';
    ELSE
        RAISE NOTICE 'Hair Care category EXISTS (ID: %)', (SELECT id FROM categories WHERE slug = 'hair-care');
    END IF;
END $$;

-- Step 3: Insert Skin Care if missing
DO $$
DECLARE
    skin_care_exists BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM categories WHERE slug = 'skin-care') INTO skin_care_exists;
    
    IF NOT skin_care_exists THEN
        RAISE NOTICE 'Skin Care category is MISSING - Inserting now...';
        
        INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
        VALUES ('Skin Care', 'skin-care', 'Premium skincare products for healthy skin', NULL, true, 6)
        ON CONFLICT (slug) DO NOTHING;
        
        RAISE NOTICE 'Skin Care category created!';
    ELSE
        RAISE NOTICE 'Skin Care category EXISTS (ID: %)', (SELECT id FROM categories WHERE slug = 'skin-care');
    END IF;
END $$;

-- Step 4: Insert Personal Care if missing
DO $$
DECLARE
    personal_care_exists BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM categories WHERE slug = 'personal-care') INTO personal_care_exists;
    
    IF NOT personal_care_exists THEN
        RAISE NOTICE 'Personal Care category is MISSING - Inserting now...';
        
        INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
        VALUES ('Personal Care', 'personal-care', 'Complete personal care solutions for everyday hygiene and wellness', NULL, true, 3)
        ON CONFLICT (slug) DO NOTHING;
        
        RAISE NOTICE 'Personal Care category created!';
    ELSE
        RAISE NOTICE 'Personal Care category EXISTS (ID: %)', (SELECT id FROM categories WHERE slug = 'personal-care');
    END IF;
END $$;

-- Step 5: Show final status
SELECT 'Final Status - All Main Categories:' as info;
SELECT id, name, slug, parent_id, is_active FROM categories WHERE parent_id IS NULL ORDER BY id;

-- Step 6: Count subcategories for each main category
SELECT 'Category Counts:' as info;
SELECT 
    c.name as main_category,
    COUNT(sc.id) as subcategory_count,
    c.is_active
FROM categories c
LEFT JOIN categories sc ON sc.parent_id = c.id
WHERE c.parent_id IS NULL
GROUP BY c.id, c.name, c.is_active
ORDER BY c.id;

