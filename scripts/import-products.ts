import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parse';

interface CSVRow {
  handleId: string;
  fieldType: string;
  name: string;
  description: string;
  productImageUrl: string;
  collection: string;
  sku: string;
  ribbon: string;
  price: string;
  surcharge: string;
  visible: string;
  discountMode: string;
  discountValue: string;
  inventory: string;
  weight: string;
  cost: string;
  brand: string;
  [key: string]: string;
}

interface ProductToInsert {
  name: string;
  description: string;
  price: number;
  original_price: number;
  stock: number;
  brand: string;
  sku: string;
  image: string;
  status: string;
  is_best_seller: boolean;
  is_on_sale: boolean;
  rating: number;
  reviews: number;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function parseCSV(filePath: string): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    const rows: CSVRow[] = [];
    const parser = fs.createReadStream(filePath).pipe(
      csv.parse({
        columns: true,
        skip_empty_lines: true,
        bom: true,
      })
    );

    parser.on('data', (row) => {
      rows.push(row);
    });

    parser.on('error', reject);
    parser.on('end', () => resolve(rows));
  });
}

function extractImageUrl(imageUrlString: string): string {
  if (!imageUrlString) return '';
  
  // If it already starts with http, return as is
  if (imageUrlString.startsWith('http')) {
    return imageUrlString;
  }
  
  // If multiple images separated by semicolon, take the first one
  const images = imageUrlString.split(';');
  const firstImage = images[0]?.trim();
  
  if (!firstImage) return '';
  
  // Construct full image URL
  return `https://static.wix.com/media/${firstImage}`;
}

function stripHTML(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function mapCSVRowToProduct(row: CSVRow): ProductToInsert {
  const price = parseFloat(row.price) || 0;
  const surcharge = parseFloat(row.surcharge) || 0;
  const originalPrice = price + surcharge;
  const inventory = row.inventory === 'InStock' ? 999 : parseInt(row.inventory) || 0;

  return {
    name: row.name || 'Unknown Product',
    description: stripHTML(row.description || ''),
    price: price,
    original_price: originalPrice > 0 ? originalPrice : price,
    stock: inventory,
    brand: row.brand || 'Unknown',
    sku: row.sku || row.handleId,
    image: extractImageUrl(row.productImageUrl),
    status: row.visible === 'true' ? 'active' : 'inactive',
    is_best_seller: false,
    is_on_sale: row.discountMode === 'PERCENT' && parseFloat(row.discountValue) > 0,
    rating: 0,
    reviews: 0,
  };
}

async function importProducts() {
  try {
    console.log('📦 Starting product import...');

    const csvPath = path.join(process.cwd(), 'catalog_products.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.error(`❌ CSV file not found at ${csvPath}`);
      process.exit(1);
    }

    console.log(`📖 Parsing CSV from ${csvPath}...`);
    const csvRows = await parseCSV(csvPath);
    console.log(`✅ Parsed ${csvRows.length} rows`);

    const productsToInsert: ProductToInsert[] = [];
    
    console.log('🔄 Mapping CSV rows to product schema...');
    for (const row of csvRows) {
      try {
        if (row.name && row.fieldType === 'Product') {
          const product = mapCSVRowToProduct(row);
          productsToInsert.push(product);
        }
      } catch (error) {
        console.warn(`⚠️  Skipping row with ID ${row.handleId}:`, error);
      }
    }

    console.log(`✅ Mapped ${productsToInsert.length} products`);

    if (productsToInsert.length === 0) {
      console.warn('⚠️  No products to import');
      return;
    }

    // Insert in batches of 50
    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < productsToInsert.length; i += batchSize) {
      const batch = productsToInsert.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(productsToInsert.length / batchSize);

      console.log(`📤 Uploading batch ${batchNum}/${totalBatches} (${batch.length} products)...`);

      const { data, error } = await supabase
        .from('products')
        .insert(batch)
        .select();

      if (error) {
        console.error(`❌ Error importing batch ${batchNum}:`, error);
        errorCount += batch.length;
      } else {
        successCount += batch.length;
        console.log(`✅ Batch ${batchNum} imported successfully`);
      }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log('📊 Import Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📦 Total: ${productsToInsert.length}`);
    console.log(`${'='.repeat(50)}\n`);

    if (successCount > 0) {
      console.log('✨ Product import completed successfully!');
    } else {
      console.error('❌ Product import failed - no products were imported');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Fatal error during import:', error);
    process.exit(1);
  }
}

// Run the import
importProducts();
