#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyImport() {
  try {
    console.log('🔍 Verifying imported products...\n');

    const { data, error } = await supabase
      .from('products')
      .select('id, name, brand, price, stock, status')
      .limit(5);

    if (error) {
      console.error('❌ Error querying products:', error);
      process.exit(1);
    }

    if (!data || data.length === 0) {
      console.log('⚠️  No products found in database');
      return;
    }

    console.log('✅ Sample of imported products:');
    console.log('');
    data.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Brand: ${product.brand}`);
      console.log(`   Price: $${product.price}`);
      console.log(`   Stock: ${product.stock}`);
      console.log(`   Status: ${product.status}`);
      console.log('');
    });

    // Get total count
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (!countError) {
      console.log(`📊 Total products in database: ${count}`);
    }
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

verifyImport();
