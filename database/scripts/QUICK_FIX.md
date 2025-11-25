# Quick Fix: Restore Your Missing Categories

## The Problem
Your Hair Care, Skin Care, and Personal Care categories appear to be missing from the database.

## The Solution
Run this SQL script in your Supabase SQL Editor:

**File:** `database/scripts/RESTORE_MISSING_CATEGORIES.sql`

## What It Does
1. ✅ Checks which categories exist
2. ✅ Inserts Hair Care if missing
3. ✅ Inserts Skin Care if missing  
4. ✅ Inserts Personal Care if missing
5. ✅ Shows you the final status

## How to Run

### Option 1: Via Supabase Dashboard
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Open file: `database/scripts/RESTORE_MISSING_CATEGORIES.sql`
3. Copy all the SQL code
4. Paste into SQL Editor
5. Click **Run**

### Option 2: Then Add Subcategories

After running the restore script, run these to add all the subcategories:

1. **Hair Care subcategories:**
   ```
   database/scripts/insert-hair-care-categories.sql
   ```

2. **Skin Care subcategories:**
   ```
   database/scripts/insert-skin-care-categories.sql
   ```

3. **Personal Care subcategories:**
   ```
   database/scripts/insert-personal-care-categories.sql
   ```

## Quick Diagnostic Query

To see what's currently in your database, run:

```sql
SELECT 
  id, 
  name, 
  slug, 
  parent_id, 
  is_active,
  (SELECT COUNT(*) FROM categories c2 WHERE c2.parent_id = categories.id) as subcategory_count
FROM categories 
WHERE parent_id IS NULL 
ORDER BY id;
```

This will show you:
- How many main categories exist
- Which ones are active
- How many subcategories each has

## Expected Result

After running all scripts, you should see:

| Category | ID | Status | Subcategories |
|----------|----|--------|--------------|
| Hair Care | ? | ✅ Active | 3 |
| Skin Care | ? | ✅ Active | 7 |
| Personal Care | ? | ✅ Active | 11 |
| Mother and Baby | ? | ✅ Active | 8 |

## If Still Missing

If categories still don't show up after running the restore script:

1. Check for constraint violations (run the diagnostic query above)
2. Look for error messages in Supabase
3. Check if there's a `parent_id` issue

The Mother and Baby insert didn't delete anything - those categories simply weren't in the database to begin with.

