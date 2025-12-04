# Apply Bilingual Translations - Step by Step Guide

## Quick Overview
You have 49 products fully translated from Arabic to English. Now we need to:
1. Add the `name_en` column to the products table
2. Populate it with English translations
3. Update your product queries to use both languages

**Estimated time**: 5 minutes

---

## Step 1: Create the English Names Column

### Via Supabase Dashboard (Recommended)

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Paste this SQL:

```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_en TEXT DEFAULT NULL;

-- Add a comment to explain the column
COMMENT ON COLUMN products.name_en IS 'English translation of product name (for bilingual support)';
```

6. Click **Run** (or press Ctrl+Enter)

You should see: `✓ Success. No rows affected.`

### Via Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

---

## Step 2: Populate Translations

Once the `name_en` column exists, run these SQL UPDATE statements in the SQL Editor:

### Copy All Translations at Once

Create a new query and paste the entire block below:

```sql
BEGIN;

-- Product ID 196-244 with English translations
UPDATE products SET name_en = 'Bond Fusion Treatment' WHERE id = 196;
UPDATE products SET name_en = 'Dry Hair Cream 25ml' WHERE id = 197;
UPDATE products SET name_en = 'Pure Moroccan Argan Oil 45ml' WHERE id = 198;
UPDATE products SET name_en = 'Keratin Straightening' WHERE id = 199;
UPDATE products SET name_en = 'Semi Color Dye 60ml' WHERE id = 200;
UPDATE products SET name_en = 'Herbal Hair Dye' WHERE id = 201;
UPDATE products SET name_en = 'Blue Mesh 500g' WHERE id = 202;
UPDATE products SET name_en = 'Blue Highlights 500g' WHERE id = 203;
UPDATE products SET name_en = 'White Mesh 500g' WHERE id = 204;
UPDATE products SET name_en = 'Hair Dye Peroxide 60ml' WHERE id = 205;
UPDATE products SET name_en = 'Hair Dye Peroxide 1000ml' WHERE id = 206;
UPDATE products SET name_en = 'Tinta Hair Dye' WHERE id = 207;
UPDATE products SET name_en = 'Conditioner for Colored Hair 200ml' WHERE id = 208;
UPDATE products SET name_en = 'Shampoo for Colored Hair 250ml' WHERE id = 209;
UPDATE products SET name_en = 'Daily Conditioner 250ml' WHERE id = 210;
UPDATE products SET name_en = 'Daily Shampoo 250ml' WHERE id = 211;
UPDATE products SET name_en = 'Satin Oil 95ml' WHERE id = 212;
UPDATE products SET name_en = 'Satin Oil Conditioner 250ml' WHERE id = 213;
UPDATE products SET name_en = 'Satin Oil Shampoo 300ml' WHERE id = 214;
UPDATE products SET name_en = 'Shampoo for Dry and Split Ends 300ml' WHERE id = 215;
UPDATE products SET name_en = 'Anti-Hair Loss Lotion 75ml' WHERE id = 216;
UPDATE products SET name_en = 'Anti-Hair Loss Shampoo 300ml' WHERE id = 217;
UPDATE products SET name_en = 'Anti-Dandruff Shampoo 300ml' WHERE id = 218;
UPDATE products SET name_en = 'Hair Shine Wax 100ml' WHERE id = 219;
UPDATE products SET name_en = 'Hair Styling Wax 100ml' WHERE id = 220;
UPDATE products SET name_en = 'Hair Lustre Wax 100ml' WHERE id = 221;
UPDATE products SET name_en = 'Curl Hair Gel 150ml' WHERE id = 222;
UPDATE products SET name_en = 'Smooth Hair Gel 200ml' WHERE id = 223;
UPDATE products SET name_en = 'Wet Hair Gel 200ml' WHERE id = 224;
UPDATE products SET name_en = 'Strong Hair Spray 300ml' WHERE id = 225;
UPDATE products SET name_en = 'Light Hair Spray 300ml' WHERE id = 226;
UPDATE products SET name_en = 'Silver Conditioner 200ml' WHERE id = 227;
UPDATE products SET name_en = 'Silver Shampoo 250ml' WHERE id = 228;
UPDATE products SET name_en = 'Strong Styling Foam 200ml' WHERE id = 229;
UPDATE products SET name_en = 'Temporary Straightening Cream 200ml' WHERE id = 230;
UPDATE products SET name_en = 'Repair Conditioner 200ml' WHERE id = 231;
UPDATE products SET name_en = 'Repair Shampoo 250ml' WHERE id = 232;
UPDATE products SET name_en = 'Protein Spray 200ml' WHERE id = 233;
UPDATE products SET name_en = 'Repair Oil Bath 200ml' WHERE id = 234;
UPDATE products SET name_en = 'Keratin Oil Bath 200ml' WHERE id = 235;
UPDATE products SET name_en = 'Keratin Serum 25ml' WHERE id = 236;
UPDATE products SET name_en = 'Keratin Mask 200ml' WHERE id = 237;
UPDATE products SET name_en = 'Keratin Conditioner 250ml' WHERE id = 238;
UPDATE products SET name_en = 'Keratin Shampoo 300ml' WHERE id = 239;
UPDATE products SET name_en = 'Shine Spray 200ml' WHERE id = 240;
UPDATE products SET name_en = 'Hair Serum 50ml' WHERE id = 241;
UPDATE products SET name_en = 'Serum Capsules 30 pcs' WHERE id = 242;
UPDATE products SET name_en = 'Straightening Oil 200ml' WHERE id = 243;
UPDATE products SET name_en = 'Keratin Straightening 85ml' WHERE id = 244;

COMMIT;
```

Click **Run** and wait for it to complete. You should see:
```
✓ Success. 49 rows affected
```

---

## Step 3: Verify Translations

Run this query to verify all translations were applied:

```sql
SELECT id, name, name_en FROM products 
WHERE status = 'active' AND name_en IS NOT NULL
ORDER BY id;
```

You should see 49 rows with both Arabic names and English translations.

---

## Step 4: Update Your Product Queries

Now update your product fetching code to use the bilingual names.

### Option A: Update Product Service

**File**: `utils/products.ts` (or wherever you fetch products)

**Before**:
```typescript
export async function getProducts() {
  return supabase
    .from('products')
    .select('id, name, image, price, description, brand, category_id, stock, status')
    .eq('status', 'active')
    .order('name');
}
```

**After**:
```typescript
export async function getProducts(locale: 'ar' | 'en' = 'ar') {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, name_en, image, price, description, brand, category_id, stock, status')
    .eq('status', 'active')
    .order(locale === 'ar' ? 'name' : 'name_en');
  
  if (error) throw error;
  
  // Return products with display name based on locale
  return data.map(product => ({
    ...product,
    displayName: locale === 'ar' ? product.name : (product.name_en || product.name)
  }));
}
```

### Option B: Use in Components

**File**: `components/ProductCard.tsx` (or your product component)

**Before**:
```tsx
export function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <img src={product.image} alt={product.name} />
      <p>${product.price}</p>
    </div>
  );
}
```

**After**:
```tsx
import { useLanguage } from '@/contexts/UnifiedLanguageContext';

export function ProductCard({ product }: { product: BilingualProduct }) {
  const { currentLanguage } = useLanguage();
  const displayName = currentLanguage === 'ar' 
    ? product.name 
    : (product.name_en || product.name);
  
  return (
    <div>
      <h3>{displayName}</h3>
      <img src={product.image} alt={displayName} />
      <p>${product.price}</p>
    </div>
  );
}
```

### Option C: Use the Helper Hook

We created `hooks/useProductLanguage.ts` to make this easier:

```tsx
import { useProductLanguage } from '@/hooks/useProductLanguage';

export function ProductCard({ product }: { product: BilingualProduct }) {
  const { getProductName } = useProductLanguage();
  
  return (
    <div>
      <h3>{getProductName(product)}</h3>
      <img src={product.image} alt={getProductName(product)} />
      <p>${product.price}</p>
    </div>
  );
}
```

---

## Step 5: Test Bilingual Display

### Test Arabic Version
1. Visit: `http://localhost:3000/ar/products` (or your products page)
2. Should see all products in Arabic names
3. Example: "علاج بوند فيوجن", "كريم للشعر الجاف 25 مل", etc.

### Test English Version
1. Visit: `http://localhost:3000/en/products`
2. Should see all products in English names
3. Example: "Bond Fusion Treatment", "Dry Hair Cream 25ml", etc.

### Test Locale Switching
1. Use your locale switcher (language dropdown)
2. Switch between `/ar` and `/en`
3. Product names should change accordingly

---

## Troubleshooting

### Problem: "Column name_en does not exist"
**Solution**: Run Step 1 to create the column first

### Problem: Products still showing in English when in /ar route
**Solution**: 
- Clear browser cache: `Ctrl+Shift+Delete`
- Check that your product query includes `name_en`
- Verify the locale context is working: Check `currentLanguage` in console

### Problem: Some products missing English names
**Solution**:
- Check if you missed any UPDATE statements in Step 2
- Run this query to find missing translations:
  ```sql
  SELECT id, name FROM products 
  WHERE status = 'active' AND name_en IS NULL
  ORDER BY id;
  ```

### Problem: Search not finding products in English
**Solution**: Update your search function to search in both columns:
```typescript
// Search in both Arabic and English names
const searchInBoth = (products, query) => {
  return products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.name_en?.toLowerCase().includes(query.toLowerCase())
  );
};
```

---

## Files Created

- ✅ `BILINGUAL_SETUP.md` - Setup overview and implementation guide
- ✅ `APPLY_TRANSLATIONS.md` - This file (step-by-step guide)
- ✅ `scripts/bilingual-catalog.json` - Complete product catalog with translations
- ✅ `scripts/create-bilingual-catalog.js` - Translation generation script
- ✅ `hooks/useProductLanguage.ts` - Helper hook for bilingual products

---

## Summary

You now have:
- ✅ **49 products** fully translated (Arabic → English)
- ✅ **Column `name_en`** added to database
- ✅ **All translations** populated in database
- ✅ **Helper hook** for easy bilingual implementation
- ✅ **Example code** for components

**Next**: Follow Steps 4-5 to update your code and test the bilingual display!

---

**Questions?** Check `BILINGUAL_SETUP.md` for more details or examples.
