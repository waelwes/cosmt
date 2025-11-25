# Diagnostic Guide: Why "No Subcategories Available"

## Quick Diagnostic

Run this query in your Supabase SQL Editor:

```sql
SELECT 
  c1.name as main_category,
  c1.id as category_id,
  COUNT(c2.id) as subcategory_count
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
WHERE c1.parent_id IS NULL
GROUP BY c1.id, c1.name
ORDER BY c1.id;
```

### Expected Results After Running Subcategory Scripts:

| main_category | category_id | subcategory_count |
|---------------|-------------|-------------------|
| Hair Care | ? | **3** (Shampoo, Conditioner, Hair Mask) |
| Skin Care | ? | **7** (Facial Cleansing, Face Cream, etc.) |
| Personal Care | ? | **11** (Perfume, Solar Products, etc.) |
| Mother and Baby | ? | **8** |

## If You See 0 subcategory_count:

The subcategory SQL scripts were **never run**. Run these scripts in order:

### Step 1: Hair Care
```bash
# Open in Supabase SQL Editor and run:
database/scripts/insert-hair-care-categories.sql
```

### Step 2: Skin Care
```bash
# Open in Supabase SQL Editor and run:
database/scripts/insert-skin-care-categories.sql
```

### Step 3: Personal Care
```bash
# Open in Supabase SQL Editor and run:
database/scripts/insert-personal-care-categories.sql
```

## Full Diagnostic Query

Run the comprehensive diagnostic script I created:
- File: `database/scripts/CHECK_CATEGORY_STRUCTURE.sql`
- This shows you detailed info about all category levels

## Common Issues

### Issue 1: Wrong parent_id
```sql
-- Check if subcategories have wrong parent_id
SELECT * FROM categories 
WHERE parent_id NOT IN (SELECT id FROM categories WHERE parent_id IS NULL)
  AND parent_id IS NOT NULL;
```

### Issue 2: Categories not marked as active
```sql
-- Check for inactive categories
SELECT name, slug, is_active 
FROM categories 
WHERE is_active = false;
```

### Issue 3: Duplicate slugs
```sql
-- Check for duplicate slugs (should be none)
SELECT slug, COUNT(*) 
FROM categories 
GROUP BY slug 
HAVING COUNT(*) > 1;
```

## Solution Based on Your Results

### If subcategory_count = 0 for Hair Care, Skin Care, Personal Care:
→ Run the insert scripts

### If subcategory_count > 0 but still showing "No subcategories available":
→ Clear your browser cache
→ Restart your dev server
→ Check browser console for errors

### If you see "orphaned categories":
→ The parent_id references are broken
→ Run the insert scripts again (they handle conflicts safely)

## After Running Scripts

Verify with:
```sql
SELECT 
  c1.name,
  COUNT(c2.id) as subs,
  COUNT(c3.id) as children
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN categories c3 ON c3.parent_id = c2.id
WHERE c1.parent_id IS NULL
GROUP BY c1.id, c1.name
ORDER BY c1.id;
```

This shows the complete hierarchy structure.


