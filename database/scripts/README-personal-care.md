# Personal Care Categories SQL Script

## Overview
This script inserts the complete Personal Care category structure into the database with 3 levels of hierarchy.

## Structure

```
Personal Care (Level 1)
├── Perfume and Deodorant (Level 2)
│   ├── Perfume (Level 3)
│   ├── Deodorant (Level 3)
│   ├── Body Sprays (Level 3)
│   └── Roll On (Level 3)
├── Solar Products (Level 2)
│   ├── Sunscreen (Level 3)
│   ├── Bronzer (Level 3)
│   └── After Sun Care (Level 3)
├── Body and Bath Products (Level 2)
│   ├── Hygiene Products (Level 3)
│   ├── Bathroom and Shower (Level 3)
│   └── Body Care (Level 3)
├── Hand, Foot and Nail Care (Level 2)
├── Hair Removal Products (Level 2)
├── Oral Health (Level 2)
├── Eyebrow and Eyelash Care (Level 2)
├── Shaving Products (Level 2)
├── Sexual Health (Level 2)
├── Care Supplies (Level 2)
└── Dermocosmetic Personal Care (Level 2)
```

## How to Run

1. Go to Supabase SQL Editor
2. Open or paste the script content
3. Click "RUN" button
4. Check the output for success messages

## What It Does

- Creates the main "Personal Care" category
- Creates 11 subcategory level categories
- Creates all child categories (Level 3)
- Sets proper parent-child relationships
- Sets correct sorting order
- Handles conflicts gracefully (won't create duplicates)

## After Running

The categories will automatically appear in:
- The mega menu
- The admin product form
- Category navigation
- Product filtering

## Verify Installation

Run this query to verify:

```sql
-- Check Personal Care hierarchy
SELECT 
  c1.name as main_category,
  c2.name as subcategory,
  c3.name as child_category
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN categories c3 ON c3.parent_id = c2.id
WHERE c1.slug = 'personal-care'
ORDER BY c1.id, c2.sort_order, c3.sort_order;
```


