// Quick test script to verify Supabase connection
// Run: node scripts/test-supabase-connection.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.error('Please check your .env.local file');
  process.exit(1);
}

console.log('🔍 Testing Supabase connection...');
console.log('URL:', supabaseUrl.substring(0, 30) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Check if we can connect
    console.log('\n1️⃣ Testing basic connection...');
    const { data: testData, error: testError } = await supabase
      .from('categories')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Connection failed:', testError.message);
      return;
    }
    console.log('✅ Connection successful!');

    // Test 2: Check for hair-care category
    console.log('\n2️⃣ Checking for hair-care category...');
    const { data: hairCare, error: hairError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', 'hair-care')
      .maybeSingle();
    
    if (hairError) {
      console.error('❌ Error querying categories:', hairError.message);
      return;
    }

    if (hairCare) {
      console.log('✅ Hair Care category found!');
      console.log('   ID:', hairCare.id);
      console.log('   Name:', hairCare.name);
      console.log('   Slug:', hairCare.slug);
      console.log('   Active:', hairCare.is_active);
      console.log('   Parent ID:', hairCare.parent_id);
    } else {
      console.log('⚠️  Hair Care category not found');
      console.log('   Run: database/scripts/ensure-main-categories.sql in Supabase SQL Editor');
    }

    // Test 3: List all main categories
    console.log('\n3️⃣ Listing all main categories...');
    const { data: mainCategories, error: mainError } = await supabase
      .from('categories')
      .select('id, name, slug, is_active')
      .is('parent_id', null)
      .order('sort_order');
    
    if (mainError) {
      console.error('❌ Error querying main categories:', mainError.message);
      return;
    }

    if (mainCategories && mainCategories.length > 0) {
      console.log(`✅ Found ${mainCategories.length} main categories:`);
      mainCategories.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.slug}) - Active: ${cat.is_active}`);
      });
    } else {
      console.log('⚠️  No main categories found');
    }

    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testConnection();

