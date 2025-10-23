const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fixSkinCareStructure() {
  console.log('🔧 Fixing Skin Care structure to match your requirements...');
  
  // Get Skin Care main category
  const { data: skinCare, error: skinCareError } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('slug', 'skin-care')
    .eq('is_active', true)
    .single();
    
  if (skinCareError) {
    console.error('❌ Error finding Skin Care:', skinCareError);
    return;
  }
  
  console.log('Skin Care ID:', skinCare.id);
  
  // Define the correct structure you want
  const correctStructure = {
    'face-cream': {
      name: 'Face Cream',
      children: ['moisturizer', 'anti-stain', 'sensitive-skin', 'anti-aging', 'oily-skin']
    },
    'eye-contour-care': {
      name: 'Eye Contour Care', 
      children: ['enlightening', 'loss-of-firmness', 'sensitive-skin']
    },
    'face-serum': {
      name: 'Face Serum',
      children: ['anti-wrinkle', 'enlightening', 'loss-of-firmness', 'anti-stain', 'oily-skin']
    },
    'dermocosmetic-skin-care': {
      name: 'Dermocosmetic Skin Care',
      children: []
    },
    'face-mask': {
      name: 'Face Mask',
      children: ['enlightening', 'oily-skin', 'loss-of-firmness', 'cleaning', 'moisturizer']
    },
    'facial-cleansing': {
      name: 'Facial Cleansing',
      children: ['moisturizer', 'makeup-remover', 'purifying', 'sensitive-skin', 'oily-skin']
    },
    'lip-care': {
      name: 'Lip Care',
      children: ['dermocosmetics', 'cream', 'lipstick']
    }
  };
  
  // First, get all current subcategories of Skin Care
  const { data: currentSubs, error: currentSubsError } = await supabase
    .from('categories')
    .select('id, name, slug, parent_id')
    .eq('parent_id', skinCare.id)
    .eq('is_active', true);
    
  if (currentSubsError) {
    console.error('❌ Error finding current subcategories:', currentSubsError);
    return;
  }
  
  console.log('\\n🧹 Cleaning up incorrect subcategories...');
  
  // Remove categories that shouldn't be direct subcategories of Skin Care
  const categoriesToRemove = ['enlightening', 'loss-of-firmness', 'moisturizer', 'sensitive-skin'];
  
  for (const slug of categoriesToRemove) {
    const category = currentSubs.find(sub => sub.slug === slug);
    if (category) {
      console.log(`Removing ${category.name} from Skin Care subcategories...`);
      
      // Set parent_id to null to make it a main category (or delete if not needed)
      const { error: updateError } = await supabase
        .from('categories')
        .update({ parent_id: null })
        .eq('id', category.id);
        
      if (updateError) {
        console.error(`❌ Error updating ${category.name}:`, updateError);
      } else {
        console.log(`✅ Removed ${category.name} from Skin Care`);
      }
    }
  }
  
  // Now organize the correct structure
  console.log('\\n🎯 Organizing correct structure...');
  
  for (const [subcategorySlug, subcategoryData] of Object.entries(correctStructure)) {
    console.log(`\nProcessing ${subcategoryData.name}...`);
    
    // Find the subcategory
    const { data: subcategory, error: subError } = await supabase
      .from('categories')
      .select('id, name, slug, parent_id')
      .eq('slug', subcategorySlug)
      .eq('is_active', true)
      .single();
      
    if (subError) {
      console.error(`❌ Error finding ${subcategoryData.name}:`, subError);
      continue;
    }
    
    if (!subcategory) {
      console.log(`⚠️  ${subcategoryData.name} not found, skipping...`);
      continue;
    }
    
    // Make sure it's a subcategory of Skin Care
    if (subcategory.parent_id !== skinCare.id) {
      console.log(`Setting ${subcategoryData.name} as subcategory of Skin Care...`);
      const { error: updateError } = await supabase
        .from('categories')
        .update({ parent_id: skinCare.id })
        .eq('id', subcategory.id);
        
      if (updateError) {
        console.error(`❌ Error updating ${subcategoryData.name}:`, updateError);
        continue;
      }
    }
    
    console.log(`✅ ${subcategoryData.name} is correctly positioned`);
    
    // Process children
    for (const childSlug of subcategoryData.children) {
      // Try to find the child category by various slug patterns
      const possibleSlugs = [
        childSlug,
        `${subcategorySlug}-${childSlug}`,
        `face-cream-${childSlug}`,
        `face-serum-${childSlug}`,
        `face-mask-${childSlug}`,
        `facial-cleansing-${childSlug}`,
        `lip-care-${childSlug}`,
        `eye-contour-${childSlug}`
      ];
      
      let childCategory = null;
      for (const possibleSlug of possibleSlugs) {
        const { data: found, error: findError } = await supabase
          .from('categories')
          .select('id, name, slug, parent_id')
          .eq('slug', possibleSlug)
          .eq('is_active', true)
          .single();
          
        if (!findError && found) {
          childCategory = found;
          break;
        }
      }
      
      if (childCategory) {
        // Make sure it's a child of the correct subcategory
        if (childCategory.parent_id !== subcategory.id) {
          console.log(`  📝 Moving ${childCategory.name} to be child of ${subcategoryData.name}...`);
          
          const { error: updateError } = await supabase
            .from('categories')
            .update({ parent_id: subcategory.id })
            .eq('id', childCategory.id);
            
          if (updateError) {
            console.error(`    ❌ Error updating ${childCategory.name}:`, updateError);
          } else {
            console.log(`    ✅ Successfully moved ${childCategory.name} under ${subcategoryData.name}`);
          }
        } else {
          console.log(`  ✅ ${childCategory.name} is already correctly positioned`);
        }
      } else {
        console.log(`    ⚠️  Child category ${childSlug} not found, skipping...`);
      }
    }
  }
  
  // Verify the final structure
  console.log('\\n🔍 Verifying final structure...');
  const { data: finalSubs, error: finalError } = await supabase
    .from('categories')
    .select('id, name, slug, parent_id')
    .eq('parent_id', skinCare.id)
    .eq('is_active', true)
    .order('name');
    
  if (!finalError) {
    console.log('\\n📊 Final Skin Care Structure:');
    console.log('===============================');
    
    for (const sub of finalSubs) {
      console.log('\\n' + sub.name);
      
      const { data: children, error: childrenError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('parent_id', sub.id)
        .eq('is_active', true)
        .order('name');
        
      if (!childrenError && children && children.length > 0) {
        children.forEach(child => {
          console.log('  └─ ' + child.name);
        });
      } else {
        console.log('  (No children)');
      }
    }
  }
}

fixSkinCareStructure().catch(console.error);
