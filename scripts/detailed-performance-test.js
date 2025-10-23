const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function detailedPerformanceTest() {
  console.log('🔍 Detailed Performance Analysis\n');

  try {
    // Test 1: Simple count query
    console.log('1️⃣ Testing simple count query...');
    const countStart = Date.now();
    const { count, error: countError } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });
    const countTime = Date.now() - countStart;
    console.log(`   Count query: ${countTime}ms (${count} records)`);

    // Test 2: Basic select without filters
    console.log('\n2️⃣ Testing basic select...');
    const basicStart = Date.now();
    const { data: basicData, error: basicError } = await supabase
      .from('categories')
      .select('id, name')
      .limit(10);
    const basicTime = Date.now() - basicStart;
    console.log(`   Basic select: ${basicTime}ms (${basicData?.length || 0} records)`);

    // Test 3: Categories with is_active filter
    console.log('\n3️⃣ Testing categories with is_active filter...');
    const activeStart = Date.now();
    const { data: activeData, error: activeError } = await supabase
      .from('categories')
      .select('id, name, parent_id, is_active')
      .eq('is_active', true)
      .limit(10);
    const activeTime = Date.now() - activeStart;
    console.log(`   Active filter: ${activeTime}ms (${activeData?.length || 0} records)`);

    // Test 4: Categories with parent_id filter
    console.log('\n4️⃣ Testing categories with parent_id filter...');
    const parentStart = Date.now();
    const { data: parentData, error: parentError } = await supabase
      .from('categories')
      .select('id, name, parent_id')
      .is('parent_id', null)
      .limit(10);
    const parentTime = Date.now() - parentStart;
    console.log(`   Parent filter: ${parentTime}ms (${parentData?.length || 0} records)`);

    // Test 5: Products basic query
    console.log('\n5️⃣ Testing products basic query...');
    const productStart = Date.now();
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('id, name, status')
      .limit(10);
    const productTime = Date.now() - productStart;
    console.log(`   Products basic: ${productTime}ms (${productData?.length || 0} records)`);

    // Test 6: Products with status filter
    console.log('\n6️⃣ Testing products with status filter...');
    const statusStart = Date.now();
    const { data: statusData, error: statusError } = await supabase
      .from('products')
      .select('id, name, status')
      .eq('status', 'active')
      .limit(10);
    const statusTime = Date.now() - statusStart;
    console.log(`   Status filter: ${statusTime}ms (${statusData?.length || 0} records)`);

    // Test 7: Complex categories query (your actual query)
    console.log('\n7️⃣ Testing complex categories query...');
    const complexStart = Date.now();
    const { data: complexData, error: complexError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('parent_id', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
      .limit(50);
    const complexTime = Date.now() - complexStart;
    console.log(`   Complex query: ${complexTime}ms (${complexData?.length || 0} records)`);

    // Test 8: Products with joins
    console.log('\n8️⃣ Testing products with category joins...');
    const joinStart = Date.now();
    const { data: joinData, error: joinError } = await supabase
      .from('products')
      .select(`
        id, name, brand, price, status,
        categories!products_category_id_fkey(id, name, slug),
        child_categories:categories!products_child_category_id_fkey(id, name, slug)
      `)
      .eq('status', 'active')
      .limit(10);
    const joinTime = Date.now() - joinStart;
    console.log(`   Join query: ${joinTime}ms (${joinData?.length || 0} records)`);

    // Analysis
    console.log('\n📊 Performance Analysis:');
    console.log(`   Count query: ${countTime}ms ${countTime > 100 ? '⚠️' : '✅'}`);
    console.log(`   Basic select: ${basicTime}ms ${basicTime > 50 ? '⚠️' : '✅'}`);
    console.log(`   Active filter: ${activeTime}ms ${activeTime > 100 ? '⚠️' : '✅'}`);
    console.log(`   Parent filter: ${parentTime}ms ${parentTime > 100 ? '⚠️' : '✅'}`);
    console.log(`   Products basic: ${productTime}ms ${productTime > 50 ? '⚠️' : '✅'}`);
    console.log(`   Status filter: ${statusTime}ms ${statusTime > 100 ? '⚠️' : '✅'}`);
    console.log(`   Complex query: ${complexTime}ms ${complexTime > 200 ? '⚠️' : '✅'}`);
    console.log(`   Join query: ${joinTime}ms ${joinTime > 200 ? '⚠️' : '✅'}`);

    // Check for errors
    const errors = [countError, basicError, activeError, parentError, productError, statusError, complexError, joinError];
    const hasErrors = errors.some(err => err);
    if (hasErrors) {
      console.log('\n❌ Errors found:');
      errors.forEach((err, i) => {
        if (err) console.log(`   Query ${i + 1}: ${err.message}`);
      });
    }

    // Recommendations
    console.log('\n💡 Recommendations:');
    if (complexTime > 500) {
      console.log('   - Complex categories query is slow, check if indexes were created properly');
    }
    if (joinTime > 500) {
      console.log('   - Product join query is slow, consider optimizing the join');
    }
    if (basicTime > 100) {
      console.log('   - Basic queries are slow, check database connection or server load');
    }

  } catch (error) {
    console.error('❌ Error in performance test:', error);
  }
}

detailedPerformanceTest();
