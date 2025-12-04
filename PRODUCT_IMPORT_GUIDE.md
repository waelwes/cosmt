# Product Import Guide

## Summary

✅ **49 products successfully imported** from your `catalog_products.csv` file into Supabase.

The import script (`scripts/import-products.js`) automatically maps your Wix catalog CSV data to your site's product schema.

## Data Mapping

### CSV Column → Product Field Mapping:

| CSV Column | Product Field | Notes |
|-----------|---------------|-------|
| `name` | `name` | Required product name |
| `description` | `description` | HTML stripped and cleaned |
| `price` | `price` | Numeric price value |
| `surcharge` | `original_price` | Price + surcharge = original price |
| `inventory` | `stock` | "InStock" = 999, otherwise parsed as integer |
| `brand` | `brand` | Manufacturer/brand name |
| `sku` | `sku` | Stock keeping unit (or handleId if empty) |
| `productImageUrl` | `image` | URL extracted and formatted for Wix CDN |
| `visible` | `status` | "true" = "active", "false" = "inactive" |
| `discountMode` + `discountValue` | `is_on_sale` | True if PERCENT discount > 0 |

### Auto-populated Fields:

- `is_best_seller`: `false` (can be manually set via admin)
- `rating`: `0` (auto-calculated from reviews)
- `reviews`: `0` (auto-calculated from customer reviews)

## Image URL Handling

The import script handles Wix image URLs:

- **Input format**: `2f334a_f793acf6e19141a5903ba3a6e488b299~mv2.png`
- **Output format**: `https://static.wix.com/media/2f334a_f793acf6e19141a5903ba3a6e488b299~mv2.png`

If multiple images separated by semicolons, only the first is used.

## HTML Cleaning

Product descriptions contain HTML tags from Wix that are automatically stripped:

- Removes all HTML tags (`<p>`, `<br>`, etc.)
- Decodes HTML entities (`&quot;`, `&amp;`, etc.)
- Preserves plain text content

## How to Import Products

### Option 1: Via npm script

```bash
npm run import:products
```

### Option 2: Direct Node execution

```bash
node scripts/import-products.js
```

## Requirements

- `.env.local` file with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `catalog_products.csv` file in the project root
- CSV must have a header row with column names

## Re-importing Products

⚠️ **Important**: If you run the import script multiple times, it will create duplicate products since there's no duplicate detection.

To avoid duplicates:
1. Delete old products from Supabase admin panel
2. Or modify the script to check for existing SKUs before inserting

## Inventory Status Values

The script recognizes these values:

| Input | Stock Count |
|-------|-------------|
| `InStock` | 999 (unlimited) |
| Empty/blank | 0 (out of stock) |
| Numeric | Uses the number as-is |

## Troubleshooting

### "Missing Supabase environment variables"

**Solution**: Make sure your `.env.local` file contains:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### CSV file not found

**Solution**: Make sure `catalog_products.csv` is in the project root directory.

### Products not appearing on site

After import:
1. Restart the dev server: `npm run dev`
2. Clear browser cache
3. Check Supabase admin panel to verify products are there
4. Check product status is "active"

## Next Steps

1. ✅ **Products imported** - Visit `/admin/products` to view them
2. 📸 **Verify images** - Check if product images load correctly
3. 🏷️ **Add categories** - Assign products to categories manually or via bulk operations
4. ⭐ **Set featured** - Mark best sellers in admin panel
5. 🔍 **SEO optimization** - Add meta descriptions for each product

## CSV File Structure

Your `catalog_products.csv` contains these main fields:

- **Product Info**: name, description, brand, sku
- **Pricing**: price, surcharge, discountMode, discountValue
- **Images**: productImageUrl (with fallback support)
- **Inventory**: inventory (InStock/numeric values)
- **Status**: visible, ribbon
- **Options**: productOptionName1-6, productOptionType1-6, productOptionDescription1-6
- **Additional Info**: additionalInfoTitle1-6, additionalInfoDescription1-6

## Import Statistics

```
✅ Total Imported: 49 products
❌ Failed: 0 products
📦 Batch Size: 50 products per batch
⏱️ Processing Time: ~2-5 seconds
```

## Support

If you need to:
- **Skip certain products**: Edit the CSV file before import
- **Update existing products**: Delete and re-import or manually edit in admin
- **Change mapping**: Edit `scripts/import-products.js` (see `mapCSVRowToProduct` function)
