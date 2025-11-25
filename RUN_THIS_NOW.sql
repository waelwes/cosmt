-- RUN THIS IN SUPABASE SQL EDITOR
-- This will add the 5 brand child categories under Baby Sunscreens

DO $$
DECLARE
  baby_sunscreens_id INTEGER;
BEGIN
  SELECT id INTO baby_sunscreens_id FROM categories WHERE slug = 'baby-sunscreens';
  
  IF baby_sunscreens_id IS NULL THEN
    RAISE EXCEPTION 'Baby Sunscreens category not found.';
  END IF;

  RAISE NOTICE 'Adding Baby Sunscreen brands (parent ID: %)', baby_sunscreens_id;

  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  VALUES
    ('Mustela', 'baby-sunscreens-mustela', 'Mustela baby sunscreen', baby_sunscreens_id, true, 1),
    ('Baby', 'baby-sunscreens-baby', 'Baby brand sunscreen', baby_sunscreens_id, true, 2),
    ('Avene', 'baby-sunscreens-avene', 'Avene baby sunscreen', baby_sunscreens_id, true, 3),
    ('Vichy', 'baby-sunscreens-vichy', 'Vichy baby sunscreen', baby_sunscreens_id, true, 4),
    ('Badger', 'baby-sunscreens-badger', 'Badger baby sunscreen', baby_sunscreens_id, true, 5)
  ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    sort_order = EXCLUDED.sort_order;

  RAISE NOTICE '✅ Success! 5 brands added under Baby Sunscreens';
END $$;

