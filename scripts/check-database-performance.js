const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDatabasePerformance() {
  console.log('🔍 Checking database performance...\n');

  try {
    // 1. Check categories query performance
    console.log('📊 Testing categories query performance...');
    const startTime = Date.now();
    
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('parent_id', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
      .limit(50);

    const categoriesTime = Date.now() - startTime;
    
    if (categoriesError) {
      console.error('❌ Categories query error:', categoriesError);
    } else {
      console.log(`✅ Categories query: ${categoriesTime}ms (${categories.length} records)`);
    }

    // 2. Check products query performance
    console.log('\n📊 Testing products query performance...');
    const productsStartTime = Date.now();
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('name')
      .limit(100);

    const productsTime = Date.now() - productsStartTime;
    
    if (productsError) {
      console.error('❌ Products query error:', productsError);
    } else {
      console.log(`✅ Products query: ${productsTime}ms (${products.length} records)`);
    }

    // 3. Check for missing indexes
    console.log('\n🔍 Checking for missing indexes...');
    
    // Check if indexes exist by running explain analyze
    const { data: explainCategories, error: explainError } = await supabase
      .rpc('explain_query', { 
        query: 'SELECT * FROM categories WHERE is_active = true AND parent_id IS NULL ORDER BY sort_order, name LIMIT 50' 
      });

    if (explainError) {
      console.log('⚠️  Could not check query plan (this is normal for anon key)');
    } else {
      console.log('📋 Query execution plan available');
    }

    // 4. Check table sizes
    console.log('\n📊 Checking table sizes...');
    
    const tables = ['categories', 'products', 'orders', 'customers', 'user_profiles'];
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ ${table}: Error getting count`);
        } else {
          console.log(`📋 ${table}: ${count} records`);
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`);
      }
    }

    // 5. Performance recommendations
    console.log('\n💡 Performance Recommendations:');
    
    if (categoriesTime > 1000) {
      console.log('⚠️  Categories query is slow (>1000ms) - consider adding indexes');
    }
    
    if (productsTime > 1000) {
      console.log('⚠️  Products query is slow (>1000ms) - consider adding indexes');
    }
    
    if (categoriesTime < 100 && productsTime < 100) {
      console.log('✅ Database queries are performing well!');
    }

    console.log('\n🚀 To improve performance, run:');
    console.log('   psql -h your-host -U your-user -d your-db -f database/fix-schema-performance.sql');

  } catch (error) {
    console.error('❌ Error checking database performance:', error);
  }
}

checkDatabasePerformance();
