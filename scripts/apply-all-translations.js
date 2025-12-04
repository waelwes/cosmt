#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Comprehensive translation mapping with all product names
const translations = {
  // Already translated in previous script
  'علاج بوند فيوجن': {
    en: 'Bond Fusion Treatment',
    description_en: 'Advanced hair treatment system with 3-phase bond restoration technology for damaged and color-treated hair'
  },
  'كريم للشعر الجاف 25 مل': {
    en: 'Dry Hair Cream 25ml',
    description_en: 'Concentrated moisturizing cream with ceramides and wheat proteins for nourishing dry hair'
  },
  'زيت الأرغان المغربي النقي 45 مل': {
    en: 'Pure Moroccan Argan Oil 45ml',
    description_en: 'Pure 100% Moroccan argan oil enriched with vitamins E and omega fatty acids'
  },
  'فرد الكرياتين': {
    en: 'Keratin Straightening',
    description_en: 'Professional keratin treatment for hair straightening and smoothing'
  },
  'صبغة سيمي كلر 60 مل': {
    en: 'Semi Color Dye 60ml',
    description_en: 'Semi-permanent hair dye with rich, vibrant colors that gradually fade without damaging hair'
  },
  'الصبغة العشبية': {
    en: 'Herbal Hair Dye',
    description_en: 'Natural herbal hair dye without harsh chemicals for gentle and safe coloring'
  },
  
  // Additional products - need translation from context
  'شامبو تنظيف 500 مل': {
    en: 'Cleansing Shampoo 500ml',
    description_en: 'Deep cleansing shampoo that removes buildup and impurities from hair'
  },
  'بلسم تنعيم 500 مل': {
    en: 'Smoothing Conditioner 500ml',
    description_en: 'Conditioning balm for smooth and silky hair texture'
  },
  'شامبو تلميع 500 مل': {
    en: 'Shine Shampoo 500ml',
    description_en: 'Professional shine-enhancing shampoo for glossy and vibrant hair'
  },
  'بخاخة الشعر المصبوغ 60 مل': {
    en: 'Color-Treated Hair Spray 60ml',
    description_en: 'Protective spray specifically formulated for colored and highlighted hair'
  },
  'بخاخة الشعر المصبوغ 1000 مل': {
    en: 'Color-Treated Hair Spray 1000ml',
    description_en: 'Large size protective spray for colored and highlighted hair maintenance'
  },
  'صبغة الشعر المستدامة': {
    en: 'Sustainable Hair Dye',
    description_en: 'Eco-friendly hair dye made with natural and sustainable ingredients'
  },
  'زيت شعر ترطيب الشعر الجاف 200 مل': {
    en: 'Dry Hair Moisturizing Oil 200ml',
    description_en: 'Nourishing oil treatment for intensive moisture and repair of dry hair'
  },
  'سيروم ترطيب الشعر الجاف 250 مل': {
    en: 'Dry Hair Moisturizing Serum 250ml',
    description_en: 'Lightweight serum for hydrating and nourishing dry and damaged hair'
  },
  'زيت شعر لمعان 250 مل': {
    en: 'Hair Shine Oil 250ml',
    description_en: 'Lightweight oil that adds brilliant shine and smoothness to hair'
  },
  'سيروم لمعان الشعر 250 مل': {
    en: 'Hair Shine Serum 250ml',
    description_en: 'Serum that enhances natural hair shine and provides smoothness'
  },
  'زيت الجوجوبا المغربي 95 مل': {
    en: 'Moroccan Jojoba Oil 95ml',
    description_en: 'Premium Moroccan jojoba oil for natural hair and skin conditioning'
  },
  'زيت شعر زيت الجوجوبا المغربي 250 مل': {
    en: 'Moroccan Jojoba Oil Hair 250ml',
    description_en: 'Professional size Moroccan jojoba oil for intensive hair treatment'
  },
  'سيروم زيت الجوجوبا المغربي 300 مل': {
    en: 'Moroccan Jojoba Oil Serum 300ml',
    description_en: 'Concentrated serum blend with Moroccan jojoba oil for deep conditioning'
  },
  'سيروم ترطيب الشعر الناعم الشعر بالبروتين 300 مل': {
    en: 'Protein-Rich Smooth Hair Serum 300ml',
    description_en: 'Moisturizing serum enriched with proteins for soft and smooth hair'
  },
  'ماسك فحم ترطيب الشعر الجاف 100 مل': {
    en: 'Charcoal Dry Hair Moisturizing Mask 100ml',
    description_en: 'Detoxifying charcoal mask with deep moisturizing benefits for dry hair'
  },
  'ماسك فحم ترطيب الجسم الشعر 100 مل': {
    en: 'Charcoal Body Hair Moisturizing Mask 100ml',
    description_en: 'Multi-purpose charcoal mask for hair and body moisturization'
  },
  'قناع فحم ترطيب الشعر 100 مل': {
    en: 'Charcoal Hair Moisturizing Mask 100ml',
    description_en: 'Cleansing charcoal mask with hydrating and nourishing properties'
  },
  'ماسك هلام ترطيب الشعر 150 مل': {
    en: 'Gel Hair Moisturizing Mask 150ml',
    description_en: 'Gel-based mask formula for deep hydration and hair repair'
  },
  'ماسك هلام ترطيب الشعر الحرير 200 مل': {
    en: 'Silk Hair Moisturizing Mask 200ml',
    description_en: 'Silky gel mask for smoothing and moisturizing hair treatment'
  },
  'ماسك هلام ترطيب البيضة 200 مل': {
    en: 'Egg Moisturizing Mask 200ml',
    description_en: 'Egg protein-infused mask for nourishing and strengthening hair'
  },
  'شامبو قشرة الرأس 300 مل': {
    en: 'Anti-Dandruff Shampoo 300ml',
    description_en: 'Specialized shampoo to treat and prevent dandruff and scalp issues'
  },
  'شامبو قشرة الرأس صابون 300 مل': {
    en: 'Anti-Dandruff Soap Shampoo 300ml',
    description_en: 'Soap-based anti-dandruff shampoo for effective scalp cleansing'
  },
  'زيت قشرة الرأس سيروم 200 مل': {
    en: 'Anti-Dandruff Oil Serum 200ml',
    description_en: 'Oil serum treatment to eliminate dandruff and soothe scalp'
  },
  'سيروم قشرة الرأس 250 مل': {
    en: 'Anti-Dandruff Serum 250ml',
    description_en: 'Lightweight serum formulation for dandruff treatment and scalp health'
  },
  'ماسك ملح قشرة الرأس 200 مل': {
    en: 'Salt Anti-Dandruff Mask 200ml',
    description_en: 'Salt-based mask treatment for deep cleansing and dandruff relief'
  },
  'ماسك قشرة الرأس شعر 200 مل': {
    en: 'Anti-Dandruff Hair Mask 200ml',
    description_en: 'Targeted mask treatment for dandruff-prone scalp and hair'
  }
};

async function applyTranslations() {
  console.log('🔄 Starting comprehensive product translation application...\n');
  
  try {
    // Fetch all products from database
    console.log('📥 Fetching all products from database...');
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name')
      .eq('status', 'active');
    
    if (fetchError) throw fetchError;
    console.log(`✅ Fetched ${products.length} active products\n`);
    
    // Track results
    let translated = 0;
    let notFound = 0;
    const updates = [];
    
    // Process each product
    console.log('🔍 Processing translations:\n');
    for (const product of products) {
      const translation = translations[product.name.trim()];
      
      if (translation) {
        translated++;
        updates.push({
          id: product.id,
          name_en: translation.en,
          description_en: translation.description_en || ''
        });
        console.log(`✅ ${product.name}`);
        console.log(`   ➜ ${translation.en}`);
      } else {
        notFound++;
        console.log(`⚠️  ${product.name} - No translation found`);
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Translated: ${translated}/${products.length}`);
    console.log(`   ⚠️  Not found: ${notFound}/${products.length}`);
    
    // Ask for confirmation or apply automatically
    if (updates.length > 0) {
      console.log(`\n💾 Applying ${updates.length} translations to database...\n`);
      
      // Option 1: Update directly in products table (add columns name_en, description_en)
      // This is the simplest approach - no new table needed
      
      let successCount = 0;
      for (const update of updates) {
        const { error } = await supabase
          .from('products')
          .update({
            name_en: update.name_en,
            description_en: update.description_en
          })
          .eq('id', update.id);
        
        if (error) {
          console.log(`❌ Failed to update product ID ${update.id}: ${error.message}`);
        } else {
          successCount++;
        }
      }
      
      console.log(`\n✅ Successfully updated ${successCount}/${updates.length} products`);
      console.log('🎉 Translation application complete!');
    }
    
  } catch (error) {
    console.error('❌ Error during translation:', error.message);
    process.exit(1);
  }
}

// Run the script
applyTranslations();
