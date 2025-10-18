// Test Supabase connection
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('payment_gateways')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase error:', error);
    } else {
      console.log('✅ Supabase connection successful');
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('❌ Connection error:', err.message);
  }
}

testConnection();
