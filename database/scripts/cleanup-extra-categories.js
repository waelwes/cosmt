const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function cleanUpExtraCategories() {
  console.log('🧹 Cleaning up extra categories...');
  
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
  
  // Categories that should NOT be direct subcategories of Skin Care
  const categoriesToRemove = ['enlightening', 'loss-of-firmness', 'moisturizer', 'sensitive-skin'];
  
  for (const slug of categoriesToRemove) {
    const { data: category, error: findError } = await supabase
      .from('categories')
      .select('id, name, slug, parent_id')
      .eq('slug', slug)
      .eq('parent_id', skinCare.id)
      .eq('is_active', true)
      .single();
      
    if (!findError && category) {
      console.log(`Removing ${category.name} from Skin Care subcategories...`);
      
      // Set parent_id to null to make it a main category
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
  
  console.log('\n✅ Cleanup complete!');
  
  // Verify final structure
  console.log('\n🔍 Final Skin Care Structure:');
  const { data: finalSubs, error: finalError } = await supabase
    .from('categories')
    .select('id, name, slug, parent_id')
    .eq('parent_id', skinCare.id)
    .eq('is_active', true)
    .order('name');
    
  if (!finalError) {
    console.log('===============================');
    
    for (const sub of finalSubs) {
      console.log('\n' + sub.name);
      
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

cleanUpExtraCategories().catch(console.error);
