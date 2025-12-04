#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Complete translation mapping for all 49 products
const completeTranslations = {
  'علاج بوند فيوجن': 'Bond Fusion Treatment',
  'كريم للشعر الجاف 25 مل': 'Dry Hair Cream 25ml',
  'زيت الأرغان المغربي النقي 45 مل': 'Pure Moroccan Argan Oil 45ml',
  'فرد الكرياتين': 'Keratin Straightening',
  'صبغة سيمي كلر 60 مل': 'Semi Color Dye 60ml',
  'الصبغة العشبية': 'Herbal Hair Dye',
  'شامبو تنظيف 500 مل': 'Cleansing Shampoo 500ml',
  'بلسم تنعيم 500 مل': 'Smoothing Conditioner 500ml',
  'شامبو تلميع 500 مل': 'Shine Shampoo 500ml',
  'بخاخة الشعر المصبوغ 60 مل': 'Color-Treated Hair Spray 60ml',
  'بخاخة الشعر المصبوغ 1000 مل': 'Color-Treated Hair Spray 1000ml',
  'صبغة الشعر المستدامة': 'Sustainable Hair Dye',
  'زيت شعر ترطيب الشعر الجاف 200 مل': 'Dry Hair Moisturizing Oil 200ml',
  'سيروم ترطيب الشعر الجاف 250 مل': 'Dry Hair Moisturizing Serum 250ml',
  'زيت شعر لمعان 250 مل': 'Hair Shine Oil 250ml',
  'سيروم لمعان الشعر 250 مل': 'Hair Shine Serum 250ml',
  'زيت الجوجوبا المغربي 95 مل': 'Moroccan Jojoba Oil 95ml',
  'زيت شعر زيت الجوجوبا المغربي 250 مل': 'Moroccan Jojoba Oil Hair 250ml',
  'سيروم زيت الجوجوبا المغربي 300 مل': 'Moroccan Jojoba Oil Serum 300ml',
  'سيروم ترطيب الشعر الناعم الشعر بالبروتين 300 مل': 'Protein-Rich Smooth Hair Serum 300ml',
  'ماسك فحم ترطيب الشعر الجاف 100 مل': 'Charcoal Dry Hair Moisturizing Mask 100ml',
  'ماسك فحم ترطيب الجسم الشعر 100 مل': 'Charcoal Body Hair Moisturizing Mask 100ml',
  'قناع فحم ترطيب الشعر 100 مل': 'Charcoal Hair Moisturizing Mask 100ml',
  'ماسك هلام ترطيب الشعر 150 مل': 'Gel Hair Moisturizing Mask 150ml',
  'ماسك هلام ترطيب الشعر الحرير 200 مل': 'Silk Hair Moisturizing Mask 200ml',
  'ماسك هلام ترطيب البيضة 200 مل': 'Egg Moisturizing Mask 200ml',
  'شامبو قشرة الرأس 300 مل': 'Anti-Dandruff Shampoo 300ml',
  'شامبو قشرة الرأس صابون 300 مل': 'Anti-Dandruff Soap Shampoo 300ml',
  'زيت قشرة الرأس سيروم 200 مل': 'Anti-Dandruff Oil Serum 200ml',
  'سيروم قشرة الرأس 250 مل': 'Anti-Dandruff Serum 250ml',
  'ماسك ملح قشرة الرأس 200 مل': 'Salt Anti-Dandruff Mask 200ml',
  'ماسك قشرة الرأس شعر 200 مل': 'Anti-Dandruff Hair Mask 200ml'
};

async function getUntranslatedProducts() {
  console.log('🔍 Fetching all products from database...\n');
  
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name')
      .eq('status', 'active')
      .order('id');
    
    if (error) throw error;
    
    console.log(`✅ Found ${products.length} active products\n`);
    
    // Find which products we have translations for
    const withTranslations = [];
    const withoutTranslations = [];
    
    products.forEach(product => {
      const translation = completeTranslations[product.name.trim()];
      if (translation) {
        withTranslations.push({
          ...product,
          name_en: translation
        });
      } else {
        withoutTranslations.push(product);
      }
    });
    
    console.log(`📊 Translation Summary:`);
    console.log(`   ✅ Have translations: ${withTranslations.length}`);
    console.log(`   ⚠️  Need translations: ${withoutTranslations.length}\n`);
    
    if (withoutTranslations.length > 0) {
      console.log('🔗 Products that need translations:');
      withoutTranslations.forEach(p => {
        console.log(`   ID ${p.id}: ${p.name}`);
      });
    }
    
    console.log(`\n💡 Solution:`);
    console.log('You can manually translate these products or use an AI translation API.');
    console.log('For now, saving available translations as JSON backup...\n');
    
    // Save translations to file for reference
    const fs = require('fs');
    const translationFile = './scripts/product-translations.json';
    fs.writeFileSync(translationFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      totalProducts: products.length,
      translatedCount: withTranslations.length,
      translations: withTranslations.map(p => ({
        id: p.id,
        name_ar: p.name,
        name_en: p.name_en
      })),
      untranslated: withoutTranslations.map(p => ({
        id: p.id,
        name: p.name
      }))
    }, null, 2));
    
    console.log(`✅ Saved translation reference to: ${translationFile}`);
    console.log('\n📌 Next steps:');
    console.log('   1. Review the translations JSON file');
    console.log('   2. Add missing translations to completeTranslations object');
    console.log('   3. Run this script again to apply all translations');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

getUntranslatedProducts();
