// Global cache to prevent duplicate API calls
class GlobalCache {
  private static instance: GlobalCache;
  private cache: Map<string, { data: any; timestamp: number; promise?: Promise<any> }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): GlobalCache {
    if (!GlobalCache.instance) {
      GlobalCache.instance = new GlobalCache();
    }
    return GlobalCache.instance;
  }

  async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const cached = this.cache.get(key);

    // Return cached data if it's still valid
    if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
      console.log(`🎯 Cache HIT for ${key}`);
      return cached.data;
    }

    // If there's already a pending request, wait for it
    if (cached?.promise) {
      console.log(`⏳ Waiting for pending request for ${key}`);
      return await cached.promise;
    }

    // Create new request
    console.log(`🔄 Cache MISS for ${key}, fetching...`);
    const promise = fetcher();
    
    // Store the promise immediately to prevent duplicate requests
    this.cache.set(key, {
      data: null,
      timestamp: now,
      promise
    });

    try {
      const data = await promise;
      // Update cache with actual data
      this.cache.set(key, {
        data,
        timestamp: now
      });
      console.log(`✅ Cache UPDATED for ${key}`);
      return data;
    } catch (error) {
      // Remove failed request from cache
      this.cache.delete(key);
      throw error;
    }
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

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const globalCache = GlobalCache.getInstance();
