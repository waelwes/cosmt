const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function verifyMigration() {
  console.log('🔍 Verifying Category Migration...');
  console.log('==================================');
  
  try {
    // Check category hierarchy
    console.log('\n📋 Category Hierarchy:');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        parent_id,
        categories!parent_id(id, name)
      `)
      .order('parent_id, name');
    
    if (catError) {
      console.error('❌ Error fetching categories:', catError);
      return;
    }
    
    // Group categories by parent
    const mainCategories = categories.filter(c => c.parent_id === null);
    const subCategories = categories.filter(c => c.parent_id !== null);
    
    console.log(`   📁 Main Categories: ${mainCategories.length}`);
    console.log(`   📁 Subcategories: ${subCategories.length}`);
    console.log(`   📁 Total Categories: ${categories.length}`);
    
    console.log('\n🌳 Category Tree:');
    mainCategories.forEach(main => {
      console.log(`   ${main.name} (ID: ${main.id})`);
      const children = subCategories.filter(sub => sub.parent_id === main.id);
      children.forEach(child => {
        console.log(`     └── ${child.name} (ID: ${child.id})`);
      });
    });
    
    // Check products
    console.log('\n📦 Product-Category Relationships:');
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        category_id,
        categories!inner(id, name, parent_id, parent:categories!parent_id(name))
      `);
    
    if (prodError) {
      console.error('❌ Error fetching products:', prodError);
      return;
    }
    
    console.log(`   📦 Products: ${products.length}`);
    products.forEach(product => {
      const category = product.categories;
      const parentName = category.parent ? category.parent.name : 'Main Category';
      console.log(`   ${product.name} → ${parentName} > ${category.name}`);
    });
    
    // Check for any remaining subcategory references
    console.log('\n🔍 Checking for remaining subcategory references...');
    const { data: productsWithSub, error: subProdError } = await supabase
      .from('products')
      .select('id, name, subcategory_id')
      .not('subcategory_id', 'is', null);
    
    if (subProdError) {
      console.error('❌ Error checking subcategory references:', subProdError);
    } else if (productsWithSub.length > 0) {
      console.log(`⚠️  Found ${productsWithSub.length} products still referencing subcategories:`);
      productsWithSub.forEach(prod => {
        console.log(`   ${prod.name} (subcategory_id: ${prod.subcategory_id})`);
      });
    } else {
      console.log('✅ No products are referencing subcategories');
    }
    
    console.log('\n🎉 Migration verification completed!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

verifyMigration();
