// Network optimization strategies for high-latency connections
import { globalCache } from '../cache/globalCache';

// Extended cache duration for high-latency connections
const EXTENDED_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for better performance
const CATEGORIES_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes for categories (rarely change)
const PRODUCTS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes for products (more dynamic)

// Request batching for multiple simultaneous requests
class RequestBatcher {
  private static instance: RequestBatcher;
  private pendingRequests: Map<string, Promise<any>> = new Map();
  private requestCounts: Map<string, number> = new Map();

  static getInstance(): RequestBatcher {
    if (!RequestBatcher.instance) {
      RequestBatcher.instance = new RequestBatcher();
    }
    return RequestBatcher.instance;
  }

  async batchRequest<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    // Track how many requests are made for this key
    const currentCount = this.requestCounts.get(key) || 0;
    this.requestCounts.set(key, currentCount + 1);

    // If request is already pending, return the same promise
    if (this.pendingRequests.has(key)) {
      console.log(`🔄 Batching request for ${key} - using pending request (${currentCount + 1} total requests)`);
      return this.pendingRequests.get(key)!;
    }

    // Create new request
    console.log(`🔄 Starting new request for ${key} (${currentCount + 1} total requests)`);
    const promise = fetcher();
    this.pendingRequests.set(key, promise);

    try {
      const result = await promise;
      this.pendingRequests.delete(key);
      this.requestCounts.delete(key);
      console.log(`✅ Request completed for ${key} - served ${currentCount + 1} batched requests`);
      return result;
    } catch (error) {
      this.pendingRequests.delete(key);
      this.requestCounts.delete(key);
      throw error;
    }
  }

  getStats() {
    return {
      pendingRequests: this.pendingRequests.size,
      requestCounts: Object.fromEntries(this.requestCounts.entries())
    };
  }
}

// Prefetch strategy for critical data
class DataPrefetcher {
  private static instance: DataPrefetcher;
  private prefetchedKeys = new Set<string>();

  static getInstance(): DataPrefetcher {
    if (!DataPrefetcher.instance) {
      DataPrefetcher.instance = new DataPrefetcher();
    }
    return DataPrefetcher.instance;
  }

  async prefetchCriticalData() {
    const criticalKeys = ['categories', 'products', 'search-products'];
    
    for (const key of criticalKeys) {
      if (!this.prefetchedKeys.has(key)) {
        try {
          console.log(`🚀 Prefetching ${key}...`);
          await globalCache.get(key, async () => {
            // This will be implemented by the actual services
            throw new Error('Prefetch not implemented for ' + key);
          });
          this.prefetchedKeys.add(key);
        } catch (error) {
          // Ignore prefetch errors
          console.log(`⚠️ Prefetch failed for ${key}:`, error.message);
        }
      }
    }
  }
}

// Connection quality monitor
class ConnectionMonitor {
  private static instance: ConnectionMonitor;
  private responseTimes: number[] = [];
  private readonly MAX_SAMPLES = 10;

  static getInstance(): ConnectionMonitor {
    if (!ConnectionMonitor.instance) {
      ConnectionMonitor.instance = new ConnectionMonitor();
    }
    return ConnectionMonitor.instance;
  }

  recordResponseTime(time: number) {
    this.responseTimes.push(time);
    if (this.responseTimes.length > this.MAX_SAMPLES) {
      this.responseTimes.shift();
    }
  }

  getAverageResponseTime(): number {
    if (this.responseTimes.length === 0) return 0;
    return this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
  }

  isHighLatency(): boolean {
    return this.getAverageResponseTime() > 150;
  }

  getOptimizationStrategy(): 'aggressive' | 'moderate' | 'minimal' {
    const avgTime = this.getAverageResponseTime();
    if (avgTime > 200) return 'aggressive';
    if (avgTime > 100) return 'moderate';
    return 'minimal';
  }
}

// Optimized cache configuration based on connection quality
export function getOptimizedCacheConfig() {
  const monitor = ConnectionMonitor.getInstance();
  const strategy = monitor.getOptimizationStrategy();

  switch (strategy) {
    case 'aggressive':
      return {
        dedupingInterval: 5 * 60 * 1000, // 5 minutes
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 0,
        errorRetryCount: 5,
        errorRetryInterval: 2000,
      };
    case 'moderate':
      return {
        dedupingInterval: 2 * 60 * 1000, // 2 minutes
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        refreshInterval: 0,
        errorRetryCount: 3,
        errorRetryInterval: 1000,
      };
    default:
      return {
        dedupingInterval: 1 * 60 * 1000, // 1 minute
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 0,
        errorRetryCount: 3,
        errorRetryInterval: 500,
      };
  }
}

// Enhanced global cache with network optimization
export class NetworkOptimizedCache {
  private static instance: NetworkOptimizedCache;
  private cache: Map<string, { data: any; timestamp: number; promise?: Promise<any> }> = new Map();
  private readonly CACHE_DURATION = EXTENDED_CACHE_DURATION;
  private requestBatcher = RequestBatcher.getInstance();
  private connectionMonitor = ConnectionMonitor.getInstance();

  static getInstance(): NetworkOptimizedCache {
    if (!NetworkOptimizedCache.instance) {
      NetworkOptimizedCache.instance = new NetworkOptimizedCache();
    }
    return NetworkOptimizedCache.instance;
  }

  private getCacheDuration(key: string): number {
    if (key.includes('categories')) return CATEGORIES_CACHE_DURATION;
    if (key.includes('products')) return PRODUCTS_CACHE_DURATION;
    return this.CACHE_DURATION;
  }

  async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const cached = this.cache.get(key);
    const cacheDuration = this.getCacheDuration(key);

    // Return cached data if it's still valid
    if (cached && (now - cached.timestamp) < cacheDuration) {
      console.log(`🎯 Cache HIT for ${key} (${Math.round((cacheDuration - (now - cached.timestamp)) / 1000)}s remaining)`);
      return cached.data;
    }

    // Use request batching to prevent duplicate requests
    return await this.requestBatcher.batchRequest(key, async () => {
      console.log(`🔄 Cache MISS for ${key}, fetching with network optimization...`);
      const startTime = Date.now();
      
      try {
        const data = await fetcher();
        const responseTime = Date.now() - startTime;
        
        // Record response time for monitoring
        this.connectionMonitor.recordResponseTime(responseTime);
        
        // Update cache with actual data
        this.cache.set(key, {
          data,
          timestamp: now
        });
        
        console.log(`✅ Cache UPDATED for ${key} (${responseTime}ms)`);
        return data;
      } catch (error) {
        // Remove failed request from cache
        this.cache.delete(key);
        throw error;
      }
    });
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
      console.log(`🗑️ Cache cleared for ${key}`);
    } else {
      this.cache.clear();
      console.log(`🗑️ All cache cleared`);
    }
  }

  getStats(): { size: number; keys: string[]; avgResponseTime: number; strategy: string } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      avgResponseTime: this.connectionMonitor.getAverageResponseTime(),
      strategy: this.connectionMonitor.getOptimizationStrategy()
    };
  }
}

export const networkOptimizedCache = NetworkOptimizedCache.getInstance();
export const requestBatcher = RequestBatcher.getInstance();
export const dataPrefetcher = DataPrefetcher.getInstance();
export const connectionMonitor = ConnectionMonitor.getInstance();
