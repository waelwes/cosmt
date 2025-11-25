-- Verify Baby Sunscreens Brands Are in Database
-- Run this to check if the brands were added

SELECT 
  c1.name as main_category,
  c2.name as subcategory,
  COUNT(c3.id) as brand_count,
  STRING_AGG(c3.name, ', ' ORDER BY c3.name) as brands
FROM categories c1
JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN categories c3 ON c3.parent_id = c2.id
WHERE c1.slug = 'mother-baby' 
  AND c2.slug = 'baby-sunscreens'
GROUP BY c1.name, c2.name;

-- If the above shows 0 brands, run the insert script
-- If it shows the brands, the issue is in the frontend code

