import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ params: string[] }> }
) {
  const resolvedParams = await params;
  const [width, height] = resolvedParams.params;
  
  // Default dimensions if not provided
  const w = parseInt(width) || 400;
  const h = parseInt(height) || 400;
  
  // Create a more efficient SVG placeholder with better caching
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)"/>
  <circle cx="${w/2}" cy="${h/2 - 10}" r="20" fill="#cbd5e1" opacity="0.5"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#64748b">
    ${w}×${h}
  </text>
</svg>`;
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'ETag': `"${w}-${h}-v1"`,
    },
  });
}
