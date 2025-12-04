#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Comprehensive translation mapping for product names and basic descriptions
const translations = {
  'علاج بوند فيوجن': {
    en: 'Bond Fusion Treatment',
    description_en: 'Advanced hair treatment system with 3-phase bond restoration. Strengthens hair structure, prevents breakage, and restores shine. Suitable for all hair types including colored and treated hair.'
  },
  'كريم للشعر الجاف 25 مل': {
    en: 'Dry Hair Cream 25ml',
    description_en: 'Concentrated moisturizing cream with ceramides and wheat proteins. Restores dry, damaged hair. Provides hydration, smoothness, and protection from environmental damage and UV rays.'
  },
  'زيت الأرغان المغربي النقي 45 مل': {
    en: 'Pure Moroccan Argan Oil 45ml',
    description_en: 'Pure 100% Moroccan argan oil enriched with vitamins E and omega-6. Stops hair loss, promotes growth, and adds shine. Use before/after blow drying or with any hair product.'
  },
  'فرد الكرياتين': {
    en: 'Keratin Straightening',
    description_en: 'Professional keratin treatment for hair straightening and smoothing. Repairs damaged hair from heat styling. Safe for all hair types with 5 levels of hair strength improvement.'
  },
  'صبغة سيمي كلر 60 مل': {
    en: 'Semi Color Dye 60ml',
    description_en: 'Semi-permanent hair dye. Rich color that gradually fades with each wash. Safe for sensitive hair and compatible with other treatments.'
  },
  'شامبو للشعر الدهني': {
    en: 'Shampoo for Oily Hair',
    description_en: 'Clarifying shampoo formulated for oily hair types. Removes excess oil and buildup while maintaining hair health. Leaves hair fresh and clean.'
  },
  'بلسم الشعر': {
    en: 'Hair Conditioner',
    description_en: 'Nourishing hair conditioner for all hair types. Provides moisture and smoothness. Reduces frizz and adds shine with every wash.'
  },
  'ماسك للشعر': {
    en: 'Hair Mask',
    description_en: 'Intensive hair treatment mask. Deep conditioning treatment for dry and damaged hair. Use once weekly for optimal results.'
  },
  'سيرم الشعر': {
    en: 'Hair Serum',
    description_en: 'Lightweight hair serum for smoothing and frizz control. Adds shine and protects against heat damage. Works on all hair types.'
  },
  'الصبغة العشبية': {
    en: 'Herbal Hair Dye',
    description_en: 'Natural herbal hair dye without harsh chemicals. Gentle formula suitable for sensitive scalp. Provides natural color with herbal conditioning benefits.'
  },
  'زيت جوز الهند': {
    en: 'Coconut Oil',
    description_en: 'Pure coconut oil for hair care. Deeply moisturizes and conditions. Use as a pre-wash treatment or leave-in conditioner.'
  },
  'ماسك العسل': {
    en: 'Honey Mask',
    description_en: 'Honey-based hair mask with natural moisturizing properties. Strengthens hair and adds shine. Perfect for all hair types.'
  },
};

async function syncTranslations() {
  try {
    console.log('🌍 Starting product translation sync...\n');

    // Fetch all products
    console.log('📖 Fetching all products...');
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, description')
      .eq('status', 'active');

    if (error) {
      console.error('❌ Error fetching products:', error);
      process.exit(1);
    }

    console.log(`✅ Fetched ${products.length} products\n`);

    let translatedCount = 0;
    let notFoundCount = 0;

    console.log('🔄 Processing translations:\n');

    for (const product of products) {
      const arName = product.name;
      const translation = translations[arName];

      if (!translation) {
        console.log(`⏭️  ${arName} - No translation found`);
        notFoundCount++;
        continue;
      }

      // Update product with English name (you can modify this logic)
      // Option 1: Store English name with [EN] prefix
      const enName = `[EN] ${translation.en}`;
      const enDescription = translation.description_en || '';

      try {
        // For now, log what would be updated
        // To actually update, uncomment the code below
        
        // const { error: updateError } = await supabase
        //   .from('products')
        //   .update({
        //     name: enName,
        //     description: enDescription,
        //   })
        //   .eq('id', product.id);

        console.log(`✅ ${arName}`);
        console.log(`   → English: ${translation.en}`);
        console.log(`   → Description: ${translation.description_en.substring(0, 60)}...`);
        console.log('');

        translatedCount++;
      } catch (err) {
        console.error(`❌ Error processing ${arName}:`, err.message);
      }
    }

    console.log(`${'='.repeat(60)}`);
    console.log('📊 Translation Summary:');
    console.log(`   ✅ Translated: ${translatedCount}`);
    console.log(`   ❓ Not Found: ${notFoundCount}`);
    console.log(`   📦 Total Products: ${products.length}`);
    console.log(`${'='.repeat(60)}\n`);

    console.log('💡 Implementation Strategy:');
    console.log('   For production, you have 3 options:\n');
    console.log('   1️⃣  SIMPLE: Add [EN] prefix to English names');
    console.log('       Pro: Easy, no schema changes');
    console.log('       Con: Limited to two languages\n');
    
    console.log('   2️⃣  RECOMMENDED: Create translations table');
    console.log('       CREATE TABLE product_translations (');
    console.log('         id SERIAL PRIMARY KEY,');
    console.log('         product_id INT REFERENCES products(id),');
    console.log('         language_code VARCHAR(2),');
    console.log('         name VARCHAR(255),');
    console.log('         description TEXT');
    console.log('       )\n');
    
    console.log('   3️⃣  ADVANCED: Use JSON fields in products table');
    console.log('       Modify products table to add:');
    console.log('       - names_json: {"ar": "...", "en": "..."}');
    console.log('       - descriptions_json: {"ar": "...", "en": "..."}\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run sync
syncTranslations();
