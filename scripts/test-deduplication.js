const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testDeduplication() {
  console.log('🔄 Testing Request Deduplication\n');

  try {
    // Test 1: Multiple simultaneous requests to the same endpoint
    console.log('1️⃣ Testing simultaneous requests...');
    
    const startTime = Date.now();
    
    // Create 5 simultaneous requests
    const requests = [];
    for (let i = 0; i < 5; i++) {
      requests.push(
        supabase
          .from('categories')
          .select('id, name')
          .eq('is_active', true)
          .limit(10)
      );
    }
    
    const results = await Promise.all(requests);
    const totalTime = Date.now() - startTime;
    
    const successfulRequests = results.filter(r => !r.error).length;
    console.log(`✅ Completed ${successfulRequests}/5 requests in ${totalTime}ms`);
    
    // Test 2: Rapid sequential requests
    console.log('\n2️⃣ Testing rapid sequential requests...');
    
    const sequentialStart = Date.now();
    const sequentialResults = [];
    
    for (let i = 0; i < 3; i++) {
      const requestStart = Date.now();
      const result = await supabase
        .from('products')
        .select('id, name')
        .eq('status', 'active')
        .limit(5);
      const requestTime = Date.now() - requestStart;
      
      sequentialResults.push({
        index: i + 1,
        time: requestTime,
        success: !result.error
      });
    }
    
    const sequentialTotal = Date.now() - sequentialStart;
    console.log(`✅ Sequential requests completed in ${sequentialTotal}ms`);
    sequentialResults.forEach(r => {
      console.log(`   Request ${r.index}: ${r.time}ms ${r.success ? '✅' : '❌'}`);
    });
    
    // Test 3: Mixed request types
    console.log('\n3️⃣ Testing mixed request types...');
    
    const mixedStart = Date.now();
    const mixedRequests = [
      supabase.from('categories').select('count', { count: 'exact', head: true }),
      supabase.from('products').select('count', { count: 'exact', head: true }),
      supabase.from('categories').select('id, name').limit(5),
      supabase.from('products').select('id, name').limit(5),
      supabase.from('categories').select('id, name').limit(5), // Duplicate
    ];
    
    const mixedResults = await Promise.all(mixedRequests);
    const mixedTotal = Date.now() - mixedStart;
    
    const successfulMixed = mixedResults.filter(r => !r.error).length;
    console.log(`✅ Mixed requests: ${successfulMixed}/5 successful in ${mixedTotal}ms`);
    
    // Analysis
    console.log('\n📊 Deduplication Analysis:');
    
    if (totalTime < 1000) {
      console.log('✅ Simultaneous requests are well-optimized');
    } else {
      console.log('⚠️ Simultaneous requests could be better optimized');
    }
    
    if (sequentialTotal < 500) {
      console.log('✅ Sequential requests are fast');
    } else {
      console.log('⚠️ Sequential requests are slow');
    }
    
    if (mixedTotal < 800) {
      console.log('✅ Mixed requests are well-handled');
    } else {
      console.log('⚠️ Mixed requests could be optimized');
    }
    
    // Check for duplicate data in results
    const categoryResults = results.filter(r => !r.error && r.data);
    if (categoryResults.length > 0) {
      const firstData = categoryResults[0].data;
      const allSame = categoryResults.every(r => 
        JSON.stringify(r.data) === JSON.stringify(firstData)
      );
      
      if (allSame) {
        console.log('✅ All requests returned identical data (good for caching)');
      } else {
        console.log('⚠️ Requests returned different data (may indicate caching issues)');
      }
    }
    
    console.log('\n💡 Recommendations:');
    if (totalTime > 1000) {
      console.log('   - Consider implementing request batching for simultaneous calls');
    }
    if (sequentialTotal > 500) {
      console.log('   - Consider implementing request caching for sequential calls');
    }
    
  } catch (error) {
    console.error('❌ Error in deduplication test:', error);
  }
}

testDeduplication();
