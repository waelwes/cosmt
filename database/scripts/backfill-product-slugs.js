// Backfill product slugs using Supabase service key (non-destructive)
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function generateSlug(text = '') {
  return text
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function slugExists(slug, excludeId = null) {
  let q = supabase.from('products').select('id').eq('slug', slug).limit(1);
  if (excludeId) q = q.neq('id', excludeId);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).length > 0;
}

async function main() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug')
    .limit(10000);
  if (error) throw error;

  for (const p of products || []) {
    if (p.slug && p.slug.trim()) continue;
    const base = generateSlug(p.name || `product-${p.id}`);
    let candidate = base || `product-${p.id}`;
    let i = 1;
    while (await slugExists(candidate, p.id)) {
      i += 1;
      candidate = `${base}-${i}`;
    }
    const { error: updErr } = await supabase
      .from('products')
      .update({ slug: candidate, updated_at: new Date().toISOString() })
      .eq('id', p.id);
    if (updErr) throw updErr;
    console.log(`Updated product ${p.id} -> ${candidate}`);
  }
  console.log('Backfill complete');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


