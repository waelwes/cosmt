const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  try {
    console.log('🔍 Checking database contents...');

    // Check categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order');

    if (categoriesError) {
      console.error('❌ Error fetching categories:', categoriesError);
    } else {
      console.log('📁 Categories:', categories.length);
      categories.forEach(cat => console.log(`   - ${cat.name} (${cat.slug})`));
    }

    // Check subcategories
    const { data: subcategories, error: subcategoriesError } = await supabase
      .from('subcategories')
      .select('*')
      .order('sort_order');

    if (subcategoriesError) {
      console.error('❌ Error fetching subcategories:', subcategoriesError);
    } else {
      console.log('📁 Subcategories:', subcategories.length);
      subcategories.forEach(sub => console.log(`   - ${sub.name} (${sub.slug}) - Category ID: ${sub.category_id}`));
    }

    // Check products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('name');

    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
    } else {
      console.log('🛍️ Products:', products.length);
      products.forEach(prod => console.log(`   - ${prod.name} (${prod.brand}) - ${prod.category}`));
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}

checkDatabase();
