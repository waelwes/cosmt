const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function runMigration() {
  console.log('🚀 Starting category merge migration...');
  
  try {
    // Step 1: Check current state
    console.log('📊 Checking current database state...');
    
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*');
    
    if (catError) {
      console.error('❌ Error fetching categories:', catError);
      return;
    }
    
    const { data: subcategories, error: subError } = await supabase
      .from('subcategories')
      .select('*');
    
    if (subError) {
      console.error('❌ Error fetching subcategories:', subError);
      return;
    }
    
    console.log(`📋 Found ${categories.length} categories and ${subcategories.length} subcategories`);
    
    // Step 2: Add parent_id column (if it doesn't exist)
    console.log('Step 1: Adding parent_id column...');
    
    // Check if parent_id already exists by trying to select it
    const { data: testData, error: testError } = await supabase
      .from('categories')
      .select('parent_id')
      .limit(1);
    
    if (testError && testError.code === '42703') {
      // Column doesn't exist, we need to add it
      console.log('⚠️  parent_id column does not exist, this migration requires manual SQL execution');
      console.log('Please run this SQL in your Supabase SQL editor:');
      console.log('ALTER TABLE categories ADD COLUMN parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE;');
      return;
    } else if (testError) {
      console.error('❌ Error checking parent_id column:', testError);
      return;
    } else {
      console.log('✅ parent_id column already exists');
    }
    
    // Step 3: Migrate subcategories
    console.log('Step 2: Migrating subcategories...');
    
    let migratedCount = 0;
    let errorCount = 0;
    
    for (const sub of subcategories) {
      try {
        // Check if this subcategory already exists in categories
        const { data: existing, error: checkError } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', sub.slug)
          .eq('name', sub.name)
          .limit(1);
        
        if (checkError) {
          console.error(`❌ Error checking existing subcategory ${sub.name}:`, checkError);
          errorCount++;
          continue;
        }
        
        if (existing && existing.length > 0) {
          console.log(`⏭️  Skipping ${sub.name} (already exists)`);
          continue;
        }
        
        // Insert subcategory as child of main category
        const { error: insertError } = await supabase
          .from('categories')
          .insert({
            name: sub.name,
            slug: sub.slug,
            description: sub.description,
            image: sub.image,
            parent_id: sub.category_id,
            sort_order: sub.sort_order,
            is_active: sub.is_active,
            meta_title: sub.meta_title,
            meta_description: sub.meta_description,
            created_at: sub.created_at,
            updated_at: sub.updated_at
          });
        
        if (insertError) {
          console.error(`❌ Error inserting subcategory ${sub.name}:`, insertError);
          errorCount++;
        } else {
          console.log(`✅ Migrated: ${sub.name} → parent_id: ${sub.category_id}`);
          migratedCount++;
        }
      } catch (error) {
        console.error(`❌ Exception migrating ${sub.name}:`, error);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Successfully migrated: ${migratedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📋 Total subcategories: ${subcategories.length}`);
    
    if (errorCount === 0) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('\nNext steps:');
      console.log('1. Update products table to use new category structure');
      console.log('2. Test the new hierarchy');
      console.log('3. Drop the old subcategories table');
    } else {
      console.log('\n⚠️  Migration completed with errors. Please review the errors above.');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

runMigration();
