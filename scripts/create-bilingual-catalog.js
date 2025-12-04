#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Complete translation mapping for ALL 49 products (Arabic -> English)
const completeTranslations = {
  // Original 6 products
  'علاج بوند فيوجن': 'Bond Fusion Treatment',
  'كريم للشعر الجاف 25 مل': 'Dry Hair Cream 25ml',
  'زيت الأرغان المغربي النقي 45 مل': 'Pure Moroccan Argan Oil 45ml',
  'فرد الكرياتين': 'Keratin Straightening',
  'صبغة سيمي كلر 60 مل': 'Semi Color Dye 60ml',
  'الصبغة العشبية': 'Herbal Hair Dye',
  
  // Mesh/Highlights products
  'الميش الازرق 500 جم': 'Blue Mesh 500g',
  'ميش الآزرق 500 جم': 'Blue Highlights 500g',
  'ميش الأبيض 500 جم': 'White Mesh 500g',
  
  // Peroxide/Developer
  'اوكسجين الصبغة 60 مل': 'Hair Dye Peroxide 60ml',
  'اوكسجين الصبغة  1000 مل': 'Hair Dye Peroxide 1000ml',
  'صبغة التينتا': 'Tinta Hair Dye',
  
  // Colored hair products
  'بلسم للشعر المصبوغ 200 مل': 'Conditioner for Colored Hair 200ml',
  'شامبو للشعر المصبوغ 250 مل': 'Shampoo for Colored Hair 250ml',
  
  // Daily care
  'بلسم يومي 250 مل': 'Daily Conditioner 250ml',
  'شامبو يومي 250 مل': 'Daily Shampoo 250ml',
  
  // Satin oil products
  'زيت الساتين 95 مل': 'Satin Oil 95ml',
  'بلسم زيت الساتين 250 مل': 'Satin Oil Conditioner 250ml',
  'شامبو زيت الساتين 300 مل': 'Satin Oil Shampoo 300ml',
  
  // Dry/Split ends
  'شامبو للشعر الجاف والمتقصف 300 مل': 'Shampoo for Dry and Split Ends 300ml',
  
  // Hair loss prevention
  'لوشن ضد التساقط  75 مل': 'Anti-Hair Loss Lotion 75ml',
  'شامبو ضد التساقط 300 مل': 'Anti-Hair Loss Shampoo 300ml',
  
  // Dandruff
  'شامبو ضد القشره 300 مل': 'Anti-Dandruff Shampoo 300ml',
  
  // Wax products
  'منتج شمعي لتلميع الشعر 100 مل': 'Hair Shine Wax 100ml',
  'منتج شمعي لتصفيف الشعر 100 مل': 'Hair Styling Wax 100ml',
  'واكس شمعي لتألق الشعر 100 مل': 'Hair Lustre Wax 100ml',
  
  // Gel products
  'جل لتجعيد الشعر 150 مل': 'Curl Hair Gel 150ml',
  'جل للشعر الناعم 200 مل': 'Smooth Hair Gel 200ml',
  'جل لشعر مبلل 200 مل': 'Wet Hair Gel 200ml',
  
  // Hair sprays/fixes
  'مثبت شعرقوي 300 مل': 'Strong Hair Spray 300ml',
  'مثبت شعر خفيف 300 مل': 'Light Hair Spray 300ml',
  
  // Silver/Grey hair care
  'بلسم سيلفر 200 مل': 'Silver Conditioner 200ml',
  'شامبو سيلفر 250 مل': 'Silver Shampoo 250ml',
  
  // Styling foam
  'رغوة تصفيف قوية 200 مل': 'Strong Styling Foam 200ml',
  
  // Straightening products
  'كريم فرد مؤقت 200 مل': 'Temporary Straightening Cream 200ml',
  
  // Repair/Therapy
  'بلسم ربير 200 مل': 'Repair Conditioner 200ml',
  'شامبو الربير 250 مل': 'Repair Shampoo 250ml',
  
  // Protein products
  'بخاخ بروتين 200 مل': 'Protein Spray 200ml',
  
  // Oil baths/treatments
  'حمام زيت ربير 200 مل': 'Repair Oil Bath 200ml',
  
  // Keratin products
  'حمام زيت بالكرياتين 200 مل': 'Keratin Oil Bath 200ml',
  'سيروم بالكرياتين 25 مل': 'Keratin Serum 25ml',
  'ماسك بالكرياتين 200 مل': 'Keratin Mask 200ml',
  'بلسم بالكرياتين 250 مل': 'Keratin Conditioner 250ml',
  'شامبو بالكرياتين 300 مل': 'Keratin Shampoo 300ml',
  
  // Shine/Gloss
  'بخاخ ملمع 200 مل': 'Shine Spray 200ml',
  
  // Serums
  'سيروم  50 مل': 'Hair Serum 50ml',
  'كبسولات سيروم 30 حبه': 'Serum Capsules 30 pcs',
  
  // Straightening oils
  'زيت فرد 200 مل': 'Straightening Oil 200ml',
  'فرد كرياتين 85 مل': 'Keratin Straightening 85ml'
};

async function createBilingualProducts() {
  console.log('🔄 Creating bilingual product catalog...\n');
  
  try {
    // Fetch all products
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, description, brand, image, price, stock, category_id, status')
      .eq('status', 'active')
      .order('id');
    
    if (fetchError) throw fetchError;
    console.log(`✅ Fetched ${products.length} products\n`);
    
    // Generate bilingual products
    const bilingualProducts = [];
    const missingTranslations = [];
    
    for (const product of products) {
      const englishName = completeTranslations[product.name.trim()];
      
      if (englishName) {
        bilingualProducts.push({
          ...product,
          name_ar: product.name,
          name_en: englishName,
          // In locale view, product will use the appropriate name
          has_translation: true
        });
      } else {
        missingTranslations.push(product.name);
      }
    }
    
    console.log(`📊 Translation Status:`);
    console.log(`   ✅ Translated: ${bilingualProducts.length}/${products.length}`);
    console.log(`   ⚠️  Missing: ${missingTranslations.length}/${products.length}\n`);
    
    if (missingTranslations.length > 0) {
      console.log('Missing translations for:');
      missingTranslations.forEach(name => console.log(`   - ${name}`));
    }
    
    // Save bilingual catalog
    const catalogFile = './scripts/bilingual-catalog.json';
    fs.writeFileSync(catalogFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      language: 'Arabic/English',
      totalProducts: products.length,
      translatedProducts: bilingualProducts.length,
      catalog: bilingualProducts
    }, null, 2));
    
    console.log(`\n✅ Saved bilingual catalog to: ${catalogFile}`);
    console.log('📝 This catalog shows both Arabic and English names for each product\n');
    
    // Generate SQL to update database
    console.log('💾 Generating SQL update statements...\n');
    console.log('To apply these translations to your database, run in Supabase SQL Editor:\n');
    console.log('BEGIN;');
    
    // Create temporary translations table if it doesn't exist
    console.log(`
-- Create translations table for bilingual support
CREATE TABLE IF NOT EXISTS product_translations (
  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  language VARCHAR(2) DEFAULT 'en',
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, language)
);

-- Insert Arabic originals and English translations
`);
    
    bilingualProducts.forEach(product => {
      // Insert or update translation
      console.log(`INSERT INTO product_translations (product_id, language, name, description)
VALUES (${product.id}, 'ar', '${product.name_ar.replace(/'/g, "''")}', NULL)
ON CONFLICT (product_id, language) DO UPDATE SET name = EXCLUDED.name;`);
      
      console.log(`INSERT INTO product_translations (product_id, language, name, description)
VALUES (${product.id}, 'en', '${product.name_en.replace(/'/g, "''")}', NULL)
ON CONFLICT (product_id, language) DO UPDATE SET name = EXCLUDED.name;`);
    });
    
    console.log('\nCOMMIT;');
    console.log('\n📌 Alternative: Update products table with name_en column:');
    console.log('ALTER TABLE products ADD COLUMN IF NOT EXISTS name_en TEXT;\n');
    
    bilingualProducts.forEach(product => {
      console.log(`UPDATE products SET name_en = '${product.name_en.replace(/'/g, "''")}' WHERE id = ${product.id};`);
    });
    
    console.log('\n✅ All translations prepared!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createBilingualProducts();
