// CDN and Edge Caching Configuration
import { createClient } from '@supabase/supabase-js';

// Enhanced Supabase client with edge caching
export class CDNOptimizedClient {
  private static instance: CDNOptimizedClient;
  private supabase: any;

  static getInstance(): CDNOptimizedClient {
    if (!CDNOptimizedClient.instance) {
      CDNOptimizedClient.instance = new CDNOptimizedClient();
    }
    return CDNOptimizedClient.instance;
  }

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            // Enable edge caching
            'Cache-Control': 'public, max-age=300, s-maxage=600', // 5min browser, 10min CDN
          },
        },
        db: {
          schema: 'public',
        },
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      }
    );
  }

  // Get optimized query with edge caching
  async getWithEdgeCache<T>(
    table: string,
    query: any,
    cacheKey: string,
    ttl: number = 300 // 5 minutes default
  ): Promise<T> {
    try {
      // Add cache headers for edge caching
      const { data, error } = await this.supabase
        .from(table)
        .select(query.select)
        .match(query.match || {})
        .order(query.order?.column, { ascending: query.order?.ascending })
        .limit(query.limit)
        .abortSignal(query.abortSignal);

      if (error) throw error;

      // Store in edge cache (if available)
      if (typeof window !== 'undefined' && 'caches' in window) {
        const cache = await caches.open('supabase-cache');
        const response = new Response(JSON.stringify(data), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': `public, max-age=${ttl}`,
          },
        });
        await cache.put(cacheKey, response);
      }

      return data;
    } catch (error) {
      console.error('Edge cache query failed:', error);
      throw error;
    }
  }

  // Get from edge cache first, then fallback to network
  async getWithCacheFallback<T>(
    table: string,
    query: any,
    cacheKey: string,
    ttl: number = 300
  ): Promise<T> {
    // Try to get from cache first
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const cache = await caches.open('supabase-cache');
        const cachedResponse = await cache.match(cacheKey);
        
        if (cachedResponse) {
          const data = await cachedResponse.json();
          console.log(`🎯 Edge cache HIT for ${cacheKey}`);
          return data;
        }
      } catch (error) {
        console.warn('Edge cache read failed:', error);
      }
    }

    // Fallback to network request
    console.log(`🔄 Edge cache MISS for ${cacheKey}, fetching from network...`);
    return this.getWithEdgeCache(table, query, cacheKey, ttl);
  }

  getSupabaseClient() {
    return this.supabase;
  }
}

// Image optimization utilities
export class ImageOptimizer {
  private static instance: ImageOptimizer;
  private cdnBaseUrl: string;

  static getInstance(): ImageOptimizer {
    if (!ImageOptimizer.instance) {
      ImageOptimizer.instance = new ImageOptimizer();
    }
    return ImageOptimizer.instance;
  }

  constructor() {
    // Use Next.js Image Optimization API or your CDN
    this.cdnBaseUrl = process.env.NEXT_PUBLIC_CDN_URL || '/_next/image';
  }

  // Generate optimized image URL
  getOptimizedImageUrl(
    src: string,
    width: number,
    height: number,
    quality: number = 85,
    format: 'webp' | 'avif' | 'auto' = 'auto'
  ): string {
    // If it's already a data URL or external URL, return as is
    if (src.startsWith('data:') || src.startsWith('http')) {
      return src;
    }

    // Use Next.js Image Optimization API
    const params = new URLSearchParams({
      url: src,
      w: width.toString(),
      h: height.toString(),
      q: quality.toString(),
      f: format === 'auto' ? 'webp' : format,
    });

    return `${this.cdnBaseUrl}?${params.toString()}`;
  }

  // Generate responsive image srcset
  getResponsiveSrcSet(
    src: string,
    sizes: number[],
    quality: number = 85,
    format: 'webp' | 'avif' | 'auto' = 'auto'
  ): string {
    return sizes
      .map(size => {
        const url = this.getOptimizedImageUrl(src, size, size, quality, format);
        return `${url} ${size}w`;
      })
      .join(', ');
  }

  // Preload critical images
  preloadImages(urls: string[]): void {
    if (typeof window === 'undefined') return;

    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }
}

// Asset optimization
export class AssetOptimizer {
  private static instance: AssetOptimizer;

  static getInstance(): AssetOptimizer {
    if (!AssetOptimizer.instance) {
      AssetOptimizer.instance = new AssetOptimizer();
    }
    return AssetOptimizer.instance;
  }

  // Preload critical CSS
  preloadCriticalCSS(href: string): void {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  }

  // Preload critical JavaScript
  preloadCriticalJS(href: string): void {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = href;
    document.head.appendChild(link);
  }

  // Preload fonts
  preloadFonts(fonts: { href: string; type: string }[]): void {
    if (typeof window === 'undefined') return;

    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = font.href;
      link.type = font.type;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
}

// Export instances
export const cdnClient = CDNOptimizedClient.getInstance();
export const imageOptimizer = ImageOptimizer.getInstance();
export const assetOptimizer = AssetOptimizer.getInstance();
