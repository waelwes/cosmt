import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return NextResponse.json({
    supabaseUrl,
    supabaseKey: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'Not set',
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlStartsWithHttps: supabaseUrl?.startsWith('https://'),
    timestamp: new Date().toISOString()
  });
}
