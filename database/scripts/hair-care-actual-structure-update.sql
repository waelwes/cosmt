-- Hair Care Structure Update - Based on Current Database Structure
-- This script adds child categories to existing Hair Care subcategories
-- Run this in your Supabase SQL Editor

DO $$
DECLARE
    hair_care_oils_id INTEGER;
    hair_serum_id INTEGER;
    hair_dye_care_id INTEGER;
    shapers_id INTEGER;
    keratin_straightening_id INTEGER;
    hair_equipment_id INTEGER;
BEGIN
    RAISE NOTICE 'Adding child categories to existing Hair Care subcategories...';

    -- Get subcategory IDs
    SELECT id INTO hair_care_oils_id FROM categories WHERE slug = 'hair-care-oils' AND parent_id = (SELECT id FROM categories WHERE slug = 'hair-care');
    SELECT id INTO hair_serum_id FROM categories WHERE slug = 'hair-serum' AND parent_id = (SELECT id FROM categories WHERE slug = 'hair-care');
    SELECT id INTO hair_dye_care_id FROM categories WHERE slug = 'hair-dye-care' AND parent_id = (SELECT id FROM categories WHERE slug = 'hair-care');
    SELECT id INTO shapers_id FROM categories WHERE slug = 'shapers' AND parent_id = (SELECT id FROM categories WHERE slug = 'hair-care');
    SELECT id INTO keratin_straightening_id FROM categories WHERE slug = 'keratin-straightening-treatment' AND parent_id = (SELECT id FROM categories WHERE slug = 'hair-care');
    SELECT id INTO hair_equipment_id FROM categories WHERE slug = 'hair-equipment' AND parent_id = (SELECT id FROM categories WHERE slug = 'hair-care');

    -- Add child categories for Hair Care Oils
    IF hair_care_oils_id IS NOT NULL THEN
        INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
        ('Argan Oil', 'hair-care-oils-argan', 'Argan oil for hair care', hair_care_oils_id, 1),
        ('Coconut Oil', 'hair-care-oils-coconut', 'Coconut oil treatments', hair_care_oils_id, 2),
        ('Olive Oil', 'hair-care-oils-olive', 'Olive oil hair treatments', hair_care_oils_id, 3),
        ('Jojoba Oil', 'hair-care-oils-jojoba', 'Jojoba oil for hair', hair_care_oils_id, 4),
        ('Castor Oil', 'hair-care-oils-castor', 'Castor oil treatments', hair_care_oils_id, 5)
        ON CONFLICT (slug) DO NOTHING;
        RAISE NOTICE 'Added child categories for Hair Care Oils';
    END IF;

    -- Add child categories for Hair Serum
    IF hair_serum_id IS NOT NULL THEN
        INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
        ('Hair Growth Serum', 'hair-serum-growth', 'Serums for hair growth', hair_serum_id, 1),
        ('Anti-Frizz Serum', 'hair-serum-anti-frizz', 'Anti-frizz hair serums', hair_serum_id, 2),
        ('Heat Protection Serum', 'hair-serum-heat-protection', 'Heat protection serums', hair_serum_id, 3),
        ('Repair Serum', 'hair-serum-repair', 'Hair repair serums', hair_serum_id, 4),
        ('Volumizing Serum', 'hair-serum-volumizing', 'Volumizing hair serums', hair_serum_id, 5)
        ON CONFLICT (slug) DO NOTHING;
        RAISE NOTICE 'Added child categories for Hair Serum';
    END IF;

    -- Add child categories for Hair Dye Care
    IF hair_dye_care_id IS NOT NULL THEN
        INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
        ('Color Protection', 'hair-dye-care-color-protection', 'Color protection products', hair_dye_care_id, 1),
        ('Color Maintenance', 'hair-dye-care-maintenance', 'Color maintenance treatments', hair_dye_care_id, 2),
        ('Color Repair', 'hair-dye-care-repair', 'Color repair products', hair_dye_care_id, 3),
        ('Pre-Color Treatment', 'hair-dye-care-pre-treatment', 'Pre-color treatments', hair_dye_care_id, 4),
        ('Post-Color Care', 'hair-dye-care-post-care', 'Post-color care products', hair_dye_care_id, 5)
        ON CONFLICT (slug) DO NOTHING;
        RAISE NOTICE 'Added child categories for Hair Dye Care';
    END IF;

    -- Add child categories for Shapers
    IF shapers_id IS NOT NULL THEN
        INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
        ('Hair Gel', 'shapers-hair-gel', 'Hair styling gel', shapers_id, 1),
        ('Hair Wax', 'shapers-hair-wax', 'Hair styling wax', shapers_id, 2),
        ('Hair Mousse', 'shapers-hair-mousse', 'Hair styling mousse', shapers_id, 3),
        ('Hair Spray', 'shapers-hair-spray', 'Hair styling spray', shapers_id, 4),
        ('Hair Cream', 'shapers-hair-cream', 'Hair styling cream', shapers_id, 5)
        ON CONFLICT (slug) DO NOTHING;
        RAISE NOTICE 'Added child categories for Shapers';
    END IF;

    -- Add child categories for Keratin and Straightening Treatment
    IF keratin_straightening_id IS NOT NULL THEN
        INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
        ('Keratin Treatment', 'keratin-treatment', 'Keratin hair treatments', keratin_straightening_id, 1),
        ('Straightening Treatment', 'straightening-treatment', 'Hair straightening treatments', keratin_straightening_id, 2),
        ('Brazilian Blowout', 'brazilian-blowout', 'Brazilian blowout treatments', keratin_straightening_id, 3),
        ('Smoothing Treatment', 'smoothing-treatment', 'Hair smoothing treatments', keratin_straightening_id, 4),
        ('Anti-Frizz Treatment', 'anti-frizz-treatment', 'Anti-frizz treatments', keratin_straightening_id, 5)
        ON CONFLICT (slug) DO NOTHING;
        RAISE NOTICE 'Added child categories for Keratin and Straightening Treatment';
    END IF;

    -- Add child categories for Hair Equipment
    IF hair_equipment_id IS NOT NULL THEN
        INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
        ('Hair Dryers', 'hair-equipment-dryers', 'Hair dryers and tools', hair_equipment_id, 1),
        ('Hair Brushes', 'hair-equipment-brushes', 'Hair brushes and combs', hair_equipment_id, 2),
        ('Hair Straighteners', 'hair-equipment-straighteners', 'Hair straightening tools', hair_equipment_id, 3),
        ('Hair Curlers', 'hair-equipment-curlers', 'Hair curling tools', hair_equipment_id, 4),
        ('Hair Clips', 'hair-equipment-clips', 'Hair clips and accessories', hair_equipment_id, 5)
        ON CONFLICT (slug) DO NOTHING;
        RAISE NOTICE 'Added child categories for Hair Equipment';
    END IF;

    RAISE NOTICE 'Hair Care child categories added successfully!';
END $$;

-- Verify the updated Hair Care structure
SELECT '=== UPDATED HAIR CARE STRUCTURE ===' as info;
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

