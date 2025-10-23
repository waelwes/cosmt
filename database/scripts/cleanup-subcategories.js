const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function cleanupSubcategories() {
  console.log('🧹 Cleaning up subcategories table...');
  console.log('=====================================');
  
  try {
    // Check current state
    console.log('\n📋 Checking current state...');
    
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, name, category_id, subcategory_id')
      .limit(3);
    
    if (prodError) {
      console.error('❌ Error checking products:', prodError);
      return;
    }
    
    console.log('📦 Products sample:');
    products.forEach(prod => {
      console.log(`   ${prod.name}: category_id=${prod.category_id}, subcategory_id=${prod.subcategory_id}`);
    });
    
    // Check if subcategories table exists
    const { data: subcategories, error: subError } = await supabase
      .from('subcategories')
      .select('id, name')
      .limit(1);
    
    if (subError && subError.code === '42P01') {
      console.log('✅ Subcategories table does not exist (already dropped)');
      return;
    } else if (subError) {
      console.error('❌ Error checking subcategories table:', subError);
      return;
    }
    
    console.log(`📁 Subcategories table exists with ${subcategories.length} records`);
    
    // Check if products have subcategory_id values
    const hasSubcategoryRefs = products.some(prod => prod.subcategory_id !== null);
    
    if (hasSubcategoryRefs) {
      console.log('⚠️  Products still have subcategory_id values');
      console.log('📝 Please run this SQL in your Supabase SQL Editor:');
      console.log('');
      console.log('-- Step 1: Drop the foreign key constraint');
      console.log('ALTER TABLE products DROP CONSTRAINT IF EXISTS products_subcategory_id_fkey;');
      console.log('');
      console.log('-- Step 2: Drop the subcategory_id column');
      console.log('ALTER TABLE products DROP COLUMN IF EXISTS subcategory_id;');
      console.log('');
      console.log('-- Step 3: Drop the subcategories table');
      console.log('DROP TABLE IF EXISTS subcategories;');
      console.log('');
      console.log('Then run this script again to verify cleanup.');
      return;
    }
    
    console.log('✅ Products table is clean - no subcategory_id references found');
    
    // Try to drop the subcategories table
    console.log('\n🗑️  Attempting to drop subcategories table...');
    
    // Since we can't execute DDL directly, provide the SQL
    console.log('📝 Please run this SQL in your Supabase SQL Editor:');
    console.log('');
    console.log('-- Drop the subcategories table');
    console.log('DROP TABLE IF EXISTS subcategories;');
    console.log('');
    console.log('Then run this script again to verify the table is dropped.');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

cleanupSubcategories();
