# Troubleshooting: Baby Sunscreens Child Categories Not Showing

## 🔍 Step 1: Verify Database Has the Brands

Run this SQL in Supabase:

```sql
-- Check if brands exist in database
SELECT 
  c1.name as main_category,
  c2.name as subcategory,
  c3.name as brand,
  c3.slug
FROM categories c1
JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN categories c3 ON c3.parent_id = c2.id
WHERE c1.slug = 'mother-baby' 
  AND c2.slug = 'baby-sunscreens'
ORDER BY c3.sort_order, c3.name;
```

### Expected Result:
If you see 5 rows (Mustela, Baby, Avene, Vichy, Badger) → ✅ Database is correct

If you see 0 rows → ❌ SQL script wasn't run yet

---

## 🔧 Step 2: Run the SQL Script (If Needed)

If you didn't see the brands in Step 1:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Open: `database/scripts/add-baby-sunscreens-brands.sql`
3. Copy ALL the code
4. Paste into SQL Editor
5. Click **Run**
6. Should see: "Baby Sunscreen brand categories added successfully!"
7. Run the verification query again from Step 1

---

## 🔄 Step 3: Restart Dev Server

The code changes won't take effect until you restart:

### Windows PowerShell:
```powershell
# Press Ctrl+C to stop current server
# Then run:
npm run dev
```

### Check that the changes are loaded:
Look in terminal output for:
```
○  Compiled /app successfully in XXX ms
```

---

## 🧹 Step 4: Clear Browser Cache

### Option A: Hard Refresh (Easiest)
- **Windows:** Press `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac:** Press `Cmd + Shift + R`

### Option B: Clear via DevTools
1. Press F12 to open DevTools
2. Go to **Application** tab (or **Storage** in Firefox)
3. Click **Clear storage** or **Clear site data**
4. Check all boxes
5. Click **Clear site data**
6. Refresh page (F5)

### Option C: Incognito Window
- Open an incognito/private window
- Go to your site
- This shows if the issue is cache or code

---

## 🐛 Step 5: Check Browser Console for Errors

1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Look for any **red errors**
4. Share any error messages if you see them

---

## 🎯 Quick Test

After restarting and clearing cache:

1. Go to your website
2. Click **"Categories"** in the nav
3. Hover over **"Mother and Baby"**
4. Click on **"Baby Sunscreens"**
5. You should see:
   - Mustela
   - Baby
   - Avene
   - Vichy
   - Badger

---

## 🔍 Still Not Working?

### Check if Code File Was Saved

The change is in `components/layout/MegaMenu.tsx` around **line 283-289**.

Verify the file has:
```typescript
{
  id: 24,
  name: 'Baby Sunscreens',
  slug: 'baby-sunscreens',
  children: [
    { id: 99, name: 'Mustela', slug: 'baby-sunscreens-mustela' },
    { id: 100, name: 'Baby', slug: 'baby-sunscreens-baby' },
    { id: 101, name: 'Avene', slug: 'baby-sunscreens-avene' },
    { id: 102, name: 'Vichy', slug: 'baby-sunscreens-vichy' },
    { id: 103, name: 'Badger', slug: 'baby-sunscreens-badger' }
  ]
},
```

### Force Save
If you see the code is correct but it's still not working:
1. Make a small change to the file (add a space)
2. Save the file
3. Restart dev server
4. Hard refresh browser

---

## 📊 Check Current State

Run this diagnostic:

```sql
-- See ALL Baby Sunscreen related categories
SELECT 
  id,
  name,
  slug,
  parent_id,
  (SELECT name FROM categories WHERE id = categories.parent_id) as parent_name
FROM categories 
WHERE slug LIKE 'baby-sunscreen%'
ORDER BY parent_id, name;
```

**Expected:** You should see 6 rows:
- 1 parent: Baby Sunscreens
- 5 children: Mustela, Baby, Avene, Vichy, Badger

---

## 💡 Most Common Issues

1. **"Code is right but not showing"** → Dev server not restarted
2. **"Shows old data"** → Browser cache not cleared  
3. **"No brands showing"** → SQL script not run in database
4. **"Different brands showing"** → Code not saved properly

---

## ✅ Success Indicator

When it's working, you should see the brands in:
- Mega menu dropdown when hovering over Baby Sunscreens
- Category page when navigating to /categories/mother-baby/baby-sunscreens
- Admin panel category list

