-- Insert Mother and Baby Category Structure
-- This script creates the main category and all subcategories

-- Step 1: Insert the main "Mother and Baby" category
INSERT INTO categories (name, slug, description, parent_id, meta_title, meta_description, is_active, sort_order)
VALUES (
  'Mother and Baby',
  'mother-baby',
  'Essential products for maternal care and baby care needs',
  NULL,
  'Mother and Baby Products | Maternal Care & Baby Essentials | COSMAT',
  'Shop premium maternal care and baby products. From breastfeeding supplies to baby skincare, find everything you need for mother and baby wellness.',
  true,
  9
) ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description;

-- Get the main category ID
DO $$
DECLARE
  mother_baby_id INTEGER;
BEGIN
  SELECT id INTO mother_baby_id FROM categories WHERE slug = 'mother-baby';

  -- Step 2: Insert Level 1 Subcategories (Main subcategories)
  
  -- Maternal Care and Breastfeeding
  INSERT INTO categories (name, slug, description, parent_id, meta_title, meta_description, is_active, sort_order)
  VALUES (
    'Maternal Care and Breastfeeding',
    'maternal-care-breastfeeding',
    'Essential products for nursing mothers and breastfeeding support',
    mother_baby_id,
    'Maternal Care & Breastfeeding Products | COSMAT',
    'Shop nursing essentials including breast pumps, nipple cream, breast pads, and milk storage solutions.',
    true,
    1
  ) ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

  -- Baby Bath Products
  INSERT INTO categories (name, slug, description, parent_id, meta_title, meta_description, is_active, sort_order)
  VALUES (
    'Baby Bath Products',
    'baby-bath-products',
    'Gentle bath and cleansing products for babies',
    mother_baby_id,
    'Baby Bath Products | Baby Soap & Shampoo | COSMAT',
    'Shop baby-friendly bath products including soaps, shampoos, body cleansers, and hair conditioners.',
    true,
    2
  ) ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

  -- Baby Sunscreens
  INSERT INTO categories (name, slug, description, parent_id, meta_title, meta_description, is_active, sort_order)
  VALUES (
    'Baby Sunscreens',
    'baby-sunscreens',
    'Baby-safe sun protection products',
    mother_baby_id,
    'Baby Sunscreen | Baby Sun Protection | COSMAT',
    'Protect your baby''s delicate skin with baby-safe sunscreens from Mustela, Avene, Vichy, and more.',
    true,
    3
  ) ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

  -- Baby Body Care Products
  INSERT INTO categories (name, slug, description, parent_id, meta_title, meta_description, is_active, sort_order)
  VALUES (
    'Baby Body Care Products',
    'baby-body-care',
    'Baby body care essentials for healthy skin',
    mother_baby_id,
    'Baby Body Care | Diaper Rash Cream & Baby Oil | COSMAT',
    'Essential baby body care products including diaper rash cream, baby oil, and baby cologne.',
    true,
    4
  ) ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

  -- Baby Oral Care Products
  INSERT INTO categories (name, slug, description, parent_id, meta_title, meta_description, is_active, sort_order)
  VALUES (
    'Baby Oral Care Products',
    'baby-oral-care',
    'Oral hygiene products for babies',
    mother_baby_id,
    'Baby Oral Care | Baby Toothbrush & Toothpaste | COSMAT',
    'Essential oral care products for babies including toothbrushes and toothpaste.',
    true,
    5
  ) ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

  -- Baby Feeding Supplies
  INSERT INTO categories (name, slug, description, parent_id, meta_title, meta_description, is_active, sort_order)
  VALUES (
    'Baby Feeding Supplies',
    'baby-feeding-supplies',
    'Essential feeding products for babies',
    mother_baby_id,
    'Baby Feeding Supplies | Bottles, Pacifiers & More | COSMAT',
    'Shop baby feeding essentials including bottles, pacifiers, exercise cups, and feeding utensils.',
    true,
    6
  ) ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

  -- Diaper and Wet Wipes
  INSERT INTO categories (name, slug, description, parent_id, meta_title, meta_description, is_active, sort_order)
  VALUES (
    'Diaper and Wet Wipes',
    'diaper-wet-wipes',
    'Baby diapers and wipes for daily care',
    mother_baby_id,
    'Baby Diapers & Wipes | Baby Care Essentials | COSMAT',
    'Shop baby diapers and wet wipes for complete baby care and hygiene.',
    true,
    7
  ) ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

  -- Dermocosmetic Baby Products
  INSERT INTO categories (name, slug, description, parent_id, meta_title, meta_description, is_active, sort_order)
  VALUES (
    'Dermocosmetic Baby Products',
    'dermocosmetic-baby-products',
    'Professional dermatological baby care products',
    mother_baby_id,
    'Dermocosmetic Baby Products | Baby Skincare | COSMAT',
    'Premium dermatological baby care products including hygiene items, oils, creams, and complete care kits.',
    true,
    8
  ) ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

  -- Step 3: Get Level 1 subcategory IDs and insert Level 2 (child subcategories)

  -- Maternal Care and Breastfeeding - Child categories
  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Breast Pump',
    'breast-pump',
    'Breast pumping equipment and accessories',
    id,
    true,
    1
  FROM categories WHERE slug = 'maternal-care-breastfeeding'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Nipple Cream',
    'nipple-cream',
    'Soothing creams for nursing mothers',
    id,
    true,
    2
  FROM categories WHERE slug = 'maternal-care-breastfeeding'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Breast Pad',
    'breast-pad',
    'Nursing pads for breastfeeding comfort',
    id,
    true,
    3
  FROM categories WHERE slug = 'maternal-care-breastfeeding'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Milk Storage Bag',
    'milk-storage-bag',
    'Storage solutions for breast milk',
    id,
    true,
    4
  FROM categories WHERE slug = 'maternal-care-breastfeeding'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  -- Baby Bath Products - Child categories
  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Baby Soaps',
    'baby-soaps',
    'Gentle baby soaps',
    id,
    true,
    1
  FROM categories WHERE slug = 'baby-bath-products'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Baby Shampoos',
    'baby-shampoos',
    'Baby-friendly shampoo products',
    id,
    true,
    2
  FROM categories WHERE slug = 'baby-bath-products'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Body Cleansers',
    'body-cleansers',
    'Baby body cleansing products',
    id,
    true,
    3
  FROM categories WHERE slug = 'baby-bath-products'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Baby Hair Conditioners',
    'baby-hair-conditioners',
    'Conditioning products for baby hair',
    id,
    true,
    4
  FROM categories WHERE slug = 'baby-bath-products'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  -- Baby Body Care Products - Child categories
  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Diaper Rash Cream',
    'diaper-rash-cream',
    'Creams for treating and preventing diaper rash',
    id,
    true,
    1
  FROM categories WHERE slug = 'baby-body-care'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Baby Oil',
    'baby-oil',
    'Moisturizing oils for baby skin',
    id,
    true,
    2
  FROM categories WHERE slug = 'baby-body-care'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Baby Cologne',
    'baby-cologne',
    'Gentle fragrances for babies',
    id,
    true,
    3
  FROM categories WHERE slug = 'baby-body-care'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  -- Baby Oral Care Products - Child categories
  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Baby Toothbrushes',
    'baby-toothbrushes',
    'Toothbrushes designed for babies',
    id,
    true,
    1
  FROM categories WHERE slug = 'baby-oral-care'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Baby Toothpastes',
    'baby-toothpastes',
    'Safe toothpaste for babies and toddlers',
    id,
    true,
    2
  FROM categories WHERE slug = 'baby-oral-care'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  -- Baby Feeding Supplies - Child categories
  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Bottle',
    'bottle',
    'Baby feeding bottles',
    id,
    true,
    1
  FROM categories WHERE slug = 'baby-feeding-supplies'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Pacifier',
    'pacifier',
    'Baby pacifiers and soothers',
    id,
    true,
    2
  FROM categories WHERE slug = 'baby-feeding-supplies'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Exercise Cups',
    'exercise-cups',
    'Training cups for babies',
    id,
    true,
    3
  FROM categories WHERE slug = 'baby-feeding-supplies'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Baby Fork and Spoon',
    'baby-fork-spoon',
    'Eating utensils for babies',
    id,
    true,
    4
  FROM categories WHERE slug = 'baby-feeding-supplies'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  -- Diaper and Wet Wipes - Child categories
  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Baby Diaper',
    'baby-diaper',
    'Disposable and cloth baby diapers',
    id,
    true,
    1
  FROM categories WHERE slug = 'diaper-wet-wipes'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Baby wipes',
    'baby-wipes',
    'Baby cleaning wipes and towelettes',
    id,
    true,
    2
  FROM categories WHERE slug = 'diaper-wet-wipes'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  -- Dermocosmetic Baby Products - Child categories
  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Baby Hygiene Products',
    'baby-hygiene-products',
    'Professional baby hygiene essentials',
    id,
    true,
    1
  FROM categories WHERE slug = 'dermocosmetic-baby-products'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Baby Care Oil',
    'baby-care-oil',
    'Dermatological baby care oils',
    id,
    true,
    2
  FROM categories WHERE slug = 'dermocosmetic-baby-products'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Baby Care Cream',
    'baby-care-cream',
    'Medical-grade baby care creams',
    id,
    true,
    3
  FROM categories WHERE slug = 'dermocosmetic-baby-products'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Baby Care Kit',
    'baby-care-kit',
    'Complete baby care product sets',
    id,
    true,
    4
  FROM categories WHERE slug = 'dermocosmetic-baby-products'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  SELECT 
    'Baby Shampoo',
    'baby-shampoo-dermocosmetic',
    'Dermatological baby shampoo',
    id,
    true,
    5
  FROM categories WHERE slug = 'dermocosmetic-baby-products'
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

  RAISE NOTICE 'Mother and Baby category structure created successfully!';
END $$;

