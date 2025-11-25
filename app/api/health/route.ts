import { NextResponse } from 'next/server';

/**
 * Simple health check endpoint
 * Use this to verify API routes are working
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'API is working correctly',
  });
}

