-- Translation tables for dynamic content translation
-- This schema supports multiple languages and content types

-- Languages table
CREATE TABLE IF NOT EXISTS languages (
  id SERIAL PRIMARY KEY,
  code VARCHAR(5) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  native_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_rtl BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert supported languages
INSERT INTO languages (code, name, native_name, is_rtl) VALUES
('en', 'English', 'English', false),
('ar', 'Arabic', 'العربية', true),
('tr', 'Turkish', 'Türkçe', false),
('de', 'German', 'Deutsch', false),
('fr', 'French', 'Français', false),
('es', 'Spanish', 'Español', false),
('it', 'Italian', 'Italiano', false),
('nl', 'Dutch', 'Nederlands', false),
('ja', 'Japanese', '日本語', false),
('zh', 'Chinese', '中文', false),
('hi', 'Hindi', 'हिन्दी', false),
('pt', 'Portuguese', 'Português', false),
('ru', 'Russian', 'Русский', false),
('ko', 'Korean', '한국어', false)
ON CONFLICT (code) DO NOTHING;

-- Product translations table
CREATE TABLE IF NOT EXISTS product_translations (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  brand VARCHAR(100),
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, language_code)
);

-- Category translations table
CREATE TABLE IF NOT EXISTS category_translations (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(category_id, language_code)
);

-- Subcategory translations table
CREATE TABLE IF NOT EXISTS subcategory_translations (
  id SERIAL PRIMARY KEY,
  subcategory_id INTEGER NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(subcategory_id, language_code)
);

-- General translations table for UI elements
CREATE TABLE IF NOT EXISTS translations (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) NOT NULL,
  language_code VARCHAR(5) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  translated_text TEXT NOT NULL,
  context VARCHAR(255), -- e.g., 'ui', 'email', 'notification'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(key, language_code)
);

-- Translation cache table for performance
CREATE TABLE IF NOT EXISTS translation_cache (
  id SERIAL PRIMARY KEY,
  cache_key VARCHAR(255) NOT NULL UNIQUE,
  translated_text TEXT NOT NULL,
  language_code VARCHAR(5) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_translations_product_id ON product_translations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_translations_language ON product_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_category_translations_category_id ON category_translations(category_id);
CREATE INDEX IF NOT EXISTS idx_category_translations_language ON category_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_subcategory_translations_subcategory_id ON subcategory_translations(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_subcategory_translations_language ON subcategory_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_translations_key ON translations(key);
CREATE INDEX IF NOT EXISTS idx_translations_language ON translations(language_code);
CREATE INDEX IF NOT EXISTS idx_translation_cache_key ON translation_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_translation_cache_expires ON translation_cache(expires_at);

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_translation_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM translation_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to get product translation with fallback
CREATE OR REPLACE FUNCTION get_product_translation(
  p_product_id INTEGER,
  p_language_code VARCHAR(5)
)
RETURNS TABLE(
  name VARCHAR(255),
  description TEXT,
  brand VARCHAR(100)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(pt.name, p.name) as name,
    COALESCE(pt.description, p.description) as description,
    COALESCE(pt.brand, p.brand) as brand
  FROM products p
  LEFT JOIN product_translations pt ON p.id = pt.product_id AND pt.language_code = p_language_code
  WHERE p.id = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get category translation with fallback
CREATE OR REPLACE FUNCTION get_category_translation(
  p_category_id INTEGER,
  p_language_code VARCHAR(5)
)
RETURNS TABLE(
  name VARCHAR(255),
  description TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(ct.name, c.name) as name,
    COALESCE(ct.description, c.description) as description
  FROM categories c
  LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.language_code = p_language_code
  WHERE c.id = p_category_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_product_translations_updated_at
  BEFORE UPDATE ON product_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_category_translations_updated_at
  BEFORE UPDATE ON category_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subcategory_translations_updated_at
  BEFORE UPDATE ON subcategory_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_translations_updated_at
  BEFORE UPDATE ON translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
