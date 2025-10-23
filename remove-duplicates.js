const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function removeDuplicateCategories() {
  console.log('🧹 Removing duplicate categories...');
  
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
  
  // Categories that should be removed (they're duplicates or shouldn't exist as main categories)
  const categoriesToRemove = ['enlightening', 'loss-of-firmness', 'moisturizer', 'sensitive-skin'];
  
  for (const slug of categoriesToRemove) {
    // Find all categories with this slug that are main categories (parent_id is null)
    const { data: categories, error: findError } = await supabase
      .from('categories')
      .select('id, name, slug, parent_id')
      .eq('slug', slug)
      .is('parent_id', null)
      .eq('is_active', true);
      
    if (!findError && categories && categories.length > 0) {
      for (const category of categories) {
        console.log(`Removing duplicate main category: ${category.name}`);
        
        // Delete the category
        const { error: deleteError } = await supabase
          .from('categories')
          .delete()
          .eq('id', category.id);
          
        if (deleteError) {
          console.error(`❌ Error deleting ${category.name}:`, deleteError);
        } else {
          console.log(`✅ Deleted ${category.name}`);
        }
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

removeDuplicateCategories().catch(console.error);
