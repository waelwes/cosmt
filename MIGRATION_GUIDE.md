# 🧩 Category Merge Migration Guide

## 🎯 Goal
Merge `categories` and `subcategories` tables into a single recursive `categories` table.

## 📋 Current State
- **categories**: 2 main categories (Hair Care, Skin Care)
- **subcategories**: 102 subcategories linked to main categories
- **products**: 4 products with both category_id and subcategory_id

## 🚀 Migration Steps

### Step 1: Add parent_id Column (Run in Supabase SQL Editor)
```sql
-- Add parent_id column to categories table
ALTER TABLE categories
ADD COLUMN parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE;

-- Add index for better performance
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
```

### Step 2: Migrate Subcategories (Run this script)
```bash
node scripts/migrate-categories.js
```

### Step 3: Update Products Table (Run in Supabase SQL Editor)
```sql
-- Add temporary column for new category mapping
ALTER TABLE products ADD COLUMN new_category_id INTEGER;

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

-- Drop old foreign key constraints
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
```

### Step 4: Verify Migration (Run in Supabase SQL Editor)
```sql
-- Check category hierarchy
SELECT c1.id, c1.name AS category, c2.name AS parent
FROM categories c1
LEFT JOIN categories c2 ON c1.parent_id = c2.id
ORDER BY c2.id, c1.name;

-- Check product-category links
SELECT p.id, p.name AS product, c.name AS category
FROM products p
JOIN categories c ON p.category_id = c.id;
```

### Step 5: Clean Up (Only after verification)
```sql
-- Drop the old subcategories table
DROP TABLE IF EXISTS subcategories;
```

## 🎯 Expected Result
- Single `categories` table with recursive structure
- `parent_id` field defines hierarchy
- All products linked to appropriate categories
- Clean, maintainable category system

## ⚠️ Important Notes
1. **Backup your database** before running this migration
2. Test each step thoroughly
3. Only drop the subcategories table after verifying everything works
4. Update your frontend code to use the new recursive structure
