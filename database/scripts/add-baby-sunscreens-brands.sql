-- Add Baby Sunscreens Brand Categories
-- This adds Mustela, Baby, Avene, Vichy, Badger as child categories under Baby Sunscreens

DO $$
DECLARE
  baby_sunscreens_id INTEGER;
BEGIN
  -- Get Baby Sunscreens category ID
  SELECT id INTO baby_sunscreens_id FROM categories WHERE slug = 'baby-sunscreens';
  
  IF baby_sunscreens_id IS NULL THEN
    RAISE EXCEPTION 'Baby Sunscreens category not found. Please ensure it exists in the database.';
  END IF;
  
  RAISE NOTICE 'Adding Baby Sunscreen brand categories (parent ID: %)', baby_sunscreens_id;

  -- Insert brand categories as children of Baby Sunscreens
  INSERT INTO categories (name, slug, description, parent_id, is_active, sort_order)
  VALUES
    ('Mustela', 'baby-sunscreens-mustela', 'Mustela baby sunscreen products', baby_sunscreens_id, true, 1),
    ('Baby', 'baby-sunscreens-baby', 'Baby brand sunscreens', baby_sunscreens_id, true, 2),
    ('Avene', 'baby-sunscreens-avene', 'Avene baby sunscreen products', baby_sunscreens_id, true, 3),
    ('Vichy', 'baby-sunscreens-vichy', 'Vichy baby sunscreen products', baby_sunscreens_id, true, 4),
    ('Badger', 'baby-sunscreens-badger', 'Badger baby sunscreen products', baby_sunscreens_id, true, 5)
  ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    sort_order = EXCLUDED.sort_order;

  RAISE NOTICE 'Baby Sunscreen brand categories added successfully!';
END $$;

-- Verify the insertion
SELECT 
  c1.name as main_category,
  c2.name as subcategory,
  c3.name as brand,
  c3.slug as brand_slug
FROM categories c1
JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN categories c3 ON c3.parent_id = c2.id
WHERE c1.slug = 'mother-baby' 
  AND c2.slug = 'baby-sunscreens'
ORDER BY c3.sort_order, c3.name;

