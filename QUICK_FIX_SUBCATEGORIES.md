# Quick Fix: Add All Subcategories

## The Problem
You only have the MAIN categories (Hair Care, Skin Care, Personal Care, Mother and Baby) but NO subcategories.

This is why you see "No subcategories available" in the mega menu.

## The Solution

You need to run **3 SQL scripts** in your Supabase SQL Editor:

### Option 1: Run Each Script Separately (RECOMMENDED)

Go to **Supabase Dashboard** → **SQL Editor** and run these in order:

#### 1. Hair Care Subcategories
- Open: `database/scripts/insert-hair-care-categories.sql`
- Copy ALL the code
- Paste into SQL Editor
- Click **Run**
- You should see: "Hair Care categories inserted successfully!"

#### 2. Skin Care Subcategories  
- Open: `database/scripts/insert-skin-care-categories.sql`
- Copy ALL the code
- Paste into SQL Editor
- Click **Run**
- You should see: "Skin Care categories inserted successfully!"

#### 3. Personal Care Subcategories
- Open: `database/scripts/insert-personal-care-categories.sql`
- Copy ALL the code
- Paste into SQL Editor  
- Click **Run**
- You should see: "Personal Care categories inserted successfully!"

### Option 2: Verify It Worked

After running all 3 scripts, run this query to check:

```sql
SELECT 
  c1.name as main_category,
  c1.id as main_category_id,
  COUNT(c2.id) as subcategory_count
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
WHERE c1.parent_id IS NULL
GROUP BY c1.id, c1.name
ORDER BY c1.id;
```

**Expected Results:**
```
main_category        | main_category_id | subcategory_count
---------------------+------------------+------------------
Hair Care           | 1                | 3
Skin Care           | 2                | 7
Personal Care       | 3                | 11
Mother and Baby     | 4                | 8
```

### Step 3: Refresh Your Website

1. Refresh your browser
2. Click "Categories" in the navigation
3. You should now see all subcategories!

---

## Why This Happened

The `insert-mother-baby-categories.sql` script ONLY added:
- ✅ Mother and Baby main category
- ✅ All Mother and Baby subcategories

It did NOT delete or affect:
- ✅ Hair Care main category
- ✅ Skin Care main category  
- ✅ Personal Care main category

The subcategories were NEVER inserted for the first 3 categories. That's why they're missing!

## What Each Script Does

### insert-hair-care-categories.sql
- Adds 3 subcategories to Hair Care:
  - Shampoo (with 3 child categories)
  - Conditioner (with 3 child categories)
  - Hair Mask (with 3 child categories)

### insert-skin-care-categories.sql
- Adds 7 subcategories to Skin Care:
  - Facial Cleansing (with 5 child categories)
  - Face Cream (with 5 child categories)
  - Face Serum (with 5 child categories)
  - Face Mask (with 5 child categories)
  - Eye Contour Care (with 3 child categories)
  - Lip Care (with 3 child categories)
  - Dermocosmetic Skin Care (with 0 child categories)

### insert-personal-care-categories.sql
- Adds 11 subcategories to Personal Care:
  - Perfume and Deodorant (with 4 child categories)
  - Solar Products (with 3 child categories)
  - Body and Bath Products (with 3 child categories)
  - Hand, Foot and Nail Care (with 4 child categories)
  - Hair Removal Products (with 3 child categories)
  - Oral Health (with 4 child categories)
  - Eyebrow and Eyelash Care (with 2 child categories)
  - Shaving Products (with 5 child categories)
  - Sexual Health (with 2 child categories)
  - Care Supplies (with 5 child categories)
  - Dermocosmetic Personal Care (with 0 child categories)

---

## ⚠️ Important Notes

1. The scripts use `ON CONFLICT (slug) DO UPDATE` so they're safe to run multiple times
2. Mother and Baby already has its subcategories (you see "8 subcategories" in your screenshot)
3. The other 3 categories need their subcategories added
4. After running all 3 scripts, your mega menu will show all categories and subcategories

---

## Still Having Issues?

If after running all 3 scripts you still see "No subcategories available":

1. Check the console in your browser (F12)
2. Look for error messages in Supabase SQL Editor
3. Verify the parent_id relationships in your database
4. Run the verification query above to check counts

---

## Next Steps After Fixing

Once subcategories are showing:
1. ✅ Test the mega menu dropdowns
2. ✅ Add products to different subcategories
3. ✅ Test navigation to subcategory pages
4. ✅ Continue with SEO improvements (from earlier)

