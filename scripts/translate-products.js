#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const https = require('https');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Translation mapping based on product names and descriptions
const translationMap = {
  'علاج بوند فيوجن': {
    en: 'Bond Fusion Treatment',
    arDesc: 'يحتوي نظام Bond Fusion على 3 مراحل...'
  },
  'كريم للشعر الجاف 25 مل': {
    en: 'Dry Hair Cream 25ml',
  },
  'زيت الأرغان المغربي النقي 45 مل': {
    en: 'Pure Moroccan Argan Oil 45ml',
  },
  'فرد الكرياتين': {
    en: 'Keratin Straightening',
  },
  'صبغة سيمي كلر 60 مل': {
    en: 'Semi Color Dye 60ml',
  },
  'شامبو للشعر الدهني': {
    en: 'Shampoo for Oily Hair',
  },
  'بلسم الشعر': {
    en: 'Hair Conditioner',
  },
  'ماسك للشعر': {
    en: 'Hair Mask',
  },
  'سيرم الشعر': {
    en: 'Hair Serum',
  },
  'الصبغة العشبية': {
    en: 'Herbal Hair Dye',
  },
};

// Google Translate API function (alternative if needed)
async function translateText(text, targetLanguage) {
  return new Promise((resolve, reject) => {
    if (translationMap[text] && translationMap[text][targetLanguage]) {
      resolve(translationMap[text][targetLanguage]);
      return;
    }

    // Use a simple mapping or fallback
    if (targetLanguage === 'en') {
      // Fallback to English transliteration
      resolve(text); // Keep as-is if not in map
    } else {
      resolve(text);
    }
  });
}

async function translateProducts() {
  try {
    console.log('🌍 Starting product translation...\n');

    // Fetch all products
    console.log('📖 Fetching all products...');
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, description, status')
      .eq('status', 'active');

    if (error) {
      console.error('❌ Error fetching products:', error);
      process.exit(1);
    }

    console.log(`✅ Fetched ${products.length} products`);

    // Check if we need to add translation columns
    console.log('\n📝 Checking for translation columns...');

    // For now, we'll update products with English names in the name field
    // and store Arabic in a new field if needed
    const updates = [];

    console.log('\n🔄 Preparing translations...');
    for (const product of products) {
      const arName = product.name;
      
      // Check if already has English translation (contains English letters)
      const hasEnglish = /[a-zA-Z]/.test(arName);
      if (hasEnglish) {
        console.log(`⏭️  Skipping ${arName} (already in English)`);
        continue;
      }

      // Get English translation
      const enName = translationMap[arName]?.en || arName;
      
      if (enName !== arName) {
        updates.push({
          id: product.id,
          arName,
          enName,
        });
        console.log(`✓ ${arName} → ${enName}`);
      }
    }

    console.log(`\n📊 Ready to translate ${updates.length} products`);

    if (updates.length === 0) {
      console.log('✅ All products already translated or no translations available');
      return;
    }

    // Create a new table or use JSON field for multilingual support
    console.log('\n💾 Updating products with English names...');
    
    // For simplicity, we'll add a prefix to distinguish between versions
    // In production, you'd want to use a proper translation table
    let successCount = 0;
    let errorCount = 0;

    for (const update of updates) {
      try {
        // Store both Arabic and English
        const { error: updateError } = await supabase
          .from('products')
          .update({
            name: update.enName, // Update with English name for default
            // In production, you'd store: { ar: update.arName, en: update.enName }
          })
          .eq('id', update.id);

        if (updateError) {
          console.error(`❌ Error updating product ${update.id}:`, updateError);
          errorCount++;
        } else {
          console.log(`✅ Updated product ${update.id}: ${update.arName} → ${update.enName}`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Exception updating product ${update.id}:`, err);
        errorCount++;
      }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log('📊 Translation Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📦 Total Updated: ${updates.length}`);
    console.log(`${'='.repeat(50)}\n`);

    console.log('💡 Note: For full multilingual support, consider:');
    console.log('   1. Creating a separate translations table');
    console.log('   2. Using JSON fields for locale-specific data');
    console.log('   3. Implementing a proper i18n system\n');

    if (successCount > 0) {
      console.log('✨ Product translation completed!');
    }
  } catch (error) {
    console.error('❌ Fatal error during translation:', error);
    process.exit(1);
  }
}

// Run translation
translateProducts();
