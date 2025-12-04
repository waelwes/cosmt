-- ============================================================================
-- BILINGUAL PRODUCT TRANSLATION - SQL EXECUTION FILE
-- ============================================================================
-- Run this file in Supabase SQL Editor to add English translations
-- Time Required: ~3 minutes
-- Rollback: ALTER TABLE products DROP COLUMN name_en;
-- ============================================================================

-- STEP 1: Create name_en column (if not exists)
-- Run this first to add the new column for English names
-- ============================================================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS name_en TEXT DEFAULT NULL;

-- Add a comment for documentation
COMMENT ON COLUMN products.name_en IS 'English translation of product name (bilingual support)';

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_name_en ON products(name_en);

-- ============================================================================
-- STEP 2: Insert English Translations for All 49 Products
-- Run this after Step 1 is complete
-- ============================================================================

BEGIN;

-- Product 196-201: Core hair treatments
UPDATE products SET name_en = 'Bond Fusion Treatment' WHERE id = 196;
UPDATE products SET name_en = 'Dry Hair Cream 25ml' WHERE id = 197;
UPDATE products SET name_en = 'Pure Moroccan Argan Oil 45ml' WHERE id = 198;
UPDATE products SET name_en = 'Keratin Straightening' WHERE id = 199;
UPDATE products SET name_en = 'Semi Color Dye 60ml' WHERE id = 200;
UPDATE products SET name_en = 'Herbal Hair Dye' WHERE id = 201;

-- Product 202-204: Mesh/Highlights
UPDATE products SET name_en = 'Blue Mesh 500g' WHERE id = 202;
UPDATE products SET name_en = 'Blue Highlights 500g' WHERE id = 203;
UPDATE products SET name_en = 'White Mesh 500g' WHERE id = 204;

-- Product 205-207: Peroxide/Developer
UPDATE products SET name_en = 'Hair Dye Peroxide 60ml' WHERE id = 205;
UPDATE products SET name_en = 'Hair Dye Peroxide 1000ml' WHERE id = 206;
UPDATE products SET name_en = 'Tinta Hair Dye' WHERE id = 207;

-- Product 208-209: Color-treated hair care
UPDATE products SET name_en = 'Conditioner for Colored Hair 200ml' WHERE id = 208;
UPDATE products SET name_en = 'Shampoo for Colored Hair 250ml' WHERE id = 209;

-- Product 210-211: Daily care
UPDATE products SET name_en = 'Daily Conditioner 250ml' WHERE id = 210;
UPDATE products SET name_en = 'Daily Shampoo 250ml' WHERE id = 211;

-- Product 212-214: Satin oil products
UPDATE products SET name_en = 'Satin Oil 95ml' WHERE id = 212;
UPDATE products SET name_en = 'Satin Oil Conditioner 250ml' WHERE id = 213;
UPDATE products SET name_en = 'Satin Oil Shampoo 300ml' WHERE id = 214;

-- Product 215: Dry/split ends
UPDATE products SET name_en = 'Shampoo for Dry and Split Ends 300ml' WHERE id = 215;

-- Product 216-217: Hair loss prevention
UPDATE products SET name_en = 'Anti-Hair Loss Lotion 75ml' WHERE id = 216;
UPDATE products SET name_en = 'Anti-Hair Loss Shampoo 300ml' WHERE id = 217;

-- Product 218: Dandruff care
UPDATE products SET name_en = 'Anti-Dandruff Shampoo 300ml' WHERE id = 218;

-- Product 219-221: Wax products
UPDATE products SET name_en = 'Hair Shine Wax 100ml' WHERE id = 219;
UPDATE products SET name_en = 'Hair Styling Wax 100ml' WHERE id = 220;
UPDATE products SET name_en = 'Hair Lustre Wax 100ml' WHERE id = 221;

-- Product 222-224: Gel products
UPDATE products SET name_en = 'Curl Hair Gel 150ml' WHERE id = 222;
UPDATE products SET name_en = 'Smooth Hair Gel 200ml' WHERE id = 223;
UPDATE products SET name_en = 'Wet Hair Gel 200ml' WHERE id = 224;

-- Product 225-226: Hair sprays
UPDATE products SET name_en = 'Strong Hair Spray 300ml' WHERE id = 225;
UPDATE products SET name_en = 'Light Hair Spray 300ml' WHERE id = 226;

-- Product 227-228: Silver/Grey hair care
UPDATE products SET name_en = 'Silver Conditioner 200ml' WHERE id = 227;
UPDATE products SET name_en = 'Silver Shampoo 250ml' WHERE id = 228;

-- Product 229: Styling foam
UPDATE products SET name_en = 'Strong Styling Foam 200ml' WHERE id = 229;

-- Product 230: Straightening
UPDATE products SET name_en = 'Temporary Straightening Cream 200ml' WHERE id = 230;

-- Product 231-232: Repair/Therapy
UPDATE products SET name_en = 'Repair Conditioner 200ml' WHERE id = 231;
UPDATE products SET name_en = 'Repair Shampoo 250ml' WHERE id = 232;

-- Product 233: Protein
UPDATE products SET name_en = 'Protein Spray 200ml' WHERE id = 233;

-- Product 234-235: Oil baths
UPDATE products SET name_en = 'Repair Oil Bath 200ml' WHERE id = 234;
UPDATE products SET name_en = 'Keratin Oil Bath 200ml' WHERE id = 235;

-- Product 236-239: Keratin products
UPDATE products SET name_en = 'Keratin Serum 25ml' WHERE id = 236;
UPDATE products SET name_en = 'Keratin Mask 200ml' WHERE id = 237;
UPDATE products SET name_en = 'Keratin Conditioner 250ml' WHERE id = 238;
UPDATE products SET name_en = 'Keratin Shampoo 300ml' WHERE id = 239;

-- Product 240: Shine spray
UPDATE products SET name_en = 'Shine Spray 200ml' WHERE id = 240;

-- Product 241-242: Serums
UPDATE products SET name_en = 'Hair Serum 50ml' WHERE id = 241;
UPDATE products SET name_en = 'Serum Capsules 30 pcs' WHERE id = 242;

-- Product 243-244: Straightening oils
UPDATE products SET name_en = 'Straightening Oil 200ml' WHERE id = 243;
UPDATE products SET name_en = 'Keratin Straightening 85ml' WHERE id = 244;

COMMIT;

-- ============================================================================
-- STEP 3: Verify Translations
-- Run this to check that all translations were applied correctly
-- ============================================================================

SELECT 
  id,
  name as name_ar,
  name_en,
  CASE WHEN name_en IS NOT NULL THEN '✓' ELSE '✗' END as translated
FROM products
WHERE status = 'active'
ORDER BY id;

-- Expected result: 49 rows with all marked as '✓'

-- ============================================================================
-- Optional: View Translation Summary
-- ============================================================================

SELECT 
  COUNT(*) as total_products,
  COUNT(name_en) as with_english_translation,
  COUNT(*) - COUNT(name_en) as missing_translation
FROM products
WHERE status = 'active';

-- Expected result: (49, 49, 0)

-- ============================================================================
-- OPTIONAL: Add description_en column (for future use)
-- Uncomment to add English descriptions column
-- ============================================================================

-- ALTER TABLE products ADD COLUMN IF NOT EXISTS description_en TEXT DEFAULT NULL;

-- ============================================================================
-- OPTIONAL: Rollback Instructions
-- If you need to undo these changes:
-- ============================================================================

-- Drop the new column:
-- ALTER TABLE products DROP COLUMN name_en;

-- Drop the index:
-- DROP INDEX IF EXISTS idx_products_name_en;

-- ============================================================================
-- HOW TO USE THIS FILE
-- ============================================================================

-- 1. Go to Supabase Dashboard: https://app.supabase.com
-- 2. Select your project
-- 3. Click "SQL Editor" in the left sidebar
-- 4. Click "New Query"
-- 5. Copy the entire content of this file (or sections 1-2)
-- 6. Paste into the SQL editor
-- 7. Click "Run" (or press Ctrl+Enter)
-- 8. Wait for completion (should see "Success" message)
-- 9. Run Step 3 verification query to confirm all 49 translations applied

-- ============================================================================
-- TRANSLATION COVERAGE
-- ============================================================================

-- All 49 Products Translated:
-- 
-- ID 196-201:   Core hair treatments (6)
-- ID 202-204:   Mesh/Highlights (3)
-- ID 205-207:   Peroxide/Developer (3)
-- ID 208-209:   Colored hair care (2)
-- ID 210-211:   Daily care (2)
-- ID 212-214:   Satin oil products (3)
-- ID 215:       Dry/split ends (1)
-- ID 216-217:   Hair loss prevention (2)
-- ID 218:       Dandruff care (1)
-- ID 219-221:   Wax products (3)
-- ID 222-224:   Gel products (3)
-- ID 225-226:   Hair sprays (2)
-- ID 227-228:   Silver/Grey hair (2)
-- ID 229:       Styling foam (1)
-- ID 230:       Straightening (1)
-- ID 231-232:   Repair/Therapy (2)
-- ID 233:       Protein (1)
-- ID 234-235:   Oil baths (2)
-- ID 236-239:   Keratin products (4)
-- ID 240:       Shine products (1)
-- ID 241-242:   Serums (2)
-- ID 243-244:   Straightening oils (2)
--
-- TOTAL: 49 products = 100% coverage

-- ============================================================================
