const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkIndexes() {
  console.log('🔍 Checking if database indexes were created...\n');

  try {
    // Test if indexes are working by comparing query performance
    console.log('1️⃣ Testing query with potential index usage...');
    
    // This query should benefit from an index on is_active
    const start1 = Date.now();
    const { data: data1, error: error1 } = await supabase
      .from('categories')
      .select('id, name')
      .eq('is_active', true)
      .limit(5);
    const time1 = Date.now() - start1;
    console.log(`   Query with is_active filter: ${time1}ms`);

    // This query should benefit from an index on parent_id
    const start2 = Date.now();
    const { data: data2, error: error2 } = await supabase
      .from('categories')
      .select('id, name')
      .is('parent_id', null)
      .limit(5);
    const time2 = Date.now() - start2;
    console.log(`   Query with parent_id filter: ${time2}ms`);

    // This query should benefit from an index on status
    const start3 = Date.now();
    const { data: data3, error: error3 } = await supabase
      .from('products')
      .select('id, name')
      .eq('status', 'active')
      .limit(5);
    const time3 = Date.now() - start3;
    console.log(`   Query with status filter: ${time3}ms`);

    // Test a query that should be slow without indexes
    const start4 = Date.now();
    const { data: data4, error: error4 } = await supabase
      .from('categories')
      .select('id, name')
      .eq('name', 'Hair Care')
      .limit(1);
    const time4 = Date.now() - start4;
    console.log(`   Query with name filter (no index): ${time4}ms`);

    console.log('\n📊 Analysis:');
    console.log(`   is_active filter: ${time1}ms ${time1 < 100 ? '✅ Good' : '⚠️ Slow'}`);
    console.log(`   parent_id filter: ${time2}ms ${time2 < 100 ? '✅ Good' : '⚠️ Slow'}`);
    console.log(`   status filter: ${time3}ms ${time3 < 100 ? '✅ Good' : '⚠️ Slow'}`);
    console.log(`   name filter: ${time4}ms ${time4 < 200 ? '✅ Good' : '⚠️ Slow'}`);

    // Check if we can see any performance difference
    if (time1 < time4 && time2 < time4) {
      console.log('\n✅ Indexes appear to be working - filtered queries are faster than name search');
    } else {
      console.log('\n⚠️ Indexes may not be working properly - no significant performance difference');
    }

    // Test connection quality
    console.log('\n🌐 Testing connection quality...');
    const connectionTests = [];
    for (let i = 0; i < 5; i++) {
      const start = Date.now();
      await supabase.from('categories').select('count', { count: 'exact', head: true });
      const time = Date.now() - start;
      connectionTests.push(time);
    }
    
    const avgTime = connectionTests.reduce((a, b) => a + b, 0) / connectionTests.length;
    const minTime = Math.min(...connectionTests);
    const maxTime = Math.max(...connectionTests);
    
    console.log(`   Average response time: ${avgTime.toFixed(0)}ms`);
    console.log(`   Min response time: ${minTime}ms`);
    console.log(`   Max response time: ${maxTime}ms`);
    console.log(`   Connection stability: ${maxTime - minTime < 100 ? '✅ Stable' : '⚠️ Unstable'}`);

    if (avgTime > 200) {
      console.log('\n💡 High latency detected - this is likely the main performance bottleneck');
      console.log('   - Consider using a Supabase region closer to your location');
      console.log('   - Check your internet connection');
      console.log('   - Consider implementing more aggressive caching');
    }

  } catch (error) {
    console.error('❌ Error checking indexes:', error);
  }
}

checkIndexes();
