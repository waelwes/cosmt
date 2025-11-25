-- Insert Skin Care subcategories and child categories
-- Run this in your Supabase SQL Editor

DO $$
DECLARE
    skin_care_id INTEGER;
    facial_cleansing_id INTEGER;
    face_cream_id INTEGER;
    face_serum_id INTEGER;
    face_mask_id INTEGER;
    eye_contour_id INTEGER;
    lip_care_id INTEGER;
    dermocosmetic_id INTEGER;
BEGIN
    -- Get Skin Care category ID
    SELECT id INTO skin_care_id FROM categories WHERE slug = 'skin-care';

    IF skin_care_id IS NULL THEN
        RAISE EXCEPTION 'Skin Care category not found. Please ensure it exists in the database.';
    END IF;

    RAISE NOTICE 'Inserting Skin Care subcategories (ID: %)', skin_care_id;

    -- 1. Facial Cleansing
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Facial Cleansing', 'facial-cleansing', 'Face cleansing products', skin_care_id, 1)
    ON CONFLICT (slug) DO UPDATE SET parent_id = skin_care_id
    RETURNING id INTO facial_cleansing_id;

    -- 2. Face Cream
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Face Cream', 'face-cream', 'Face moisturizing cream', skin_care_id, 2)
    ON CONFLICT (slug) DO UPDATE SET parent_id = skin_care_id
    RETURNING id INTO face_cream_id;

    -- 3. Face Serum
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Face Serum', 'face-serum', 'Concentrated face serum', skin_care_id, 3)
    ON CONFLICT (slug) DO UPDATE SET parent_id = skin_care_id
    RETURNING id INTO face_serum_id;

    -- 4. Face Mask
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Face Mask', 'face-mask', 'Face treatment mask', skin_care_id, 4)
    ON CONFLICT (slug) DO UPDATE SET parent_id = skin_care_id
    RETURNING id INTO face_mask_id;

    -- 5. Eye Contour Care
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Eye Contour Care', 'eye-contour-care', 'Eye area treatment', skin_care_id, 5)
    ON CONFLICT (slug) DO UPDATE SET parent_id = skin_care_id
    RETURNING id INTO eye_contour_id;

    -- 6. Lip Care
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Lip Care', 'lip-care', 'Lip treatment products', skin_care_id, 6)
    ON CONFLICT (slug) DO UPDATE SET parent_id = skin_care_id
    RETURNING id INTO lip_care_id;

    -- 7. Dermocosmetic Skin Care
    INSERT INTO categories (name, slug, description, parent_id, sort_order)
    VALUES ('Dermocosmetic Skin Care', 'dermocosmetic-skin-care', 'Medical-grade skincare', skin_care_id, 7)
    ON CONFLICT (slug) DO UPDATE SET parent_id = skin_care_id
    RETURNING id INTO dermocosmetic_id;

    -- Insert child categories for Facial Cleansing
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Moisturizer', 'facial-cleansing-moisturizer', 'Moisturizing cleanser', facial_cleansing_id, 1),
    ('Sensitive Skin', 'facial-cleansing-sensitive-skin', 'Cleanser for sensitive skin', facial_cleansing_id, 2),
    ('Oily Skin', 'facial-cleansing-oily-skin', 'Cleanser for oily skin', facial_cleansing_id, 3),
    ('Purifying', 'facial-cleansing-purifying', 'Purifying cleanser', facial_cleansing_id, 4),
    ('Makeup Remover', 'facial-cleansing-makeup-remover', 'Makeup removal products', facial_cleansing_id, 5)
    ON CONFLICT (slug) DO NOTHING;

    -- Insert child categories for Face Cream
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Moisturizer', 'face-cream-moisturizer', 'Moisturizing face cream', face_cream_id, 1),
    ('Sensitive Skin', 'face-cream-sensitive-skin', 'Cream for sensitive skin', face_cream_id, 2),
    ('Oily Skin', 'face-cream-oily-skin', 'Cream for oily skin', face_cream_id, 3),
    ('Anti-Aging', 'face-cream-anti-aging', 'Anti-aging cream', face_cream_id, 4),
    ('Anti-Stain', 'face-cream-anti-stain', 'Anti-stain cream', face_cream_id, 5)
    ON CONFLICT (slug) DO NOTHING;

    -- Insert child categories for Face Serum
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Enlightening', 'face-serum-enlightening', 'Brightening serum', face_serum_id, 1),
    ('Anti-Wrinkle', 'face-serum-anti-wrinkle', 'Anti-wrinkle serum', face_serum_id, 2),
    ('Loss of Firmness', 'face-serum-loss-of-firmness', 'Firming serum', face_serum_id, 3),
    ('Anti-Stain', 'face-serum-anti-stain', 'Anti-stain serum', face_serum_id, 4),
    ('Oily Skin', 'face-serum-oily-skin', 'Serum for oily skin', face_serum_id, 5)
    ON CONFLICT (slug) DO NOTHING;

    -- Insert child categories for Face Mask
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Cleaning', 'face-mask-cleaning', 'Cleansing mask', face_mask_id, 1),
    ('Moisturizer', 'face-mask-moisturizer', 'Moisturizing mask', face_mask_id, 2),
    ('Enlightening', 'face-mask-enlightening', 'Brightening mask', face_mask_id, 3),
    ('Oily Skin', 'face-mask-oily-skin', 'Mask for oily skin', face_mask_id, 4),
    ('Loss of Firmness', 'face-mask-loss-of-firmness', 'Firming mask', face_mask_id, 5)
    ON CONFLICT (slug) DO NOTHING;

    -- Insert child categories for Eye Contour Care
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Enlightening', 'eye-contour-enlightening', 'Brightening eye cream', eye_contour_id, 1),
    ('Loss of Firmness', 'eye-contour-loss-of-firmness', 'Firming eye cream', eye_contour_id, 2),
    ('Sensitive Skin', 'eye-contour-sensitive-skin', 'Eye cream for sensitive skin', eye_contour_id, 3)
    ON CONFLICT (slug) DO NOTHING;

    -- Insert child categories for Lip Care
    INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
    ('Dermocosmetics', 'lip-care-dermocosmetics', 'Medical-grade lip care', lip_care_id, 1),
    ('Cream', 'lip-care-cream', 'Lip cream', lip_care_id, 2),
    ('Lipstick', 'lip-care-lipstick', 'Lip color products', lip_care_id, 3)
    ON CONFLICT (slug) DO NOTHING;

    RAISE NOTICE 'Skin Care categories inserted successfully!';
END $$;


