# Next Steps - Product Management Guide

## 🎯 Immediate Actions

### 1. View Imported Products
✅ Already done - products are visible at:
- Admin Panel: http://localhost:3001/admin/products
- Homepage: http://localhost:3001 (check homepage sections)

### 2. Add Missing Pricing
**All prices are currently $0 - this needs to be fixed!**

**Option A: Manual Update (Admin Panel)**
1. Go to `/admin/products`
2. Click on any product
3. Enter the price in the "Price" field
4. Save

**Option B: Bulk Update via SQL**
```sql
-- Example: Update KEUNE products to $25.99
UPDATE products 
SET price = 25.99 
WHERE brand = 'KEUNE' AND price = 0
LIMIT 10;
```

**Option C: Re-import with prices**
1. Add prices to your CSV file
2. Delete old products: `DELETE FROM products WHERE created_at > '2025-01-01'`
3. Run: `npm run import:products`

---

## 🏷️ Category Assignment

Products need categories to be properly organized.

### Current Issue
- CSV doesn't contain category mappings
- All products have `category_id = null`

### Solution 1: Manual Assignment (Admin)
1. Open `/admin/products`
2. Edit each product
3. Select category from dropdown
4. Save

### Solution 2: Bulk Assignment via SQL
```sql
-- Assign KEUNE products to "Hair Care" (category_id = 3)
UPDATE products 
SET category_id = 3 
WHERE brand = 'KEUNE' AND category_id IS NULL;
```

### Your Current Categories
- ID 3: Hair Care
- ID 6: Skin Care
- ID 111: Personal Care

Check `/categories` endpoint for complete list.

---

## 🖼️ Image Verification

### Check Images Are Loading
1. Visit `/admin/products`
2. Scroll through products
3. Verify images display correctly

### If Images Don't Load
**Option A: Wix CDN issue**
- Images may be unavailable from Wix CDN
- Try accessing the image URL directly in browser
- If failed, re-upload images to your server

**Option B: Update Image URLs**
- Modify image field in database
- Point to your own image hosting instead

**Example Update:**
```javascript
// Convert Wix URLs to local URLs
const wixUrl = 'https://static.wix.com/media/2f334a_f793acf6e19141a5903ba3a6e488b299~mv2.png';
const localUrl = '/images/products/product-name.png';
```

---

## 💰 Pricing Strategy

### Set Prices for Products
Pricing data structure:
```javascript
{
  price: 29.99,              // Selling price
  original_price: 49.99,     // Original/MSRP (for discounts)
  is_on_sale: true          // Mark as on sale
}
```

### Bulk Pricing Update Script

Create `scripts/update-prices.js`:
```javascript
// Update specific products with new prices
const updates = {
  'KEUNE': 29.99,            // All KEUNE products
  'Hair Cream': 15.99,       // Specific product
};

Object.entries(updates).forEach(([key, price]) => {
  // Update in Supabase
});
```

---

## 🎁 Advanced Features

### Mark Best Sellers
```sql
UPDATE products 
SET is_best_seller = true 
WHERE id IN (195, 196, 197);  -- Top sellers
```

Then they'll appear in "Best Sellers" section on homepage.

### Mark On Sale
```sql
UPDATE products 
SET is_on_sale = true,
    original_price = price * 1.5  -- 33% off
WHERE brand = 'KEUNE';
```

### Add Product Tags
Products can have tags for filtering:
```sql
-- Future: Add tags column if needed
ALTER TABLE products ADD COLUMN tags TEXT[];
UPDATE products SET tags = ARRAY['popular', 'trending'];
```

---

## 📊 Reporting & Analytics

### View Import Statistics
```sql
SELECT 
  brand, 
  COUNT(*) as count, 
  AVG(price) as avg_price,
  MIN(stock) as min_stock
FROM products 
WHERE created_at > NOW() - INTERVAL 7 DAYS
GROUP BY brand;
```

### Check Product Coverage
```sql
SELECT 
  CASE 
    WHEN price = 0 THEN 'No Price'
    WHEN category_id IS NULL THEN 'No Category'
    WHEN image = '' THEN 'No Image'
    ELSE 'Complete'
  END as status,
  COUNT(*) as count
FROM products
GROUP BY status;
```

---

## 🔄 Updating Products

### Re-import New CSV
1. Prepare new CSV file with updated data
2. Delete old products (optional):
   ```sql
   DELETE FROM products WHERE id IN (SELECT id FROM products ORDER BY created_at DESC LIMIT 49);
   ```
3. Run import: `npm run import:products`

### Update Existing Product
```javascript
// In admin panel or via API
PUT /api/admin/products/{id}
{
  "name": "Updated Name",
  "price": 34.99,
  "stock": 150,
  "category_id": 3
}
```

---

## 🚀 Performance Optimization

### Index Database for Speed
```sql
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
```

### Cache Product Data
Products are already cached via:
- Next.js ISR (Incremental Static Regeneration)
- Supabase request deduplication
- Client-side SWR caching

---

## ✅ Checklist

- [ ] View products in admin panel
- [ ] Add pricing to products
- [ ] Assign categories
- [ ] Verify images load
- [ ] Mark best sellers
- [ ] Set up promotional banners
- [ ] Test checkout with imported products
- [ ] Add product reviews functionality
- [ ] Set up inventory alerts
- [ ] Configure payment processing

---

## 📞 Support Resources

- **Admin Panel**: `/admin/products`
- **API Docs**: Check `/api/admin/products`
- **Database**: Supabase dashboard → `products` table
- **Import Script**: `scripts/import-products.js`
- **Verification**: `scripts/verify-import.js`

---

## 🎓 Learning Resources

### CSV Column Meanings
- `handleId`: Unique product ID from Wix
- `productImageUrl`: Image location code from Wix CDN
- `collection`: Product collection/brand name
- `inventory`: Stock status (InStock/numeric)
- `discountMode`: PERCENT or FIXED
- `productOption*`: Variants (size, color, etc.)

### Database Fields
- `status`: active/inactive (controls visibility)
- `is_best_seller`: Shows in featured section
- `is_on_sale`: Triggers sale badge
- `rating`: 0-5 stars (auto-calculated)
- `reviews`: Number of customer reviews

---

**Last Updated**: 2025-01-01
**Total Products**: 89
**Status**: ✅ Import complete, ready for configuration
