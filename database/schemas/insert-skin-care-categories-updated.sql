-- Insert Skin Care Categories into COSMT Database
-- Updated to work with existing schema structure
-- Run this in your Supabase SQL Editor

-- First, let's insert the main Skin Care category
INSERT INTO categories (name, slug, description, sort_order, is_active, meta_title, meta_description) VALUES
('Skin Care', 'skin-care', 'Complete skin care solutions for all skin types', 1, true, 'Skin Care Products - Complete Beauty Solutions', 'Discover our comprehensive range of skin care products for all skin types and concerns.');

-- Get the main category ID for reference
-- Insert Face Cream subcategory
INSERT INTO subcategories (name, slug, description, category_id, sort_order, is_active, meta_title, meta_description) VALUES
('Face Cream', 'face-cream', 'Moisturizing and nourishing face creams', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), 1, true, 'Face Cream - Moisturizing Solutions', 'Hydrating face creams for all skin types and concerns.');

-- Insert Face Serum subcategory
INSERT INTO subcategories (name, slug, description, category_id, sort_order, is_active, meta_title, meta_description) VALUES
('Face Serum', 'face-serum', 'Concentrated serums for targeted skin concerns', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), 2, true, 'Face Serum - Targeted Skin Solutions', 'Concentrated serums for specific skin concerns and treatments.');

-- Insert Face Mask subcategory
INSERT INTO subcategories (name, slug, description, category_id, sort_order, is_active, meta_title, meta_description) VALUES
('Face Mask', 'face-mask', 'Treatment masks for various skin needs', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), 3, true, 'Face Mask - Treatment Solutions', 'Specialized face masks for different skin treatments and concerns.');

-- Insert Facial Cleansing subcategory
INSERT INTO subcategories (name, slug, description, category_id, sort_order, is_active, meta_title, meta_description) VALUES
('Facial Cleansing', 'facial-cleansing', 'Gentle and effective facial cleansing products', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), 4, true, 'Facial Cleansing - Clean & Fresh Skin', 'Gentle and effective facial cleansing products for all skin types.');

-- Insert Lip Care subcategory
INSERT INTO subcategories (name, slug, description, category_id, sort_order, is_active, meta_title, meta_description) VALUES
('Lip Care', 'lip-care', 'Nourishing and protective lip care products', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), 5, true, 'Lip Care - Nourish & Protect', 'Complete lip care solutions for healthy, beautiful lips.');

-- Insert Eye Contour Care subcategory
INSERT INTO subcategories (name, slug, description, category_id, sort_order, is_active, meta_title, meta_description) VALUES
('Eye Contour Care', 'eye-contour-care', 'Specialized care for the delicate eye area', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), 6, true, 'Eye Contour Care - Delicate Area Treatment', 'Specialized treatments for the delicate eye contour area.');

-- Insert Dermocosmetic Skin Care subcategory
INSERT INTO subcategories (name, slug, description, category_id, sort_order, is_active, meta_title, meta_description) VALUES
('Dermocosmetic Skin Care', 'dermocosmetic-skin-care', 'Medical-grade skin care products', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), 7, true, 'Dermocosmetic Skin Care - Medical Grade', 'Professional-grade skin care products for advanced treatments.');

-- Now insert the sub-subcategories for Face Cream
INSERT INTO subcategories (name, slug, description, category_id, parent_id, sort_order, is_active, meta_title, meta_description) VALUES
('Moisturizer', 'face-cream-moisturizer', 'Hydrating face creams for all skin types', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'face-cream'), 1, true, 'Moisturizer Face Cream', 'Hydrating face creams for all skin types.'),
('Anti-Stain', 'face-cream-anti-stain', 'Face creams to reduce dark spots and stains', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'face-cream'), 2, true, 'Anti-Stain Face Cream', 'Face creams to reduce dark spots and stains.'),
('Sensitive Skin', 'face-cream-sensitive-skin', 'Gentle face creams for sensitive skin', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'face-cream'), 3, true, 'Sensitive Skin Face Cream', 'Gentle face creams specially formulated for sensitive skin.'),
('Anti-Aging', 'face-cream-anti-aging', 'Anti-aging face creams with advanced ingredients', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'face-cream'), 4, true, 'Anti-Aging Face Cream', 'Advanced anti-aging face creams with powerful ingredients.'),
('Oily Skin', 'face-cream-oily-skin', 'Lightweight face creams for oily skin', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'face-cream'), 5, true, 'Oily Skin Face Cream', 'Lightweight, non-greasy face creams for oily skin.');

-- Insert sub-subcategories for Face Serum
INSERT INTO subcategories (name, slug, description, category_id, parent_id, sort_order, is_active, meta_title, meta_description) VALUES
('Anti-Wrinkle', 'face-serum-anti-wrinkle', 'Concentrated serums to reduce wrinkles', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'face-serum'), 1, true, 'Anti-Wrinkle Face Serum', 'Concentrated serums to reduce and prevent wrinkles.'),
('Enlightening', 'face-serum-enlightening', 'Brightening serums for radiant skin', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'face-serum'), 2, true, 'Enlightening Face Serum', 'Brightening serums for radiant, glowing skin.'),
('Loss of Firmness', 'face-serum-loss-of-firmness', 'Firming serums for skin elasticity', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'face-serum'), 3, true, 'Firming Face Serum', 'Firming serums to improve skin elasticity and firmness.'),
('Anti-Stain', 'face-serum-anti-stain', 'Serums to reduce dark spots and hyperpigmentation', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'face-serum'), 4, true, 'Anti-Stain Face Serum', 'Serums to reduce dark spots and hyperpigmentation.'),
('Oily Skin', 'face-serum-oily-skin', 'Lightweight serums for oily skin', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'face-serum'), 5, true, 'Oily Skin Face Serum', 'Lightweight, oil-free serums for oily skin.');

-- Insert sub-subcategories for Face Mask
INSERT INTO subcategories (name, slug, description, category_id, parent_id, sort_order, is_active, meta_title, meta_description) VALUES
('Enlightening', 'face-mask-enlightening', 'Brightening face masks for radiant skin', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'face-mask'), 1, true, 'Enlightening Face Mask', 'Brightening face masks for radiant, glowing skin.'),
('Oily Skin', 'face-mask-oily-skin', 'Purifying face masks for oily skin', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'face-mask'), 2, true, 'Oily Skin Face Mask', 'Purifying face masks for oily and combination skin.'),
('Loss of Firmness', 'face-mask-loss-of-firmness', 'Firming face masks for skin elasticity', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'face-mask'), 3, true, 'Firming Face Mask', 'Firming face masks to improve skin elasticity.'),
('Cleaning', 'face-mask-cleaning', 'Deep cleansing face masks', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'face-mask'), 4, true, 'Cleansing Face Mask', 'Deep cleansing face masks for thorough skin purification.'),
('Moisturizer', 'face-mask-moisturizer', 'Hydrating face masks for dry skin', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'face-mask'), 5, true, 'Moisturizing Face Mask', 'Hydrating face masks for dry and dehydrated skin.');

-- Insert sub-subcategories for Facial Cleansing
INSERT INTO subcategories (name, slug, description, category_id, parent_id, sort_order, is_active, meta_title, meta_description) VALUES
('Moisturizer', 'facial-cleansing-moisturizer', 'Moisturizing facial cleansers', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'facial-cleansing'), 1, true, 'Moisturizing Facial Cleanser', 'Moisturizing facial cleansers for dry skin.'),
('Makeup Remover', 'facial-cleansing-makeup-remover', 'Effective makeup removal products', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'facial-cleansing'), 2, true, 'Makeup Remover', 'Effective makeup removal products for all skin types.'),
('Purifying', 'facial-cleansing-purifying', 'Deep purifying facial cleansers', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'facial-cleansing'), 3, true, 'Purifying Facial Cleanser', 'Deep purifying facial cleansers for oily skin.'),
('Sensitive Skin', 'facial-cleansing-sensitive-skin', 'Gentle cleansers for sensitive skin', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'facial-cleansing'), 4, true, 'Sensitive Skin Cleanser', 'Gentle facial cleansers for sensitive skin.'),
('Oily Skin', 'facial-cleansing-oily-skin', 'Oil-control facial cleansers', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'facial-cleansing'), 5, true, 'Oily Skin Cleanser', 'Oil-control facial cleansers for oily skin.');

-- Insert sub-subcategories for Lip Care
INSERT INTO subcategories (name, slug, description, category_id, parent_id, sort_order, is_active, meta_title, meta_description) VALUES
('Dermocosmetics', 'lip-care-dermocosmetics', 'Medical-grade lip care products', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'lip-care'), 1, true, 'Dermocosmetic Lip Care', 'Medical-grade lip care products for professional treatment.'),
('Cream', 'lip-care-cream', 'Nourishing lip creams and balms', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'lip-care'), 2, true, 'Lip Cream & Balm', 'Nourishing lip creams and balms for healthy lips.'),
('Lipstick', 'lip-care-lipstick', 'Moisturizing and protective lipsticks', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'lip-care'), 3, true, 'Moisturizing Lipstick', 'Moisturizing and protective lipsticks with skincare benefits.');

-- Insert sub-subcategories for Eye Contour Care
INSERT INTO subcategories (name, slug, description, category_id, parent_id, sort_order, is_active, meta_title, meta_description) VALUES
('Enlightening', 'eye-contour-enlightening', 'Brightening eye contour treatments', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'eye-contour-care'), 1, true, 'Enlightening Eye Contour', 'Brightening treatments for the eye contour area.'),
('Loss of Firmness', 'eye-contour-loss-of-firmness', 'Firming eye contour treatments', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'eye-contour-care'), 2, true, 'Firming Eye Contour', 'Firming treatments for the eye contour area.'),
('Sensitive Skin', 'eye-contour-sensitive-skin', 'Gentle eye contour care for sensitive skin', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), (SELECT id FROM subcategories WHERE slug = 'eye-contour-care'), 3, true, 'Sensitive Eye Contour Care', 'Gentle eye contour care for sensitive skin.');

-- Verify the data was inserted correctly
SELECT 
    c.name as main_category,
    s1.name as subcategory,
    s2.name as sub_subcategory,
    c.slug as main_slug,
    s1.slug as sub_slug,
    s2.slug as sub_sub_slug
FROM categories c
LEFT JOIN subcategories s1 ON s1.category_id = c.id AND s1.parent_id IS NULL
LEFT JOIN subcategories s2 ON s2.parent_id = s1.id
WHERE c.name = 'Skin Care'
ORDER BY c.sort_order, s1.sort_order, s2.sort_order;

-- Show the complete category tree
WITH RECURSIVE category_tree AS (
    SELECT 
        c.id,
        c.name,
        c.slug,
        NULL::integer as parent_id,
        c.sort_order,
        ARRAY[c.name]::text[] as path,
        0 as depth,
        'category' as type
    FROM categories c
    WHERE c.name = 'Skin Care'
    
    UNION ALL
    
    SELECT 
        s.id,
        s.name,
        s.slug,
        s.parent_id,
        s.sort_order,
        ct.path || s.name,
        ct.depth + 1,
        'subcategory' as type
    FROM subcategories s
    JOIN category_tree ct ON s.parent_id = ct.id OR (s.category_id = ct.id AND s.parent_id IS NULL)
)
SELECT 
    REPEAT('  ', depth) || name as category_hierarchy,
    slug,
    type
FROM category_tree
ORDER BY path, sort_order;

-- Count the inserted categories
SELECT 
    'Main Categories' as level,
    COUNT(*) as count
FROM categories 
WHERE name = 'Skin Care'

UNION ALL

SELECT 
    'Subcategories' as level,
    COUNT(*) as count
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Skin Care' AND s.parent_id IS NULL

UNION ALL

SELECT 
    'Sub-subcategories' as level,
    COUNT(*) as count
FROM subcategories s2
JOIN subcategories s1 ON s2.parent_id = s1.id
JOIN categories c ON s1.category_id = c.id
WHERE c.name = 'Skin Care';
