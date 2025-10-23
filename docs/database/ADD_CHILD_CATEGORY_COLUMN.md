# Add Child Category Column Migration

## Overview
This migration adds a `child_category_id` column to the `products` table to support 3-level category hierarchy.

## SQL to Execute in Supabase SQL Editor

```sql
-- Add child_category_id column to products table
ALTER TABLE products 
ADD COLUMN child_category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_products_child_category_id ON products(child_category_id);

-- Add comment to document the column
COMMENT ON COLUMN products.child_category_id IS 'Reference to child category (3rd level) in the category hierarchy';
```

## Verification

After running the SQL, verify the column was added by running this query:

```sql
-- Check if the column exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name = 'child_category_id';
```

## Expected Result

The query should return:
- column_name: child_category_id
- data_type: integer
- is_nullable: YES

## Next Steps

1. Run the SQL in Supabase SQL Editor
2. Verify the column was added successfully
3. Test the admin product edit form with 3-level categories
