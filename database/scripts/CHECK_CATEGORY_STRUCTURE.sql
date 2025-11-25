-- Diagnostic Script: Check Category Structure
-- Run this to see exactly what's in your database

-- 1. Check Main Categories
SELECT '=== MAIN CATEGORIES ===' as info;
SELECT 
  id, 
  name, 
  slug, 
  parent_id,
  is_active,
  (SELECT COUNT(*) FROM categories c2 WHERE c2.parent_id = categories.id) as subcategory_count
FROM categories 
WHERE parent_id IS NULL 
ORDER BY id;

-- 2. Check Subcategories (Level 2) for Hair Care
SELECT '=== HAIR CARE SUBCATEGORIES ===' as info;
SELECT 
  c2.id,
  c2.name as subcategory,
  c2.slug,
  c2.parent_id,
  (SELECT COUNT(*) FROM categories c3 WHERE c3.parent_id = c2.id) as child_count
FROM categories c1
JOIN categories c2 ON c2.parent_id = c1.id
WHERE c1.slug = 'hair-care'
ORDER BY c2.sort_order, c2.name;

-- 3. Check Subcategories for Skin Care
SELECT '=== SKIN CARE SUBCATEGORIES ===' as info;
SELECT 
  c2.id,
  c2.name as subcategory,
  c2.slug,
  c2.parent_id,
  (SELECT COUNT(*) FROM categories c3 WHERE c3.parent_id = c2.id) as child_count
FROM categories c1
JOIN categories c2 ON c2.parent_id = c1.id
WHERE c1.slug = 'skin-care'
ORDER BY c2.sort_order, c2.name;

-- 4. Check Subcategories for Personal Care
SELECT '=== PERSONAL CARE SUBCATEGORIES ===' as info;
SELECT 
  c2.id,
  c2.name as subcategory,
  c2.slug,
  c2.parent_id,
  (SELECT COUNT(*) FROM categories c3 WHERE c3.parent_id = c2.id) as child_count
FROM categories c1
JOIN categories c2 ON c2.parent_id = c1.id
WHERE c1.slug = 'personal-care'
ORDER BY c2.sort_order, c2.name;

-- 5. Check Subcategories for Mother and Baby
SELECT '=== MOTHER AND BABY SUBCATEGORIES ===' as info;
SELECT 
  c2.id,
  c2.name as subcategory,
  c2.slug,
  c2.parent_id,
  (SELECT COUNT(*) FROM categories c3 WHERE c3.parent_id = c2.id) as child_count
FROM categories c1
JOIN categories c2 ON c2.parent_id = c1.id
WHERE c1.slug = 'mother-baby'
ORDER BY c2.sort_order, c2.name;

-- 6. Find any orphaned categories (categories with invalid parent_id)
SELECT '=== ORPHANED CATEGORIES (CHECK THIS!) ===' as info;
SELECT 
  id,
  name,
  slug,
  parent_id,
  'Parent not found' as issue
FROM categories c1
WHERE c1.parent_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM categories c2 WHERE c2.id = c1.parent_id
  );

-- 7. Count TOTAL categories at each level
SELECT '=== CATEGORY COUNTS BY LEVEL ===' as info;
WITH categorized AS (
  SELECT 
    CASE 
      WHEN c.parent_id IS NULL THEN 'Level 1 (Main Categories)'
      WHEN EXISTS (SELECT 1 FROM categories c2 WHERE c2.parent_id = c.id) THEN 'Level 3 (Child Categories)'
      ELSE 'Level 2 (Subcategories)'
    END as level,
    CASE 
      WHEN c.parent_id IS NULL THEN 1
      WHEN EXISTS (SELECT 1 FROM categories c2 WHERE c2.parent_id = c.id) THEN 3
      ELSE 2
    END as level_order
  FROM categories c
  WHERE c.is_active = true
)
SELECT level, COUNT(*) as count
FROM categorized
GROUP BY level, level_order
ORDER BY level_order;

