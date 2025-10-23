const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function prepareMigration() {
  console.log('🔍 Preparing category merge migration...');
  
  try {
    // Get current categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('id');
    
    if (catError) {
      console.error('❌ Error fetching categories:', catError);
      return;
    }
    
    // Get current subcategories
    const { data: subcategories, error: subError } = await supabase
      .from('subcategories')
      .select('*')
      .order('category_id, id');
    
    if (subError) {
      console.error('❌ Error fetching subcategories:', subError);
      return;
    }
    
    console.log(`📊 Current State:`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Subcategories: ${subcategories.length}`);
    
    console.log(`\n📋 Main Categories:`);
    categories.forEach(cat => {
      console.log(`   ${cat.id}: ${cat.name} (${cat.slug})`);
    });
    
    console.log(`\n📋 Subcategories by Parent:`);
    const subByParent = {};
    subcategories.forEach(sub => {
      if (!subByParent[sub.category_id]) {
        subByParent[sub.category_id] = [];
      }
      subByParent[sub.category_id].push(sub);
    });
    
    Object.keys(subByParent).forEach(parentId => {
      const parent = categories.find(c => c.id == parentId);
      console.log(`   ${parent ? parent.name : 'Unknown'} (ID: ${parentId}):`);
      subByParent[parentId].forEach(sub => {
        console.log(`     - ${sub.name} (${sub.slug})`);
      });
    });
    
    // Generate the migration SQL
    console.log(`\n🔧 Migration SQL to run in Supabase SQL Editor:`);
    console.log(`\n-- Step 1: Add parent_id column`);
    console.log(`ALTER TABLE categories ADD COLUMN parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE;`);
    console.log(`CREATE INDEX idx_categories_parent_id ON categories(parent_id);`);
    
    console.log(`\n-- Step 2: Migrate subcategories`);
    console.log(`INSERT INTO categories (name, slug, description, image, parent_id, sort_order, is_active, meta_title, meta_description, created_at, updated_at)`);
    console.log(`VALUES`);
    
    const insertValues = subcategories.map(sub => {
      return `('${sub.name.replace(/'/g, "''")}', '${sub.slug}', ${sub.description ? `'${sub.description.replace(/'/g, "''")}'` : 'NULL'}, ${sub.image ? `'${sub.image}'` : 'NULL'}, ${sub.category_id}, ${sub.sort_order || 0}, ${sub.is_active}, ${sub.meta_title ? `'${sub.meta_title.replace(/'/g, "''")}'` : 'NULL'}, ${sub.meta_description ? `'${sub.meta_description.replace(/'/g, "''")}'` : 'NULL'}, '${sub.created_at}', '${sub.updated_at}')`;
    });
    
    console.log(insertValues.join(',\n'));
    console.log(`;`);
    
    console.log(`\n-- Step 3: Update products table`);
    console.log(`ALTER TABLE products ADD COLUMN new_category_id INTEGER;`);
    console.log(`UPDATE products SET new_category_id = category_id WHERE subcategory_id IS NULL;`);
    console.log(`UPDATE products SET new_category_id = (SELECT c.id FROM categories c WHERE c.slug = (SELECT s.slug FROM subcategories s WHERE s.id = products.subcategory_id)) WHERE subcategory_id IS NOT NULL;`);
    console.log(`ALTER TABLE products DROP CONSTRAINT products_category_id_fkey;`);
    console.log(`ALTER TABLE products DROP CONSTRAINT products_subcategory_id_fkey;`);
    console.log(`ALTER TABLE products DROP COLUMN subcategory_id;`);
    console.log(`ALTER TABLE products DROP COLUMN category_id;`);
    console.log(`ALTER TABLE products RENAME COLUMN new_category_id TO category_id;`);
    console.log(`ALTER TABLE products ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id);`);
    
    console.log(`\n-- Step 4: Verify migration`);
    console.log(`SELECT c1.id, c1.name AS category, c2.name AS parent FROM categories c1 LEFT JOIN categories c2 ON c1.parent_id = c2.id ORDER BY c2.id, c1.name;`);
    console.log(`SELECT p.id, p.name AS product, c.name AS category FROM products p JOIN categories c ON p.category_id = c.id;`);
    
    console.log(`\n-- Step 5: Clean up (only after verification)`);
    console.log(`DROP TABLE subcategories;`);
    
  } catch (error) {
    console.error('❌ Error preparing migration:', error);
  }
}

prepareMigration();
