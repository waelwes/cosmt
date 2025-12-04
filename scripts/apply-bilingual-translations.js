#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Read the bilingual catalog
const bilingualCatalog = JSON.parse(
  fs.readFileSync('./scripts/bilingual-catalog.json', 'utf-8')
);

async function applyTranslations() {
  console.log('💾 Applying English translations to products...\n');
  
  try {
    const products = bilingualCatalog.catalog;
    console.log(`📦 Processing ${products.length} products\n`);
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    // Try updating each product with English name
    for (const product of products) {
      try {
        // Update using RPC if available, otherwise use direct update
        const { error } = await supabase
          .from('products')
          .update({
            name_en: product.name_en
          })
          .eq('id', product.id);
        
        if (error) {
          // If column doesn't exist, log for later action
          if (error.message.includes('column "name_en" does not exist')) {
            console.log(`⚠️  Column name_en doesn't exist. Will need to create it first.`);
            break;
          }
          errors.push(`ID ${product.id}: ${error.message}`);
          errorCount++;
        } else {
          console.log(`✅ ID ${product.id}: ${product.name_en}`);
          successCount++;
        }
      } catch (err) {
        errors.push(`ID ${product.id}: ${err.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Results:`);
    console.log(`   ✅ Updated: ${successCount}/${products.length}`);
    console.log(`   ❌ Failed: ${errorCount}/${products.length}`);
    
    if (errors.length > 0 && errors[0].includes('does not exist')) {
      console.log('\n⚠️  Column name_en does not exist in products table.');
      console.log('📝 Please create it first by running this SQL in Supabase:\n');
      console.log('ALTER TABLE products ADD COLUMN name_en TEXT DEFAULT NULL;');
      console.log('\nThen run this script again.');
      process.exit(1);
    }
    
    if (successCount === products.length) {
      console.log('\n🎉 All products successfully translated!');
      console.log('✅ Database is now bilingual (Arabic/English)');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

applyTranslations();
