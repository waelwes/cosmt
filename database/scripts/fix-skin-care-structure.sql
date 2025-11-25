-- Fix Skin Care Category Structure
-- This will update the child categories to match the correct structure

DO $$
DECLARE
  skin_care_id INTEGER;
  face_cream_id INTEGER;
  face_serum_id INTEGER;
  face_mask_id INTEGER;
  facial_cleansing_id INTEGER;
  lip_care_id INTEGER;
  eye_contour_id INTEGER;
  dermocosmetic_id INTEGER;
BEGIN
  -- Get Skin Care category ID
  SELECT id INTO skin_care_id FROM categories WHERE slug = 'skin-care';
  
  IF skin_care_id IS NULL THEN
    RAISE EXCEPTION 'Skin Care category not found.';
  END IF;

  RAISE NOTICE 'Fixing Skin Care structure...';

  -- Get subcategory IDs
  SELECT id INTO face_cream_id FROM categories WHERE slug = 'face-cream' AND parent_id = skin_care_id;
  SELECT id INTO face_serum_id FROM categories WHERE slug = 'face-serum' AND parent_id = skin_care_id;
  SELECT id INTO face_mask_id FROM categories WHERE slug = 'face-mask' AND parent_id = skin_care_id;
  SELECT id INTO facial_cleansing_id FROM categories WHERE slug = 'facial-cleansing' AND parent_id = skin_care_id;
  SELECT id INTO lip_care_id FROM categories WHERE slug = 'lip-care' AND parent_id = skin_care_id;
  SELECT id INTO eye_contour_id FROM categories WHERE slug = 'eye-contour-care' AND parent_id = skin_care_id;
  SELECT id INTO dermocosmetic_id FROM categories WHERE slug = 'dermocosmetic-skin-care' AND parent_id = skin_care_id;

  RAISE NOTICE 'Updating child categories...';

  -- Insert/Update Face Cream child categories
  IF face_cream_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order) VALUES
    ('Moisturizer', 'face-cream-moisturizer', 'Moisturizing face cream', face_cream_id, true, 1),
    ('Anti-Stain', 'face-cream-anti-stain', 'Anti-stain cream', face_cream_id, true, 2),
    ('Sensitive Skin', 'face-cream-sensitive-skin', 'Cream for sensitive skin', face_cream_id, true, 3),
    ('Anti-Aging', 'face-cream-anti-aging', 'Anti-aging cream', face_cream_id, true, 4),
    ('Oily Skin', 'face-cream-oily-skin', 'Cream for oily skin', face_cream_id, true, 5)
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      parent_id = face_cream_id,
      is_active = EXCLUDED.is_active,
      sort_order = EXCLUDED.sort_order;
  END IF;

  -- Insert/Update Face Serum child categories
  IF face_serum_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order) VALUES
    ('Anti-Wrinkle', 'face-serum-anti-wrinkle', 'Anti-wrinkle serum', face_serum_id, true, 1),
    ('Enlightening', 'face-serum-enlightening', 'Brightening serum', face_serum_id, true, 2),
    ('Loss of Firmness', 'face-serum-loss-of-firmness', 'Firming serum', face_serum_id, true, 3),
    ('Anti-Stain', 'face-serum-anti-stain', 'Anti-stain serum', face_serum_id, true, 4),
    ('Oily Skin', 'face-serum-oily-skin', 'Serum for oily skin', face_serum_id, true, 5)
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      parent_id = face_serum_id,
      is_active = EXCLUDED.is_active,
      sort_order = EXCLUDED.sort_order;
  END IF;

  -- Insert/Update Face Mask child categories
  IF face_mask_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order) VALUES
    ('Enlightening', 'face-mask-enlightening', 'Brightening mask', face_mask_id, true, 1),
    ('Oily Skin', 'face-mask-oily-skin', 'Mask for oily skin', face_mask_id, true, 2),
    ('Loss of Firmness', 'face-mask-loss-of-firmness', 'Firming mask', face_mask_id, true, 3),
    ('Cleaning', 'face-mask-cleaning', 'Cleansing mask', face_mask_id, true, 4),
    ('Moisturizer', 'face-mask-moisturizer', 'Moisturizing mask', face_mask_id, true, 5)
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      parent_id = face_mask_id,
      is_active = EXCLUDED.is_active,
      sort_order = EXCLUDED.sort_order;
  END IF;

  -- Insert/Update Facial Cleansing child categories
  IF facial_cleansing_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order) VALUES
    ('Moisturizer', 'facial-cleansing-moisturizer', 'Moisturizing cleanser', facial_cleansing_id, true, 1),
    ('Makeup Remover', 'facial-cleansing-makeup-remover', 'Makeup removal products', facial_cleansing_id, true, 2),
    ('Purifying', 'facial-cleansing-purifying', 'Purifying cleanser', facial_cleansing_id, true, 3),
    ('Sensitive Skin', 'facial-cleansing-sensitive-skin', 'Cleanser for sensitive skin', facial_cleansing_id, true, 4),
    ('Oily Skin', 'facial-cleansing-oily-skin', 'Cleanser for oily skin', facial_cleansing_id, true, 5)
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      parent_id = facial_cleansing_id,
      is_active = EXCLUDED.is_active,
      sort_order = EXCLUDED.sort_order;
  END IF;

  -- Insert/Update Lip Care child categories
  IF lip_care_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order) VALUES
    ('Dermocosmetics', 'lip-care-dermocosmetics', 'Medical-grade lip care', lip_care_id, true, 1),
    ('Cream', 'lip-care-cream', 'Lip cream', lip_care_id, true, 2),
    ('Lipstick', 'lip-care-lipstick', 'Lip color products', lip_care_id, true, 3)
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      parent_id = lip_care_id,
      is_active = EXCLUDED.is_active,
      sort_order = EXCLUDED.sort_order;
  END IF;

  -- Insert/Update Eye Contour Care child categories
  IF eye_contour_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order) VALUES
    ('Enlightening', 'eye-contour-enlightening', 'Brightening eye cream', eye_contour_id, true, 1),
    ('Loss of Firmness', 'eye-contour-loss-of-firmness', 'Firming eye cream', eye_contour_id, true, 2),
    ('Sensitive Skin', 'eye-contour-sensitive-skin', 'Eye cream for sensitive skin', eye_contour_id, true, 3)
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      parent_id = eye_contour_id,
      is_active = EXCLUDED.is_active,
      sort_order = EXCLUDED.sort_order;
  END IF;

  RAISE NOTICE '✅ Skin Care structure fixed successfully!';
END $$;

-- Verify the corrected structure
SELECT 
  c1.name as main_category,
  c2.name as subcategory,
  c3.name as child_category,
  c3.slug
FROM categories c1
JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN categories c3 ON c3.parent_id = c2.id
WHERE c1.slug = 'skin-care'
ORDER BY c2.sort_order, c3.sort_order;

