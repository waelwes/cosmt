-- Move Dermocosmetic Skin Care to Last Column
-- Run this in your Supabase SQL Editor

-- Move Dermocosmetic Skin Care to sort_order 8 (last position)
UPDATE subcategories 
SET sort_order = 8 
WHERE slug = 'dermocosmetic-skin-care' AND category_id = (SELECT id FROM categories WHERE slug = 'skin-care');

-- Verify the new order
SELECT 
    name as subcategory,
    sort_order,
    CASE 
        WHEN sort_order <= 4 THEN 'Column 1-4'
        WHEN sort_order <= 8 THEN 'Column 5-8'
        ELSE 'Other'
    END as column_position
FROM subcategories 
WHERE category_id = (SELECT id FROM categories WHERE slug = 'skin-care') 
AND parent_id IS NULL
ORDER BY sort_order;
