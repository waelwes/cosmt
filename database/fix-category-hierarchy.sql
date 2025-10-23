-- Fix Category Hierarchy Issues
-- This script addresses the dual category_id and child_category_id issue

-- 1. First, let's check the current data structure
-- This will help us understand how your data is organized

-- Check products with both category_id and child_category_id
SELECT 
  p.id,
  p.name,
  p.category_id,
  p.child_category_id,
  c1.name as category_name,
  c2.name as child_category_name
FROM products p
LEFT JOIN categories c1 ON p.category_id = c1.id
LEFT JOIN categories c2 ON p.child_category_id = c2.id
WHERE p.category_id IS NOT NULL OR p.child_category_id IS NOT NULL
LIMIT 10;

-- 2. Check category hierarchy structure
SELECT 
  c.id,
  c.name,
  c.parent_id,
  pc.name as parent_name,
  COUNT(p.id) as product_count
FROM categories c
LEFT JOIN categories pc ON c.parent_id = pc.id
LEFT JOIN products p ON (p.category_id = c.id OR p.child_category_id = c.id)
WHERE c.is_active = true
GROUP BY c.id, c.name, c.parent_id, pc.name
ORDER BY c.parent_id, c.sort_order, c.name;

-- 3. If you want to standardize to use only category_id (recommended):
-- This would move child_category_id values to category_id for products that don't have a category_id

-- UPDATE products 
-- SET category_id = child_category_id 
-- WHERE category_id IS NULL AND child_category_id IS NOT NULL;

-- 4. Add a check constraint to ensure data integrity
-- ALTER TABLE products 
-- ADD CONSTRAINT check_category_or_child 
-- CHECK (category_id IS NOT NULL OR child_category_id IS NOT NULL);

-- 5. Create a view for easier category queries
CREATE OR REPLACE VIEW product_categories AS
SELECT 
  p.id as product_id,
  p.name as product_name,
  p.category_id,
  p.child_category_id,
  c1.name as category_name,
  c1.slug as category_slug,
  c2.name as child_category_name,
  c2.slug as child_category_slug,
  c1.parent_id as category_parent_id,
  CASE 
    WHEN p.child_category_id IS NOT NULL THEN p.child_category_id
    WHEN p.category_id IS NOT NULL THEN p.category_id
    ELSE NULL
  END as effective_category_id
FROM products p
LEFT JOIN categories c1 ON p.category_id = c1.id
LEFT JOIN categories c2 ON p.child_category_id = c2.id;

-- 6. Create an index on the effective category for better performance
-- This will help with your category filtering queries
CREATE INDEX IF NOT EXISTS idx_products_effective_category 
ON products (COALESCE(child_category_id, category_id));

-- 7. Add a function to get products by category (including subcategories)
CREATE OR REPLACE FUNCTION get_products_by_category(category_slug_param TEXT)
RETURNS TABLE (
  product_id INTEGER,
  product_name VARCHAR,
  category_name VARCHAR,
  child_category_name VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    c1.name,
    c2.name
  FROM products p
  LEFT JOIN categories c1 ON p.category_id = c1.id
  LEFT JOIN categories c2 ON p.child_category_id = c2.id
  WHERE p.status = 'active'
    AND (
      c1.slug = category_slug_param 
      OR c2.slug = category_slug_param
      OR c1.parent_id IN (
        SELECT id FROM categories WHERE slug = category_slug_param
      )
    );
END;
$$ LANGUAGE plpgsql;
