# Mother and Baby Category Setup

This document explains the Mother and Baby category structure for the COSMAT website.

## Category Structure

### Main Category
- **Mother and Baby** (`mother-baby`)

### Level 1 Subcategories (8 main sections)

1. **Maternal Care and Breastfeeding** (`maternal-care-breastfeeding`)
   - Breast Pump
   - Nipple Cream
   - Breast Pad
   - Milk Storage Bag

2. **Baby Bath Products** (`baby-bath-products`)
   - Baby Soaps
   - Baby Shampoos
   - Body Cleansers
   - Baby Hair Conditioners

3. **Baby Sunscreens** (`baby-sunscreens`)
   - Brands: Mustela, Baby, Avene, Vichy, Badger

4. **Baby Body Care Products** (`baby-body-care`)
   - Diaper Rash Cream
   - Baby Oil
   - Baby Cologne

5. **Baby Oral Care Products** (`baby-oral-care`)
   - Baby Toothbrushes
   - Baby Toothpastes

6. **Baby Feeding Supplies** (`baby-feeding-supplies`)
   - Bottle
   - Pacifier
   - Exercise Cups
   - Baby Fork and Spoon

7. **Diaper and Wet Wipes** (`diaper-wet-wipes`)
   - Baby Diaper
   - Baby wipes

8. **Dermocosmetic Baby Products** (`dermocosmetic-baby-products`)
   - Baby Hygiene Products
   - Baby Care Oil
   - Baby Care Cream
   - Baby Care Kit
   - Baby Shampoo

## Installation

Run the SQL script to insert the category structure:

```bash
psql -d your_database -f database/scripts/insert-mother-baby-categories.sql
```

Or via Supabase Dashboard:
1. Go to SQL Editor
2. Open `database/scripts/insert-mother-baby-categories.sql`
3. Run the script

## Category Hierarchy

```
Mother and Baby (main)
├── Maternal Care and Breastfeeding
│   ├── Breast Pump
│   ├── Nipple Cream
│   ├── Breast Pad
│   └── Milk Storage Bag
├── Baby Bath Products
│   ├── Baby Soaps
│   ├── Baby Shampoos
│   ├── Body Cleansers
│   └── Baby Hair Conditioners
├── Baby Sunscreens
├── Baby Body Care Products
│   ├── Diaper Rash Cream
│   ├── Baby Oil
│   └── Baby Cologne
├── Baby Oral Care Products
│   ├── Baby Toothbrushes
│   └── Baby Toothpastes
├── Baby Feeding Supplies
│   ├── Bottle
│   ├── Pacifier
│   ├── Exercise Cups
│   └── Baby Fork and Spoon
├── Diaper and Wet Wipes
│   ├── Baby Diaper
│   └── Baby wipes
└── Dermocosmetic Baby Products
    ├── Baby Hygiene Products
    ├── Baby Care Oil
    ├── Baby Care Cream
    ├── Baby Care Kit
    └── Baby Shampoo
```

## URL Structure

The URLs will follow this pattern:
- Main category: `/categories/mother-baby`
- Subcategory: `/categories/mother-baby/maternal-care-breastfeeding`
- Child subcategory: `/categories/mother-baby/maternal-care-breastfeeding/breast-pump`

## Meta Tags

Each category includes:
- `meta_title`: SEO-optimized title
- `meta_description`: SEO-optimized description
- `slug`: URL-friendly identifier

## Notes

- All categories are set to `is_active = true` by default
- The script uses `ON CONFLICT` to handle duplicate slugs gracefully
- Sort order is set for proper display sequence

