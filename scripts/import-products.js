#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Make sure your .env.local file has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Simple CSV parser (handles quoted fields)
function parseCSV(content) {
  const lines = content.split('\n');
  const headers = parseCSVLine(lines[0]);
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;

    const values = parseCSVLine(lines[i]);
    const record = {};

    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = values[j] || '';
    }

    records.push(record);
  }

  return records;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result.map(v => v.trim());
}

function extractImageUrl(imageUrlString) {
  if (!imageUrlString) return '';

  if (imageUrlString.startsWith('http')) {
    return imageUrlString;
  }

  const images = imageUrlString.split(';');
  const firstImage = images[0]?.trim();

  if (!firstImage) return '';

  return `https://static.wix.com/media/${firstImage}`;
}

function stripHTML(html) {
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

function mapCSVRowToProduct(row) {
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
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parseCSV(fileContent);

    console.log(`✅ Parsed ${records.length} rows`);

    const productsToInsert = [];

    console.log('🔄 Mapping CSV rows to product schema...');
    for (const row of records) {
      try {
        if (row.name && row.fieldType === 'Product') {
          const product = mapCSVRowToProduct(row);
          productsToInsert.push(product);
        }
      } catch (error) {
        console.warn(`⚠️  Skipping row with ID ${row.handleId}:`, error.message);
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

      console.log(
        `📤 Uploading batch ${batchNum}/${totalBatches} (${batch.length} products)...`
      );

      const { data, error } = await supabase.from('products').insert(batch).select();

      if (error) {
        console.error(`❌ Error importing batch ${batchNum}:`, error.message);
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
