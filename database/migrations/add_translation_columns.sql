-- Add English translation columns to products table
-- This migration adds support for bilingual product display (Arabic/English)

-- Add name_en column if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_en TEXT;

-- Add description_en column if it doesn't exist  
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Add language column to track primary language
ALTER TABLE products ADD COLUMN IF NOT EXISTS primary_language TEXT DEFAULT 'ar';

-- Create index for faster queries by language
CREATE INDEX IF NOT EXISTS idx_products_language ON products(primary_language);

-- Add comment to document the columns
COMMENT ON COLUMN products.name_en IS 'English translation of product name';
COMMENT ON COLUMN products.description_en IS 'English translation of product description';
COMMENT ON COLUMN products.primary_language IS 'Primary language of product (ar=Arabic, en=English)';
