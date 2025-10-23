const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function addChildCategoryColumn() {
  console.log('🔧 Adding child_category_id column to products table...');
  
  try {
    // Add the child_category_id column
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS child_category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;
      `
    });
    
    if (error) {
      console.error('❌ Error adding child_category_id column:', error);
      return;
    }
    
    console.log('✅ Successfully added child_category_id column to products table');
    
    // Verify the column was added
    const { data: products, error: verifyError } = await supabase
      .from('products')
      .select('*')
      .limit(1);
      
    if (verifyError) {
      console.error('❌ Error verifying column:', verifyError);
      return;
    }
    
    if (products && products.length > 0 && 'child_category_id' in products[0]) {
      console.log('✅ child_category_id column verified successfully');
    } else {
      console.log('❌ child_category_id column not found after addition');
    }
    
  } catch (error) {
    console.error('❌ Exception:', error);
  }
}

addChildCategoryColumn().catch(console.error);
