-- Update Skin Care Categories Organization
-- Run this in your Supabase SQL Editor to reorganize the subcategories

-- Update the sort_order for better organization of Skin Care subcategories
-- This will organize them in a more logical flow: Cleansing → Treatment → Care → Specialized

-- 1. Facial Cleansing (First - Start with cleansing)
UPDATE subcategories 
SET sort_order = 1 
WHERE slug = 'facial-cleansing' AND category_id = (SELECT id FROM categories WHERE slug = 'skin-care');

-- 2. Face Cream (Second - Basic moisturizing)
UPDATE subcategories 
SET sort_order = 2 
WHERE slug = 'face-cream' AND category_id = (SELECT id FROM categories WHERE slug = 'skin-care');

-- 3. Face Serum (Third - Targeted treatments)
UPDATE subcategories 
SET sort_order = 3 
WHERE slug = 'face-serum' AND category_id = (SELECT id FROM categories WHERE slug = 'skin-care');

-- 4. Face Mask (Fourth - Weekly treatments)
UPDATE subcategories 
SET sort_order = 4 
WHERE slug = 'face-mask' AND category_id = (SELECT id FROM categories WHERE slug = 'skin-care');

-- 5. Eye Contour Care (Fifth - Specialized area care)
UPDATE subcategories 
SET sort_order = 5 
WHERE slug = 'eye-contour-care' AND category_id = (SELECT id FROM categories WHERE slug = 'skin-care');

-- 6. Lip Care (Sixth - Specialized area care)
UPDATE subcategories 
SET sort_order = 6 
WHERE slug = 'lip-care' AND category_id = (SELECT id FROM categories WHERE slug = 'skin-care');

-- 7. Dermocosmetic Skin Care (Last - Professional/Medical grade)
UPDATE subcategories 
SET sort_order = 8 
WHERE slug = 'dermocosmetic-skin-care' AND category_id = (SELECT id FROM categories WHERE slug = 'skin-care');

-- Now let's also reorganize some sub-subcategories for better flow
-- Face Cream sub-subcategories (reorganize by skin type priority)
UPDATE subcategories 
SET sort_order = 1 
WHERE slug = 'face-cream-moisturizer' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'face-cream');

UPDATE subcategories 
SET sort_order = 2 
WHERE slug = 'face-cream-sensitive-skin' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'face-cream');

UPDATE subcategories 
SET sort_order = 3 
WHERE slug = 'face-cream-oily-skin' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'face-cream');

UPDATE subcategories 
SET sort_order = 4 
WHERE slug = 'face-cream-anti-aging' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'face-cream');

UPDATE subcategories 
SET sort_order = 5 
WHERE slug = 'face-cream-anti-stain' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'face-cream');

-- Face Serum sub-subcategories (reorganize by treatment priority)
UPDATE subcategories 
SET sort_order = 1 
WHERE slug = 'face-serum-enlightening' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'face-serum');

UPDATE subcategories 
SET sort_order = 2 
WHERE slug = 'face-serum-anti-wrinkle' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'face-serum');

UPDATE subcategories 
SET sort_order = 3 
WHERE slug = 'face-serum-loss-of-firmness' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'face-serum');

UPDATE subcategories 
SET sort_order = 4 
WHERE slug = 'face-serum-anti-stain' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'face-serum');

UPDATE subcategories 
SET sort_order = 5 
WHERE slug = 'face-serum-oily-skin' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'face-serum');

-- Face Mask sub-subcategories (reorganize by treatment type)
UPDATE subcategories 
SET sort_order = 1 
WHERE slug = 'face-mask-cleaning' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'face-mask');

UPDATE subcategories 
SET sort_order = 2 
WHERE slug = 'face-mask-moisturizer' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'face-mask');

UPDATE subcategories 
SET sort_order = 3 
WHERE slug = 'face-mask-enlightening' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'face-mask');

UPDATE subcategories 
SET sort_order = 4 
WHERE slug = 'face-mask-oily-skin' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'face-mask');

UPDATE subcategories 
SET sort_order = 5 
WHERE slug = 'face-mask-loss-of-firmness' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'face-mask');

-- Facial Cleansing sub-subcategories (reorganize by skin type)
UPDATE subcategories 
SET sort_order = 1 
WHERE slug = 'facial-cleansing-moisturizer' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'facial-cleansing');

UPDATE subcategories 
SET sort_order = 2 
WHERE slug = 'facial-cleansing-sensitive-skin' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'facial-cleansing');

UPDATE subcategories 
SET sort_order = 3 
WHERE slug = 'facial-cleansing-oily-skin' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'facial-cleansing');

UPDATE subcategories 
SET sort_order = 4 
WHERE slug = 'facial-cleansing-purifying' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'facial-cleansing');

UPDATE subcategories 
SET sort_order = 5 
WHERE slug = 'facial-cleansing-makeup-remover' AND parent_id = (SELECT id FROM subcategories WHERE slug = 'facial-cleansing');

-- Verify the new organization
SELECT 
    c.name as main_category,
    s1.name as subcategory,
    s1.sort_order as sub_sort,
    s2.name as sub_subcategory,
    s2.sort_order as sub_sub_sort
FROM categories c
LEFT JOIN subcategories s1 ON s1.category_id = c.id AND s1.parent_id IS NULL
LEFT JOIN subcategories s2 ON s2.parent_id = s1.id
WHERE c.name = 'Skin Care'
ORDER BY s1.sort_order, s2.sort_order;
