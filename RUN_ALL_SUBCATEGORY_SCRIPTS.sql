-- IMPORTANT: Run This Script to Add All Subcategories
-- This will add subcategories for Hair Care, Skin Care, and Personal Care
-- Mother and Baby subcategories were already added

-- Step 1: Run Hair Care Subcategories
\i database/scripts/insert-hair-care-categories.sql

-- Step 2: Run Skin Care Subcategories  
\i database/scripts/insert-skin-care-categories.sql

-- Step 3: Run Personal Care Subcategories
\i database/scripts/insert-personal-care-categories.sql

-- Step 4: Verify all subcategories were added
SELECT 
  c1.name as main_category,
  COUNT(c2.id) as subcategory_count
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
WHERE c1.parent_id IS NULL
GROUP BY c1.id, c1.name
ORDER BY c1.id;

