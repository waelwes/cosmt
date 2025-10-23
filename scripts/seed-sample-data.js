const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please check your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedSampleData() {
  try {
    console.log('🌱 Starting to seed sample data...');

    // First, let's add some categories
    console.log('📁 Adding categories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .insert([
        {
          name: 'Skincare',
          slug: 'skincare',
          description: 'Face and body skincare products',
          image: '/api/placeholder/300/300',
          is_active: true,
          sort_order: 1
        },
        {
          name: 'Hair Care',
          slug: 'hair-care',
          description: 'Hair care and styling products',
          image: '/api/placeholder/300/300',
          is_active: true,
          sort_order: 2
        },
        {
          name: 'Makeup',
          slug: 'makeup',
          description: 'Cosmetics and makeup products',
          image: '/api/placeholder/300/300',
          is_active: true,
          sort_order: 3
        },
        {
          name: 'Fragrance',
          slug: 'fragrance',
          description: 'Perfumes and fragrances',
          image: '/api/placeholder/300/300',
          is_active: true,
          sort_order: 4
        }
      ])
      .select();

    if (categoriesError) {
      console.error('❌ Error adding categories:', categoriesError);
    } else {
      console.log('✅ Categories added successfully:', categories.length);
    }

    // Add subcategories
    console.log('📁 Adding subcategories...');
    const { data: subcategories, error: subcategoriesError } = await supabase
      .from('subcategories')
      .insert([
        // Skincare subcategories
        {
          name: 'Face Cleansers',
          slug: 'face-cleansers',
          description: 'Face cleansing products',
          category_id: categories[0].id,
          is_active: true,
          sort_order: 1
        },
        {
          name: 'Moisturizers',
          slug: 'moisturizers',
          description: 'Face and body moisturizers',
          category_id: categories[0].id,
          is_active: true,
          sort_order: 2
        },
        {
          name: 'Serums',
          slug: 'serums',
          description: 'Face serums and treatments',
          category_id: categories[0].id,
          is_active: true,
          sort_order: 3
        },
        // Hair Care subcategories
        {
          name: 'Shampoos',
          slug: 'shampoos',
          description: 'Hair cleansing shampoos',
          category_id: categories[1].id,
          is_active: true,
          sort_order: 1
        },
        {
          name: 'Conditioners',
          slug: 'conditioners',
          description: 'Hair conditioning products',
          category_id: categories[1].id,
          is_active: true,
          sort_order: 2
        },
        {
          name: 'Hair Treatments',
          slug: 'hair-treatments',
          description: 'Hair masks and treatments',
          category_id: categories[1].id,
          is_active: true,
          sort_order: 3
        }
      ])
      .select();

    if (subcategoriesError) {
      console.error('❌ Error adding subcategories:', subcategoriesError);
    } else {
      console.log('✅ Subcategories added successfully:', subcategories.length);
    }

    // Add sample products
    console.log('🛍️ Adding sample products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .insert([
        {
          name: 'Vitamin C Brightening Serum',
          brand: 'Glow Essentials',
          category: 'Skincare',
          price: 65.50,
          original_price: 89.99,
          stock: 45,
          status: 'active',
          rating: 4.6,
          reviews: 89,
          image: '/api/placeholder/300/300',
          is_best_seller: true,
          is_on_sale: true,
          description: 'Brightening vitamin C serum for radiant, glowing skin. Reduces dark spots and evens skin tone.'
        },
        {
          name: 'Deep Hydrating Moisturizer',
          brand: 'Pure Care',
          category: 'Skincare',
          price: 42.00,
          original_price: 55.00,
          stock: 78,
          status: 'active',
          rating: 4.2,
          reviews: 67,
          image: '/api/placeholder/300/300',
          is_best_seller: false,
          is_on_sale: true,
          description: 'Intensive hydrating moisturizer for dry and sensitive skin. Provides 24-hour moisture.'
        },
        {
          name: 'Repairing Hair Mask',
          brand: 'Luxe Beauty',
          category: 'Hair Care',
          price: 89.99,
          original_price: 119.99,
          stock: 32,
          status: 'active',
          rating: 4.8,
          reviews: 124,
          image: '/api/placeholder/300/300',
          is_best_seller: true,
          is_on_sale: true,
          description: 'Deep conditioning hair mask for damaged and dry hair. Restores shine and softness.'
        },
        {
          name: 'Gentle Face Cleanser',
          brand: 'Natural Glow',
          category: 'Skincare',
          price: 28.50,
          original_price: null,
          stock: 56,
          status: 'active',
          rating: 4.4,
          reviews: 45,
          image: '/api/placeholder/300/300',
          is_best_seller: false,
          is_on_sale: false,
          description: 'Gentle foaming cleanser for all skin types. Removes makeup and impurities without stripping skin.'
        },
        {
          name: 'Volumizing Shampoo',
          brand: 'Hair Luxe',
          category: 'Hair Care',
          price: 35.00,
          original_price: 45.00,
          stock: 67,
          status: 'active',
          rating: 4.3,
          reviews: 78,
          image: '/api/placeholder/300/300',
          is_best_seller: false,
          is_on_sale: true,
          description: 'Volumizing shampoo for fine and flat hair. Adds body and bounce to your locks.'
        }
      ])
      .select();

    if (productsError) {
      console.error('❌ Error adding products:', productsError);
    } else {
      console.log('✅ Products added successfully:', products.length);
    }

    console.log('🎉 Sample data seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${categories?.length || 0}`);
    console.log(`   - Subcategories: ${subcategories?.length || 0}`);
    console.log(`   - Products: ${products?.length || 0}`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

seedSampleData();
