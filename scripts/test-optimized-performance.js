const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testOptimizedPerformance() {
  console.log('🚀 Testing Optimized Performance\n');

  try {
    // Test 1: Categories query (your main query)
    console.log('1️⃣ Testing categories query...');
    const categoriesStart = Date.now();
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('parent_id', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
      .limit(50);
    const categoriesTime = Date.now() - categoriesStart;
    
    if (categoriesError) {
      console.error('❌ Categories error:', categoriesError.message);
    } else {
      console.log(`✅ Categories: ${categoriesTime}ms (${categories.length} records)`);
      
      // Analyze category structure
      const mainCategories = categories.filter(cat => cat.parent_id === null);
      const subcategories = categories.filter(cat => cat.parent_id !== null);
      console.log(`   - Main categories: ${mainCategories.length}`);
      console.log(`   - Subcategories: ${subcategories.length}`);
    }

    // Test 2: Products query
    console.log('\n2️⃣ Testing products query...');
    const productsStart = Date.now();
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id, name, brand, price, status,
        categories!products_category_id_fkey(id, name, slug),
        child_categories:categories!products_child_category_id_fkey(id, name, slug)
      `)
      .eq('status', 'active')
      .limit(100);
    const productsTime = Date.now() - productsStart;
    
    if (productsError) {
      console.error('❌ Products error:', productsError.message);
    } else {
      console.log(`✅ Products: ${productsTime}ms (${products.length} records)`);
    }

    // Test 3: Multiple rapid requests (cache test)
    console.log('\n3️⃣ Testing cache effectiveness...');
    const rapidRequests = [];
    for (let i = 0; i < 5; i++) {
      rapidRequests.push(
        supabase
          .from('categories')
          .select('id, name')
          .eq('is_active', true)
          .limit(10)
      );
    }
    
    const rapidStart = Date.now();
    const rapidResults = await Promise.all(rapidRequests);
    const rapidTime = Date.now() - rapidStart;
    
    const successfulRapid = rapidResults.filter(r => !r.error).length;
    console.log(`✅ Rapid requests: ${rapidTime}ms (${successfulRapid}/5 successful)`);

    // Test 4: Connection stability
    console.log('\n4️⃣ Testing connection stability...');
    const stabilityTests = [];
    for (let i = 0; i < 10; i++) {
      stabilityTests.push(
        supabase
          .from('categories')
          .select('count', { count: 'exact', head: true })
      );
    }
    
    const stabilityStart = Date.now();
    const stabilityResults = await Promise.all(stabilityTests);
    const stabilityTime = Date.now() - stabilityStart;
    
    const successfulStability = stabilityResults.filter(r => !r.error).length;
    const avgStabilityTime = stabilityTime / stabilityResults.length;
    
    console.log(`✅ Stability test: ${stabilityTime}ms total (${avgStabilityTime.toFixed(0)}ms avg)`);
    console.log(`   - Success rate: ${(successfulStability / stabilityResults.length * 100).toFixed(1)}%`);

    // Performance analysis
    console.log('\n📊 Performance Analysis:');
    console.log(`   Categories query: ${categoriesTime}ms ${categoriesTime < 200 ? '✅' : '⚠️'}`);
    console.log(`   Products query: ${productsTime}ms ${productsTime < 200 ? '✅' : '⚠️'}`);
    console.log(`   Rapid requests: ${rapidTime}ms ${rapidTime < 500 ? '✅' : '⚠️'}`);
    console.log(`   Avg response: ${avgStabilityTime.toFixed(0)}ms ${avgStabilityTime < 150 ? '✅' : '⚠️'}`);

    // Recommendations
    console.log('\n💡 Recommendations:');
    if (categoriesTime > 200) {
      console.log('   - Categories query is slow, check if indexes are working');
    }
    if (productsTime > 200) {
      console.log('   - Products query is slow, consider optimizing joins');
    }
    if (avgStabilityTime > 150) {
      console.log('   - High latency detected, implement aggressive caching');
    }
    if (rapidTime > 500) {
      console.log('   - Rapid requests are slow, check for request batching');
    }

    // Overall assessment
    const overallScore = 
      (categoriesTime < 200 ? 1 : 0) +
      (productsTime < 200 ? 1 : 0) +
      (rapidTime < 500 ? 1 : 0) +
      (avgStabilityTime < 150 ? 1 : 0);
    
    console.log(`\n🎯 Overall Performance Score: ${overallScore}/4`);
    if (overallScore >= 3) {
      console.log('🚀 Excellent performance! Your optimizations are working well.');
    } else if (overallScore >= 2) {
      console.log('⚡ Good performance with room for improvement.');
    } else {
      console.log('🐌 Performance needs optimization. Consider the recommendations above.');
    }

  } catch (error) {
    console.error('❌ Error in performance test:', error);
  }
}

testOptimizedPerformance();
