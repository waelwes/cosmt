const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function executeMigration() {
  console.log('🚀 Starting Category Merge Migration...');
  console.log('=====================================');
  
  try {
    // Step 1: Check if parent_id column exists
    console.log('\n📋 Step 1: Checking parent_id column...');
    const { data: testData, error: testError } = await supabase
      .from('categories')
      .select('parent_id')
      .limit(1);
    
    if (testError && testError.code === '42703') {
      console.log('❌ parent_id column does not exist');
      console.log('📝 Please run this SQL in your Supabase SQL Editor first:');
      console.log('');
      console.log('ALTER TABLE categories ADD COLUMN parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE;');
      console.log('CREATE INDEX idx_categories_parent_id ON categories(parent_id);');
      console.log('');
      console.log('Then run this script again.');
      return;
    } else if (testError) {
      console.error('❌ Error checking parent_id column:', testError);
      return;
    } else {
      console.log('✅ parent_id column exists');
    }
    
    // Step 2: Get current data
    console.log('\n📊 Step 2: Fetching current data...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('id');
    
    if (catError) {
      console.error('❌ Error fetching categories:', catError);
      return;
    }
    
    const { data: subcategories, error: subError } = await supabase
      .from('subcategories')
      .select('*')
      .order('category_id, id');
    
    if (subError) {
      console.error('❌ Error fetching subcategories:', subError);
      return;
    }
    
    console.log(`   📁 Categories: ${categories.length}`);
    console.log(`   📁 Subcategories: ${subcategories.length}`);
    
    // Step 3: Migrate subcategories
    console.log('\n🔄 Step 3: Migrating subcategories...');
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
      console.log('\n🎉 Subcategories migration completed successfully!');
      
      // Step 4: Update products table
      console.log('\n🔄 Step 4: Updating products table...');
      await updateProductsTable();
      
    } else {
      console.log('\n⚠️  Migration completed with errors. Please review the errors above.');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

async function updateProductsTable() {
  try {
    console.log('   📦 Fetching products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, category_id, subcategory_id');
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }
    
    console.log(`   📦 Found ${products.length} products to update`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      try {
        let newCategoryId = product.category_id;
        
        // If product has subcategory_id, find the corresponding category
        if (product.subcategory_id) {
          const { data: subcategory, error: subError } = await supabase
            .from('subcategories')
            .select('slug')
            .eq('id', product.subcategory_id)
            .single();
          
          if (subError) {
            console.error(`❌ Error fetching subcategory for product ${product.name}:`, subError);
            errorCount++;
            continue;
          }
          
          // Find the new category ID by slug
          const { data: newCategory, error: catError } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', subcategory.slug)
            .eq('parent_id', product.category_id)
            .single();
          
          if (catError) {
            console.error(`❌ Error finding new category for product ${product.name}:`, catError);
            errorCount++;
            continue;
          }
          
          newCategoryId = newCategory.id;
        }
        
        // Update the product
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            category_id: newCategoryId,
            subcategory_id: null  // Clear subcategory_id
          })
          .eq('id', product.id);
        
        if (updateError) {
          console.error(`❌ Error updating product ${product.name}:`, updateError);
          errorCount++;
        } else {
          console.log(`✅ Updated: ${product.name} → category_id: ${newCategoryId}`);
          updatedCount++;
        }
        
      } catch (error) {
        console.error(`❌ Exception updating product ${product.name}:`, error);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Products Update Summary:`);
    console.log(`   ✅ Successfully updated: ${updatedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📦 Total products: ${products.length}`);
    
    if (errorCount === 0) {
      console.log('\n🎉 Products table updated successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Verify the migration in your admin panel');
      console.log('2. Test category loading and product relationships');
      console.log('3. If everything works, drop the subcategories table');
      console.log('4. Update your frontend code to use the new recursive structure');
    } else {
      console.log('\n⚠️  Products update completed with errors. Please review the errors above.');
    }
    
  } catch (error) {
    console.error('❌ Error updating products table:', error);
  }
}

executeMigration();
