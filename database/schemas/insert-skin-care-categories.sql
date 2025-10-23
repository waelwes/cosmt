-- Insert Skin Care Categories into COSMT Database
-- Run this in your Supabase SQL Editor

-- First, create the categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(500),
  parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  level INTEGER NOT NULL DEFAULT 1, -- 1 for main categories, 2 for subcategories, 3 for sub-subcategories
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_level ON categories(level);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- Enable RLS on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for categories (allow all operations for now)
DROP POLICY IF EXISTS "Enable all operations on categories" ON categories;
CREATE POLICY "Enable all operations on categories" ON categories FOR ALL USING (true);

-- Insert Skin Care main category
INSERT INTO categories (name, slug, description, level, sort_order) VALUES
('Skin Care', 'skin-care', 'Complete skin care solutions for all skin types', 1, 1);

-- Get the main category ID for reference
-- Insert Face Cream subcategory
INSERT INTO categories (name, slug, description, parent_id, level, sort_order) VALUES
('Face Cream', 'face-cream', 'Moisturizing and nourishing face creams', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), 2, 1);

-- Insert Face Serum subcategory
INSERT INTO categories (name, slug, description, parent_id, level, sort_order) VALUES
('Face Serum', 'face-serum', 'Concentrated serums for targeted skin concerns', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), 2, 2);

-- Insert Face Mask subcategory
INSERT INTO categories (name, slug, description, parent_id, level, sort_order) VALUES
('Face Mask', 'face-mask', 'Treatment masks for various skin needs', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), 2, 3);

-- Insert Facial Cleansing subcategory
INSERT INTO categories (name, slug, description, parent_id, level, sort_order) VALUES
('Facial Cleansing', 'facial-cleansing', 'Gentle and effective facial cleansing products', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), 2, 4);

-- Insert Lip Care subcategory
INSERT INTO categories (name, slug, description, parent_id, level, sort_order) VALUES
('Lip Care', 'lip-care', 'Nourishing and protective lip care products', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), 2, 5);

-- Insert Eye Contour Care subcategory
INSERT INTO categories (name, slug, description, parent_id, level, sort_order) VALUES
('Eye Contour Care', 'eye-contour-care', 'Specialized care for the delicate eye area', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), 2, 6);

-- Insert Dermocosmetic Skin Care subcategory
INSERT INTO categories (name, slug, description, parent_id, level, sort_order) VALUES
('Dermocosmetic Skin Care', 'dermocosmetic-skin-care', 'Medical-grade skin care products', 
 (SELECT id FROM categories WHERE slug = 'skin-care'), 2, 7);

-- Now insert the sub-subcategories for Face Cream
INSERT INTO categories (name, slug, description, parent_id, level, sort_order) VALUES
('Moisturizer', 'face-cream-moisturizer', 'Hydrating face creams for all skin types', 
 (SELECT id FROM categories WHERE slug = 'face-cream'), 3, 1),
('Anti-Stain', 'face-cream-anti-stain', 'Face creams to reduce dark spots and stains', 
 (SELECT id FROM categories WHERE slug = 'face-cream'), 3, 2),
('Sensitive Skin', 'face-cream-sensitive-skin', 'Gentle face creams for sensitive skin', 
 (SELECT id FROM categories WHERE slug = 'face-cream'), 3, 3),
('Anti-Aging', 'face-cream-anti-aging', 'Anti-aging face creams with advanced ingredients', 
 (SELECT id FROM categories WHERE slug = 'face-cream'), 3, 4),
('Oily Skin', 'face-cream-oily-skin', 'Lightweight face creams for oily skin', 
 (SELECT id FROM categories WHERE slug = 'face-cream'), 3, 5);

-- Insert sub-subcategories for Face Serum
INSERT INTO categories (name, slug, description, parent_id, level, sort_order) VALUES
('Anti-Wrinkle', 'face-serum-anti-wrinkle', 'Concentrated serums to reduce wrinkles', 
 (SELECT id FROM categories WHERE slug = 'face-serum'), 3, 1),
('Enlightening', 'face-serum-enlightening', 'Brightening serums for radiant skin', 
 (SELECT id FROM categories WHERE slug = 'face-serum'), 3, 2),
('Loss of Firmness', 'face-serum-loss-of-firmness', 'Firming serums for skin elasticity', 
 (SELECT id FROM categories WHERE slug = 'face-serum'), 3, 3),
('Anti-Stain', 'face-serum-anti-stain', 'Serums to reduce dark spots and hyperpigmentation', 
 (SELECT id FROM categories WHERE slug = 'face-serum'), 3, 4),
('Oily Skin', 'face-serum-oily-skin', 'Lightweight serums for oily skin', 
 (SELECT id FROM categories WHERE slug = 'face-serum'), 3, 5);

-- Insert sub-subcategories for Face Mask
INSERT INTO categories (name, slug, description, parent_id, level, sort_order) VALUES
('Enlightening', 'face-mask-enlightening', 'Brightening face masks for radiant skin', 
 (SELECT id FROM categories WHERE slug = 'face-mask'), 3, 1),
('Oily Skin', 'face-mask-oily-skin', 'Purifying face masks for oily skin', 
 (SELECT id FROM categories WHERE slug = 'face-mask'), 3, 2),
('Loss of Firmness', 'face-mask-loss-of-firmness', 'Firming face masks for skin elasticity', 
 (SELECT id FROM categories WHERE slug = 'face-mask'), 3, 3),
('Cleaning', 'face-mask-cleaning', 'Deep cleansing face masks', 
 (SELECT id FROM categories WHERE slug = 'face-mask'), 3, 4),
('Moisturizer', 'face-mask-moisturizer', 'Hydrating face masks for dry skin', 
 (SELECT id FROM categories WHERE slug = 'face-mask'), 3, 5);

-- Insert sub-subcategories for Facial Cleansing
INSERT INTO categories (name, slug, description, parent_id, level, sort_order) VALUES
('Moisturizer', 'facial-cleansing-moisturizer', 'Moisturizing facial cleansers', 
 (SELECT id FROM categories WHERE slug = 'facial-cleansing'), 3, 1),
('Makeup Remover', 'facial-cleansing-makeup-remover', 'Effective makeup removal products', 
 (SELECT id FROM categories WHERE slug = 'facial-cleansing'), 3, 2),
('Purifying', 'facial-cleansing-purifying', 'Deep purifying facial cleansers', 
 (SELECT id FROM categories WHERE slug = 'facial-cleansing'), 3, 3),
('Sensitive Skin', 'facial-cleansing-sensitive-skin', 'Gentle cleansers for sensitive skin', 
 (SELECT id FROM categories WHERE slug = 'facial-cleansing'), 3, 4),
('Oily Skin', 'facial-cleansing-oily-skin', 'Oil-control facial cleansers', 
 (SELECT id FROM categories WHERE slug = 'facial-cleansing'), 3, 5);

-- Insert sub-subcategories for Lip Care
INSERT INTO categories (name, slug, description, parent_id, level, sort_order) VALUES
('Dermocosmetics', 'lip-care-dermocosmetics', 'Medical-grade lip care products', 
 (SELECT id FROM categories WHERE slug = 'lip-care'), 3, 1),
('Cream', 'lip-care-cream', 'Nourishing lip creams and balms', 
 (SELECT id FROM categories WHERE slug = 'lip-care'), 3, 2),
('Lipstick', 'lip-care-lipstick', 'Moisturizing and protective lipsticks', 
 (SELECT id FROM categories WHERE slug = 'lip-care'), 3, 3);

-- Insert sub-subcategories for Eye Contour Care
INSERT INTO categories (name, slug, description, parent_id, level, sort_order) VALUES
('Enlightening', 'eye-contour-enlightening', 'Brightening eye contour treatments', 
 (SELECT id FROM categories WHERE slug = 'eye-contour-care'), 3, 1),
('Loss of Firmness', 'eye-contour-loss-of-firmness', 'Firming eye contour treatments', 
 (SELECT id FROM categories WHERE slug = 'eye-contour-care'), 3, 2),
('Sensitive Skin', 'eye-contour-sensitive-skin', 'Gentle eye contour care for sensitive skin', 
 (SELECT id FROM categories WHERE slug = 'eye-contour-care'), 3, 3);

-- Create function to update updated_at timestamp for categories
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at for categories
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_categories_updated_at();

-- Verify the data was inserted correctly
SELECT 
    c1.name as main_category,
    c2.name as subcategory,
    c3.name as sub_subcategory,
    c1.slug as main_slug,
    c2.slug as sub_slug,
    c3.slug as sub_sub_slug
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN categories c3 ON c3.parent_id = c2.id
WHERE c1.name = 'Skin Care'
ORDER BY c1.sort_order, c2.sort_order, c3.sort_order;

-- Show the complete category tree
WITH RECURSIVE category_tree AS (
    SELECT 
        id,
        name,
        slug,
        parent_id,
        level,
        sort_order,
        ARRAY[name] as path,
        0 as depth
    FROM categories 
    WHERE parent_id IS NULL
    
    UNION ALL
    
    SELECT 
        c.id,
        c.name,
        c.slug,
        c.parent_id,
        c.level,
        c.sort_order,
        ct.path || c.name,
        ct.depth + 1
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT 
    REPEAT('  ', depth) || name as category_hierarchy,
    slug,
    level
FROM category_tree
WHERE name = 'Skin Care' OR path @> ARRAY['Skin Care']
ORDER BY path;
