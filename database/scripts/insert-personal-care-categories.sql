-- Insert Personal Care Categories into COSMT Database
-- Run this in your Supabase SQL Editor
-- 
-- NOTE: This script works with the existing schema which uses parent_id relationships
-- to determine hierarchy levels instead of an explicit 'level' column

-- Insert Personal Care main category (parent_id is NULL for main categories)
INSERT INTO categories (name, slug, description, sort_order, parent_id) 
VALUES ('Personal Care', 'personal-care', 'Complete personal care solutions for everyday hygiene and wellness', 3, NULL)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;

-- Get the Personal Care category ID and insert subcategories
DO $$
DECLARE
    personal_care_id INTEGER;
    perfume_deo_id INTEGER;
    solar_products_id INTEGER;
    body_bath_id INTEGER;
    hand_foot_nail_id INTEGER;
    hair_removal_id INTEGER;
    oral_health_id INTEGER;
    eyebrow_eyelash_id INTEGER;
    shaving_id INTEGER;
    sexual_health_id INTEGER;
    care_supplies_id INTEGER;
    dermocosmetic_id INTEGER;
BEGIN
    -- Get Personal Care ID
    SELECT id INTO personal_care_id FROM categories WHERE slug = 'personal-care';

    IF personal_care_id IS NULL THEN
        RAISE EXCEPTION 'Personal Care category not found. Please run the main INSERT statement first.';
    END IF;

    RAISE NOTICE 'Inserting categories under Personal Care (ID: %)', personal_care_id;

    -- Insert Level 2 Categories (Subcategories) - parent_id = personal_care_id
    
    -- 1. Perfume and Deodorant
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Perfume and Deodorant', 'perfume-deodorant', 'Fragrances and deodorizing products', personal_care_id, 1)
    ON CONFLICT (slug) DO UPDATE SET parent_id = personal_care_id
    RETURNING id INTO perfume_deo_id;

    -- 2. Solar Products
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Solar Products', 'solar-products', 'Sun protection and tanning products', personal_care_id, 2)
    ON CONFLICT (slug) DO UPDATE SET parent_id = personal_care_id
    RETURNING id INTO solar_products_id;

    -- 3. Body and Bath Products
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Body and Bath Products', 'body-bath-products', 'Body care and bath essentials', personal_care_id, 3)
    ON CONFLICT (slug) DO UPDATE SET parent_id = personal_care_id
    RETURNING id INTO body_bath_id;

    -- 4. Hand, Foot and Nail Care
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Hand, Foot and Nail Care', 'hand-foot-nail-care', 'Hand, foot, and nail care products', personal_care_id, 4)
    ON CONFLICT (slug) DO UPDATE SET parent_id = personal_care_id
    RETURNING id INTO hand_foot_nail_id;

    -- 5. Hair Removal Products
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Hair Removal Products', 'hair-removal-products', 'Hair removal solutions', personal_care_id, 5)
    ON CONFLICT (slug) DO UPDATE SET parent_id = personal_care_id
    RETURNING id INTO hair_removal_id;

    -- 6. Oral Health
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Oral Health', 'oral-health', 'Dental and oral care products', personal_care_id, 6)
    ON CONFLICT (slug) DO UPDATE SET parent_id = personal_care_id
    RETURNING id INTO oral_health_id;

    -- 7. Eyebrow and Eyelash Care
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Eyebrow and Eyelash Care', 'eyebrow-eyelash-care', 'Eyebrow and eyelash enhancement products', personal_care_id, 7)
    ON CONFLICT (slug) DO UPDATE SET parent_id = personal_care_id
    RETURNING id INTO eyebrow_eyelash_id;

    -- 8. Shaving Products
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Shaving Products', 'shaving-products', 'Men''s grooming and shaving essentials', personal_care_id, 8)
    ON CONFLICT (slug) DO UPDATE SET parent_id = personal_care_id
    RETURNING id INTO shaving_id;

    -- 9. Sexual Health
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Sexual Health', 'sexual-health', 'Intimate wellness products', personal_care_id, 9)
    ON CONFLICT (slug) DO UPDATE SET parent_id = personal_care_id
    RETURNING id INTO sexual_health_id;

    -- 10. Care Supplies
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Care Supplies', 'care-supplies', 'Personal care tools and accessories', personal_care_id, 10)
    ON CONFLICT (slug) DO UPDATE SET parent_id = personal_care_id
    RETURNING id INTO care_supplies_id;

    -- 11. Dermocosmetic Personal Care
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Dermocosmetic Personal Care', 'dermocosmetic-personal-care', 'Dermocosmetic personal care products', personal_care_id, 11)
    ON CONFLICT (slug) DO UPDATE SET parent_id = personal_care_id
    RETURNING id INTO dermocosmetic_id;

    RAISE NOTICE 'Inserting Level 2 categories...';

    -- Insert Level 3 Categories (Child categories under each subcategory)
    
    -- 1. Perfume and Deodorant - Children
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Perfume', 'perfume', 'Fragrance products', perfume_deo_id, 1),
    ('Deodorant', 'deodorant', 'Deodorizing products', perfume_deo_id, 2),
    ('Body Sprays', 'body-sprays', 'Body spray fragrances', perfume_deo_id, 3),
    ('Roll On', 'roll-on', 'Roll-on deodorants', perfume_deo_id, 4)
    ON CONFLICT (slug) DO NOTHING;

    -- 2. Solar Products - Children
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Sunscreen', 'sunscreen', 'Sun protection lotions', solar_products_id, 1),
    ('Bronzer', 'bronzer', 'Self-tanning products', solar_products_id, 2),
    ('After Sun Care', 'after-sun-care', 'Post-sun care products', solar_products_id, 3)
    ON CONFLICT (slug) DO NOTHING;

    -- 3. Body and Bath Products - Children
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Hygiene Products', 'hygiene-products', 'Personal hygiene essentials', body_bath_id, 1),
    ('Bathroom and Shower', 'bathroom-shower', 'Bath and shower products', body_bath_id, 2),
    ('Body Care', 'body-care', 'Body care products', body_bath_id, 3)
    ON CONFLICT (slug) DO NOTHING;

    -- 4. Hand, Foot and Nail Care - Children
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Mani Pedi', 'mani-pedi', 'Manicure and pedicure products', hand_foot_nail_id, 1),
    ('Artificial Nails', 'artificial-nails', 'Nail extensions and tips', hand_foot_nail_id, 2),
    ('Hand and Foot Care', 'hand-foot-care', 'Hand and foot skincare', hand_foot_nail_id, 3),
    ('Nail Care and Nail Polish', 'nail-care-polish', 'Nail care and coloring products', hand_foot_nail_id, 4)
    ON CONFLICT (slug) DO NOTHING;

    -- 5. Hair Removal Products - Children
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Waxing', 'waxing', 'Hair removal wax products', hair_removal_id, 1),
    ('Hair Removal Cream', 'hair-removal-cream', 'Depilatory creams', hair_removal_id, 2),
    ('Womens Razor Blades', 'womens-razor-blades', 'Women''s grooming razors', hair_removal_id, 3)
    ON CONFLICT (slug) DO NOTHING;

    -- 6. Oral Health - Children
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Mouthwash', 'mouthwash', 'Oral rinses and mouthwashes', oral_health_id, 1),
    ('Toothpaste', 'toothpaste', 'Dental cleaning pastes', oral_health_id, 2),
    ('Toothbrushes and Cleaners', 'toothbrushes-cleaners', 'Dental cleaning tools', oral_health_id, 3),
    ('Dental Prosthetic Products', 'dental-prosthetic', 'Dental prosthetics', oral_health_id, 4)
    ON CONFLICT (slug) DO NOTHING;

    -- 7. Eyebrow and Eyelash Care - Children
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Nourishing Serum', 'nourishing-serum', 'Eyelash and eyebrow serums', eyebrow_eyelash_id, 1),
    ('Eyelash Lift', 'eyelash-lift', 'Eyelash enhancement products', eyebrow_eyelash_id, 2)
    ON CONFLICT (slug) DO NOTHING;

    -- 8. Shaving Products - Children
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Shavers', 'shavers', 'Electric and manual shavers', shaving_id, 1),
    ('Beard and Mustache Care', 'beard-mustache-care', 'Facial hair grooming products', shaving_id, 2),
    ('Razor Blade', 'razor-blade', 'Razor blades and cartridges', shaving_id, 3),
    ('Shaving Brush', 'shaving-brush', 'Traditional shaving accessories', shaving_id, 4),
    ('Before and After Shaving', 'before-after-shaving', 'Pre and post shave care', shaving_id, 5)
    ON CONFLICT (slug) DO NOTHING;

    -- 9. Sexual Health - Children
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Okey', 'okey', 'Intimate care brand', sexual_health_id, 1),
    ('Durex', 'durex', 'Intimate wellness products', sexual_health_id, 2)
    ON CONFLICT (slug) DO NOTHING;

    -- 10. Care Supplies - Children
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Tweezers', 'tweezers', 'Hair removal tweezers', care_supplies_id, 1),
    ('Body Brush', 'body-brush', 'Body brushing tools', care_supplies_id, 2),
    ('Eyebrow and Moustache Scissors', 'eyebrow-moustache-scissors', 'Facial hair trimming tools', care_supplies_id, 3),
    ('Dermaroller', 'dermaroller', 'Microdermabrasion rollers', care_supplies_id, 4),
    ('Travel Kit', 'travel-kit', 'Travel grooming essentials', care_supplies_id, 5)
    ON CONFLICT (slug) DO NOTHING;

    RAISE NOTICE 'Personal Care categories inserted successfully!';
    RAISE NOTICE 'Category structure:';
    RAISE NOTICE '- Main category: Personal Care (parent_id = NULL)';
    RAISE NOTICE '- Subcategories: 11 categories with parent_id = Personal Care';
    RAISE NOTICE '- Child categories: 40+ categories with parent_id = Subcategory';
END $$;

-- Verify the insertion
SELECT 
  c1.name as main_category,
  c2.name as subcategory,
  c3.name as child_category
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN categories c3 ON c3.parent_id = c2.id
WHERE c1.slug = 'personal-care'
ORDER BY c2.sort_order, c3.sort_order;
