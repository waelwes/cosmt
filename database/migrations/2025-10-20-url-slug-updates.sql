-- Add products.slug if missing
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS slug character varying;

-- Unique index on products.slug (global uniqueness)
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug_unique ON public.products (slug);

-- Ensure subcategories.sort_order exists
ALTER TABLE public.subcategories
ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

