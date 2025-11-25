-- Insert 10 Test Products for Testing
-- Run this in your Supabase SQL Editor

-- First, let's get some category IDs to use
DO $$
DECLARE
    hair_care_id INTEGER;
    skin_care_id INTEGER;
    facial_cleansing_id INTEGER;
    face_cream_id INTEGER;
    hair_mask_id INTEGER;
    shampoo_id INTEGER;
BEGIN
    -- Get main category IDs
    SELECT id INTO hair_care_id FROM categories WHERE slug = 'hair-care' LIMIT 1;
    SELECT id INTO skin_care_id FROM categories WHERE slug = 'skin-care' LIMIT 1;
    
    -- Get subcategory IDs (if they exist)
    SELECT id INTO facial_cleansing_id FROM categories WHERE slug = 'facial-cleansing' LIMIT 1;
    SELECT id INTO face_cream_id FROM categories WHERE slug = 'face-cream' LIMIT 1;
    SELECT id INTO hair_mask_id FROM categories WHERE slug LIKE '%hair-mask%' OR name LIKE '%Hair Mask%' LIMIT 1;
    SELECT id INTO shampoo_id FROM categories WHERE slug LIKE '%shampoo%' OR name LIKE '%Shampoo%' LIMIT 1;
    
    -- If subcategories don't exist, use main categories
    IF facial_cleansing_id IS NULL THEN facial_cleansing_id := skin_care_id; END IF;
    IF face_cream_id IS NULL THEN face_cream_id := skin_care_id; END IF;
    IF hair_mask_id IS NULL THEN hair_mask_id := hair_care_id; END IF;
    IF shampoo_id IS NULL THEN shampoo_id := hair_care_id; END IF;
    
    -- Insert 10 test products with various brands
    INSERT INTO products (
        name, 
        brand, 
        price, 
        original_price, 
        stock, 
        status, 
        rating, 
        reviews, 
        image, 
        is_best_seller, 
        is_on_sale, 
        description,
        category_id,
        child_category_id
    ) VALUES
    -- Product 1: AVEDA Hair Care
    (
        'AVEDA Damage Remedy Restructuring Shampoo',
        'AVEDA',
        45.00,
        55.00,
        25,
        'active',
        4.7,
        89,
        '/api/placeholder/400/400',
        true,
        true,
        'Restructuring shampoo that helps repair damaged hair and restore strength',
        hair_care_id,
        shampoo_id
    ),
    -- Product 2: DAVINES Hair Care
    (
        'DAVINES OI All In One Milk',
        'DAVINES',
        38.50,
        NULL,
        42,
        'active',
        4.8,
        156,
        '/api/placeholder/400/400',
        true,
        false,
        'Multi-purpose hair treatment that conditions, detangles, and adds shine',
        hair_care_id,
        hair_mask_id
    ),
    -- Product 3: L''Oreal Skincare
    (
        'L''Oreal Revitalift Anti-Aging Day Cream',
        'L''Oreal',
        32.99,
        42.99,
        67,
        'active',
        4.5,
        234,
        '/api/placeholder/400/400',
        false,
        true,
        'Anti-aging day cream with SPF for daily protection and wrinkle reduction',
        skin_care_id,
        face_cream_id
    ),
    -- Product 4: Moroccanoil Hair Care
    (
        'Moroccanoil Treatment Original',
        'Moroccanoil',
        52.00,
        NULL,
        18,
        'active',
        4.9,
        312,
        '/api/placeholder/400/400',
        true,
        false,
        'Iconic argan oil treatment for all hair types - adds shine and smoothness',
        hair_care_id,
        hair_mask_id
    ),
    -- Product 5: The Ordinary Skincare
    (
        'The Ordinary Niacinamide 10% + Zinc 1%',
        'The Ordinary',
        8.90,
        NULL,
        89,
        'active',
        4.6,
        567,
        '/api/placeholder/400/400',
        false,
        false,
        'High-strength vitamin and mineral formula for blemish-prone skin',
        skin_care_id,
        facial_cleansing_id
    ),
    -- Product 6: Kerastase Hair Care
    (
        'Kerastase Resistance Masque Therapiste',
        'Kerastase',
        68.00,
        78.00,
        31,
        'active',
        4.7,
        198,
        '/api/placeholder/400/400',
        true,
        true,
        'Intensive repair mask for very damaged hair - restores and strengthens',
        hair_care_id,
        hair_mask_id
    ),
    -- Product 7: CeraVe Skincare
    (
        'CeraVe Hydrating Facial Cleanser',
        'CeraVe',
        14.99,
        NULL,
        124,
        'active',
        4.4,
        445,
        '/api/placeholder/400/400',
        false,
        false,
        'Gentle foaming cleanser with ceramides and hyaluronic acid',
        skin_care_id,
        facial_cleansing_id
    ),
    -- Product 8: Redken Hair Care
    (
        'Redken All Soft Mega Shampoo',
        'Redken',
        28.50,
        35.00,
        56,
        'active',
        4.6,
        278,
        '/api/placeholder/400/400',
        false,
        true,
        'Ultra-moisturizing shampoo for dry, brittle hair',
        hair_care_id,
        shampoo_id
    ),
    -- Product 9: La Roche-Posay Skincare
    (
        'La Roche-Posay Toleriane Double Repair Face Moisturizer',
        'La Roche-Posay',
        21.99,
        NULL,
        78,
        'active',
        4.5,
        389,
        '/api/placeholder/400/400',
        false,
        false,
        'Daily face moisturizer with ceramides and niacinamide for sensitive skin',
        skin_care_id,
        face_cream_id
    ),
    -- Product 10: Olaplex Hair Care
    (
        'Olaplex No.3 Hair Perfector',
        'Olaplex',
        28.00,
        32.00,
        43,
        'active',
        4.8,
        512,
        '/api/placeholder/400/400',
        true,
        true,
        'At-home treatment that rebuilds broken hair bonds for stronger, healthier hair',
        hair_care_id,
        hair_mask_id
    )
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE '10 test products inserted successfully!';
    RAISE NOTICE 'Products include: AVEDA, DAVINES, L''Oreal, Moroccanoil, The Ordinary, Kerastase, CeraVe, Redken, La Roche-Posay, and Olaplex';
END $$;


