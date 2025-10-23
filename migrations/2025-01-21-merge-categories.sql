-- Migration: Merge categories and subcategories into single recursive table
-- Date: 2025-01-21

-- Step 1: Add parent_id column to categories table
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE;

-- Step 2: Add index for better performance on parent_id lookups
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Step 3: Migrate subcategories into categories table
-- First, let's see what we're working with
-- This will insert all subcategories as children of their current parent categories
INSERT INTO categories (name, slug, description, image, parent_id, sort_order, is_active, meta_title, meta_description, created_at, updated_at)
SELECT 
    s.name, 
    s.slug, 
    s.description, 
    s.image, 
    s.category_id as parent_id,  -- This makes subcategories children of main categories
    s.sort_order, 
    s.is_active, 
    s.meta_title, 
    s.meta_description, 
    s.created_at, 
    s.updated_at
FROM subcategories s
WHERE NOT EXISTS (
    -- Avoid duplicates if subcategory already exists in categories
    SELECT 1 FROM categories c 
    WHERE c.slug = s.slug AND c.name = s.name
);

-- Step 4: Update products table to use the new category structure
-- Add temporary column for new category mapping
ALTER TABLE products ADD COLUMN IF NOT EXISTS new_category_id INTEGER;

-- Map products that currently use subcategory_id to the new merged category
UPDATE products 
SET new_category_id = (
    SELECT c.id 
    FROM categories c 
    WHERE c.slug = (
        SELECT s.slug 
        FROM subcategories s 
        WHERE s.id = products.subcategory_id
    )
)
WHERE subcategory_id IS NOT NULL;

-- For products that only have category_id, keep the same
UPDATE products 
SET new_category_id = category_id
WHERE subcategory_id IS NULL AND category_id IS NOT NULL;

-- Step 5: Replace old category columns with new structure
-- First, drop the foreign key constraints
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_subcategory_id_fkey;

-- Drop old columns
ALTER TABLE products DROP COLUMN IF EXISTS subcategory_id;
ALTER TABLE products DROP COLUMN IF EXISTS category_id;

-- Rename new column to category_id
ALTER TABLE products RENAME COLUMN new_category_id TO category_id;

-- Add foreign key constraint back
ALTER TABLE products 
ADD CONSTRAINT products_category_id_fkey 
FOREIGN KEY (category_id) REFERENCES categories(id);

-- Step 6: Clean up - Drop the old subcategories table
-- (Only do this after verifying everything works)
-- DROP TABLE IF EXISTS subcategories;

-- Step 7: Add some useful indexes
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

-- Step 8: Update any existing data that might need fixing
-- Ensure main categories have parent_id = NULL
UPDATE categories SET parent_id = NULL WHERE parent_id = id;

-- Step 9: Add a function to get category hierarchy
CREATE OR REPLACE FUNCTION get_category_hierarchy()
RETURNS TABLE (
    id INTEGER,
    name VARCHAR,
    slug VARCHAR,
    parent_id INTEGER,
    level INTEGER,
    path TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE category_tree AS (
        -- Base case: root categories (parent_id IS NULL)
        SELECT 
            c.id,
            c.name,
            c.slug,
            c.parent_id,
            0 as level,
            c.name as path
        FROM categories c
        WHERE c.parent_id IS NULL
        
        UNION ALL
        
        -- Recursive case: child categories
        SELECT 
            c.id,
            c.name,
            c.slug,
            c.parent_id,
            ct.level + 1,
            ct.path || ' > ' || c.name
        FROM categories c
        INNER JOIN category_tree ct ON c.parent_id = ct.id
    )
    SELECT * FROM category_tree ORDER BY level, name;
END;
$$ LANGUAGE plpgsql;

-- Step 10: Add a function to get all children of a category
CREATE OR REPLACE FUNCTION get_category_children(parent_category_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR,
    slug VARCHAR,
    parent_id INTEGER,
    level INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE category_children AS (
        -- Base case: direct children
        SELECT 
            c.id,
            c.name,
            c.slug,
            c.parent_id,
            1 as level
        FROM categories c
        WHERE c.parent_id = parent_category_id
        
        UNION ALL
        
        -- Recursive case: children of children
        SELECT 
            c.id,
            c.name,
            c.slug,
            c.parent_id,
            cc.level + 1
        FROM categories c
        INNER JOIN category_children cc ON c.parent_id = cc.id
    )
    SELECT * FROM category_children ORDER BY level, name;
END;
$$ LANGUAGE plpgsql;
