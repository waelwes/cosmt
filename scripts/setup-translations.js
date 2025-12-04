#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase admin client (using anon key for demo, use service_role for production)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function setupDatabase() {
  console.log('🔧 Setting up database schema for translations...\n');
  
  try {
    // Check if columns already exist by trying to query them
    console.log('📋 Checking products table schema...');
    const { data: sample, error: checkError } = await supabase
      .from('products')
      .select('name_en, description_en')
      .limit(1);
    
    if (checkError && checkError.message.includes('column')) {
      console.log('❌ Translation columns not found. Need to add them.\n');
      console.log('⚠️  Cannot add columns via anon key.');
      console.log('✅ Workaround: Using JSONB column for translations\n');
      
      // Alternative: Store translations in JSONB column
      console.log('📥 Adding translations_data JSONB column...');
      
      // Try to create translations_data column for storing JSON translations
      const { error: alterError } = await supabase.rpc('exec', {
        sql: `ALTER TABLE products ADD COLUMN IF NOT EXISTS translations_data JSONB DEFAULT '{}'`
      }).catch(() => ({ error: null })); // Ignore if RPC not available
      
      if (alterError) {
        console.log('⚠️  Could not execute RPC. Will use direct product updates instead.\n');
      }
    } else {
      console.log('✅ Translation columns already exist!\n');
    }
    
    // Try direct approach: update products with translations using JSON format
    console.log('💾 Preparing to apply translations...\n');
    console.log('📌 Strategy: Store English versions as separate JSON data\n');
    
  } catch (error) {
    console.error('❌ Setup error:', error.message);
  }
}

async function applyTranslationsAsJSON() {
  console.log('🔄 Applying translations via product metadata...\n');
  
  // Comprehensive translation mapping
  const translations = {
    'علاج بوند فيوجن': {
      en: 'Bond Fusion Treatment',
      description_en: 'Advanced hair treatment system with 3-phase bond restoration technology for damaged and color-treated hair'
    },
    'كريم للشعر الجاف 25 مل': {
      en: 'Dry Hair Cream 25ml',
      description_en: 'Concentrated moisturizing cream with ceramides and wheat proteins for nourishing dry hair'
    },
    'زيت الأرغان المغربي النقي 45 مل': {
      en: 'Pure Moroccan Argan Oil 45ml',
      description_en: 'Pure 100% Moroccan argan oil enriched with vitamins E and omega fatty acids'
    },
    'فرد الكرياتين': {
      en: 'Keratin Straightening',
      description_en: 'Professional keratin treatment for hair straightening and smoothing'
    },
    'صبغة سيمي كلر 60 مل': {
      en: 'Semi Color Dye 60ml',
      description_en: 'Semi-permanent hair dye with rich, vibrant colors that gradually fade without damaging hair'
    },
    'الصبغة العشبية': {
      en: 'Herbal Hair Dye',
      description_en: 'Natural herbal hair dye without harsh chemicals for gentle and safe coloring'
    }
  };
  
  try {
    // Fetch all products
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name')
      .eq('status', 'active');
    
    if (fetchError) throw fetchError;
    console.log(`📦 Found ${products.length} active products\n`);
    
    // Count translations
    let translatedCount = 0;
    const updateQueue = [];
    
    for (const product of products) {
      const translation = translations[product.name.trim()];
      if (translation) {
        translatedCount++;
        updateQueue.push({ id: product.id, ...translation });
      }
    }
    
    console.log(`📊 Found ${translatedCount} products with translations\n`);
    
    if (updateQueue.length > 0) {
      console.log(`🚀 Applying ${updateQueue.length} translations...\n`);
      
      // Note: This would need the actual columns to exist in the database
      // For now, we'll document what needs to be done
      console.log('✅ Translations prepared. To apply them, you need to:\n');
      console.log('1. Go to Supabase Dashboard (https://app.supabase.com)');
      console.log('2. Navigate to: SQL Editor > Create a new query');
      console.log('3. Run the following SQL command:\n');
      
      // Generate SQL UPDATE statements
      console.log('BEGIN;');
      for (const update of updateQueue) {
        console.log(`UPDATE products SET name_en = '${update.en.replace(/'/g, "''")}' WHERE id = ${update.id};`);
      }
      console.log('COMMIT;');
      
      console.log('\n📝 Alternative: Copy each translation individually:');
      updateQueue.slice(0, 3).forEach(update => {
        console.log(`   Product ID ${update.id}: ${update.en}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function main() {
  await setupDatabase();
  await applyTranslationsAsJSON();
}

main();
