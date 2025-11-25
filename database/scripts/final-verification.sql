-- Final Verification Script for Category Structure
-- Run this to verify all categories are properly set up

-- Check all main categories
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
ORDER BY sort_order, name;

-- Check Personal Care complete structure
SELECT '=== PERSONAL CARE COMPLETE STRUCTURE ===' as info;
SELECT 
  c1.name as main_category,
  c2.name as subcategory,
  c2.sort_order as sub_order,
  c3.name as child_category,
  c3.sort_order as child_order
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN categories c3 ON c3.parent_id = c2.id
WHERE c1.slug = 'personal-care'
ORDER BY c2.sort_order, c3.sort_order;

-- Check Hair Care complete structure
SELECT '=== HAIR CARE COMPLETE STRUCTURE ===' as info;
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

-- Check Dermocosmetic Personal Care specifically
SELECT '=== DERMOCOSMETIC PERSONAL CARE CHILDREN ===' as info;
SELECT 
  c2.name as subcategory,
  c3.name as child_category,
  c3.sort_order
FROM categories c1
JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN categories c3 ON c3.parent_id = c2.id
WHERE c1.slug = 'personal-care' AND c2.slug = 'dermocosmetic-personal-care'
ORDER BY c3.sort_order;

-- Count summary
SELECT '=== CATEGORY COUNTS ===' as info;
SELECT 
  c1.name as main_category,
  COUNT(DISTINCT c2.id) as subcategories,
  COUNT(c3.id) as child_categories,
  COUNT(DISTINCT c2.id) + COUNT(c3.id) as total_subcategories_and_children
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN categories c3 ON c3.parent_id = c2.id
WHERE c1.parent_id IS NULL
GROUP BY c1.id, c1.name, c1.sort_order
ORDER BY c1.sort_order;

-- Check for any orphaned categories
SELECT '=== ORPHANED CATEGORIES CHECK ===' as info;
SELECT 
  c.id,
  c.name,
  c.slug,
  c.parent_id,
  'Orphaned - parent does not exist' as issue
FROM categories c
WHERE c.parent_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM categories p WHERE p.id = c.parent_id);

-- Check for duplicate slugs
SELECT '=== DUPLICATE SLUGS CHECK ===' as info;
SELECT 
  slug,
  COUNT(*) as count,
  STRING_AGG(name, ', ') as names
FROM categories
GROUP BY slug
HAVING COUNT(*) > 1;

