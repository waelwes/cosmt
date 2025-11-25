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

    // Check if categories already exist
    console.log('📁 Checking existing categories...');
    const { data: existingCategories, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .limit(10);

    if (fetchError) {
      console.error('❌ Error fetching categories:', fetchError);
      return;
    }

    let categories = existingCategories;

    // If no categories exist, add them
    if (!categories || categories.length === 0) {
      console.log('📁 Adding categories...');
      const { data: newCategories, error: categoriesError } = await supabase
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
        return;
      } else {
        console.log('✅ Categories added successfully:', newCategories.length);
        categories = newCategories;
      }
    } else {
      console.log('✅ Categories already exist:', categories.length);
    }

    // Skip subcategories for now - just add products
    console.log('⏭️ Skipping subcategories - focusing on products only');

    // Add sample products
    console.log('🛍️ Adding sample products...');
    const sampleProducts = [
      {
        name: 'Vitamin C Brightening Serum',
        brand: 'Glow Essentials',
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
      },
      {
        name: 'Anti-Aging Night Cream',
        brand: 'Youth Labs',
        price: 95.00,
        original_price: 125.00,
        stock: 23,
        status: 'active',
        rating: 4.7,
        reviews: 156,
        image: '/api/placeholder/300/300',
        is_best_seller: true,
        is_on_sale: true,
        description: 'Advanced anti-aging night cream with retinol and peptides for firmer, younger-looking skin.'
      },
      {
        name: 'Hydrating Face Toner',
        brand: 'Aqua Pure',
        price: 32.00,
        original_price: null,
        stock: 89,
        status: 'active',
        rating: 4.1,
        reviews: 34,
        image: '/api/placeholder/300/300',
        is_best_seller: false,
        is_on_sale: false,
        description: 'Alcohol-free hydrating toner that balances pH and prepares skin for moisturizer.'
      },
      {
        name: 'Color Protecting Conditioner',
        brand: 'Color Guard',
        price: 38.50,
        original_price: 48.00,
        stock: 45,
        status: 'active',
        rating: 4.5,
        reviews: 92,
        image: '/api/placeholder/300/300',
        is_best_seller: false,
        is_on_sale: true,
        description: 'Sulfate-free conditioner that protects color-treated hair and adds shine.'
      },
      {
        name: 'Matte Lipstick',
        brand: 'Beauty Luxe',
        price: 24.99,
        original_price: null,
        stock: 112,
        status: 'active',
        rating: 4.3,
        reviews: 67,
        image: '/api/placeholder/300/300',
        is_best_seller: false,
        is_on_sale: false,
        description: 'Long-lasting matte lipstick in rich, vibrant colors. Comfortable and non-drying formula.'
      },
      {
        name: 'Eau de Parfum',
        brand: 'Scent Divine',
        price: 85.00,
        original_price: 110.00,
        stock: 28,
        status: 'active',
        rating: 4.8,
        reviews: 203,
        image: '/api/placeholder/300/300',
        is_best_seller: true,
        is_on_sale: true,
        description: 'Luxurious eau de parfum with floral and woody notes. Long-lasting and elegant scent.'
      },
      {
        name: 'SPF 50 Sunscreen',
        brand: 'Sun Shield',
        price: 29.99,
        original_price: null,
        stock: 76,
        status: 'active',
        rating: 4.4,
        reviews: 89,
        image: '/api/placeholder/300/300',
        is_best_seller: false,
        is_on_sale: false,
        description: 'Broad spectrum SPF 50 sunscreen that protects against UVA and UVB rays. Non-greasy formula.'
      },
      {
        name: 'Keratin Treatment',
        brand: 'Smooth Hair',
        price: 120.00,
        original_price: 150.00,
        stock: 15,
        status: 'active',
        rating: 4.9,
        reviews: 178,
        image: '/api/placeholder/300/300',
        is_best_seller: true,
        is_on_sale: true,
        description: 'Professional keratin treatment that smooths frizz and straightens hair for up to 6 months.'
      },
      {
        name: 'Foundation Primer',
        brand: 'Flawless Base',
        price: 36.00,
        original_price: 45.00,
        stock: 54,
        status: 'active',
        rating: 4.2,
        reviews: 43,
        image: '/api/placeholder/300/300',
        is_best_seller: false,
        is_on_sale: true,
        description: 'Silicone-based primer that creates a smooth canvas for foundation and extends makeup wear.'
      },
      {
        name: 'Body Mist',
        brand: 'Fresh Scent',
        price: 18.50,
        original_price: null,
        stock: 93,
        status: 'active',
        rating: 4.0,
        reviews: 28,
        image: '/api/placeholder/300/300',
        is_best_seller: false,
        is_on_sale: false,
        description: 'Light, refreshing body mist with citrus and floral notes. Perfect for everyday wear.'
      },
      {
        name: 'Retinol Eye Cream',
        brand: 'Youth Restore',
        price: 58.00,
        original_price: 75.00,
        stock: 41,
        status: 'active',
        rating: 4.6,
        reviews: 112,
        image: '/api/placeholder/300/300',
        is_best_seller: false,
        is_on_sale: true,
        description: 'Gentle retinol eye cream that reduces fine lines and dark circles around the eyes.'
      },
      {
        name: 'Argan Oil Treatment',
        brand: 'Moroccan Luxe',
        price: 45.99,
        original_price: null,
        stock: 68,
        status: 'active',
        rating: 4.5,
        reviews: 76,
        image: '/api/placeholder/300/300',
        is_best_seller: false,
        is_on_sale: false,
        description: '100% pure argan oil treatment that nourishes and repairs dry, damaged hair.'
      },
      {
        name: 'Blush Palette',
        brand: 'Cheek Chic',
        price: 42.00,
        original_price: 52.00,
        stock: 37,
        status: 'active',
        rating: 4.3,
        reviews: 59,
        image: '/api/placeholder/300/300',
        is_best_seller: false,
        is_on_sale: true,
        description: 'Six-shade blush palette with matte and shimmer finishes. Buildable and long-lasting.'
      },
      {
        name: 'Men\'s Cologne',
        brand: 'Urban Man',
        price: 65.00,
        original_price: 85.00,
        stock: 22,
        status: 'active',
        rating: 4.4,
        reviews: 87,
        image: '/api/placeholder/300/300',
        is_best_seller: false,
        is_on_sale: true,
        description: 'Sophisticated men\'s cologne with woody and spicy notes. Perfect for professional and casual wear.'
      },
      {
        name: 'Clay Face Mask',
        brand: 'Pore Perfect',
        price: 22.50,
        original_price: null,
        stock: 84,
        status: 'active',
        rating: 4.1,
        reviews: 31,
        image: '/api/placeholder/300/300',
        is_best_seller: false,
        is_on_sale: false,
        description: 'Purifying clay mask that draws out impurities and minimizes pores. Suitable for all skin types.'
      },
      {
        name: 'Heat Protectant Spray',
        brand: 'Style Guard',
        price: 26.99,
        original_price: 32.00,
        stock: 71,
        status: 'active',
        rating: 4.2,
        reviews: 45,
        image: '/api/placeholder/300/300',
        is_best_seller: false,
        is_on_sale: true,
        description: 'Thermal protection spray that shields hair from heat damage up to 450°F. Lightweight and non-greasy.'
      },
      {
        name: 'Mascara',
        brand: 'Lash Queen',
        price: 19.99,
        original_price: null,
        stock: 105,
        status: 'active',
        rating: 4.6,
        reviews: 134,
        image: '/api/placeholder/300/300',
        is_best_seller: true,
        is_on_sale: false,
        description: 'Volumizing and lengthening mascara that provides dramatic lashes. Waterproof and smudge-proof.'
      },
      {
        name: 'Perfume Oil',
        brand: 'Essence Elite',
        price: 78.00,
        original_price: 98.00,
        stock: 19,
        status: 'active',
        rating: 4.7,
        reviews: 92,
        image: '/api/placeholder/300/300',
        is_best_seller: false,
        is_on_sale: true,
        description: 'Concentrated perfume oil with exotic and oriental notes. Long-lasting and highly scented.'
      },
      {
        name: 'Exfoliating Scrub',
        brand: 'Glow Skin',
        price: 34.50,
        original_price: 42.00,
        stock: 63,
        status: 'active',
        rating: 4.3,
        reviews: 58,
        image: '/api/placeholder/300/300',
        is_best_seller: false,
        is_on_sale: true,
        description: 'Gentle exfoliating scrub with natural ingredients that removes dead skin cells and reveals smooth skin.'
      },
      {
        name: 'Hair Oil Serum',
        brand: 'Silk Touch',
        price: 49.99,
        original_price: null,
        stock: 52,
        status: 'active',
        rating: 4.4,
        reviews: 71,
        image: '/api/placeholder/300/300',
        is_best_seller: false,
        is_on_sale: false,
        description: 'Silicone-free hair oil serum that tames frizz and adds instant shine. Heat protection included.'
      },
      {
        name: 'Eyeshadow Palette',
        brand: 'Shadow Luxe',
        price: 55.00,
        original_price: 70.00,
        stock: 29,
        status: 'active',
        rating: 4.5,
        reviews: 98,
        image: '/api/placeholder/300/300',
        is_best_seller: false,
        is_on_sale: true,
        description: 'Professional eyeshadow palette with 12 highly pigmented shades. Matte and shimmer finishes included.'
      },
      {
        name: 'Solid Perfume',
        brand: 'Pocket Scent',
        price: 15.99,
        original_price: null,
        stock: 127,
        status: 'active',
        rating: 4.0,
        reviews: 23,
        image: '/api/placeholder/300/300',
        is_best_seller: false,
        is_on_sale: false,
        description: 'Travel-friendly solid perfume that provides long-lasting fragrance. Compact and mess-free.'
      }
    ];

    const { data: products, error: productsError } = await supabase
      .from('products')
      .insert(sampleProducts)
      .select();

    if (productsError) {
      console.error('❌ Error adding products:', productsError);
    } else {
      console.log('✅ Products added successfully:', products.length);
    }

    console.log('🎉 Sample data seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${categories?.length || 0}`);
    console.log(`   - Products: ${products?.length || 0}`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

seedSampleData();
