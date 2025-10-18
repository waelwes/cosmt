// Database Structure Checker
// Run this with: node check-database.js

const { createClient } = require('@supabase/supabase-js');

// Replace with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.log('Make sure you have:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('🔍 Checking COSMT Database Structure...\n');

  try {
    // Check if tables exist by querying them
    const tables = [
      'products',
      'orders', 
      'customers',
      'user_profiles',
      'order_items'
    ];

    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: ${count} records`);
        }
      } catch (err) {
        console.log(`❌ ${table}: Table not found or error - ${err.message}`);
      }
    }

    console.log('\n📋 Expected Tables:');
    console.log('✅ products - Product catalog');
    console.log('✅ orders - Customer orders');
    console.log('✅ customers - Customer information');
    console.log('✅ user_profiles - User authentication profiles');
    console.log('✅ order_items - Order line items');

    console.log('\n🔧 If any tables are missing, run the SQL scripts:');
    console.log('1. supabase-schema.sql (main tables)');
    console.log('2. supabase-auth-update.sql (user profiles)');
    console.log('3. supabase-order-items.sql (order items)');

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  }
}

checkDatabase();
