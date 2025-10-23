// Global request deduplication utility
class RequestDeduplicator {
  private static instance: RequestDeduplicator;
  private activeRequests: Map<string, Promise<any>> = new Map();
  private requestCounts: Map<string, number> = new Map();

  static getInstance(): RequestDeduplicator {
    if (!RequestDeduplicator.instance) {
      RequestDeduplicator.instance = new RequestDeduplicator();
    }
    return RequestDeduplicator.instance;
  }

  async deduplicate<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    // If request is already active, return the same promise
    if (this.activeRequests.has(key)) {
      const currentCount = this.requestCounts.get(key) || 0;
      this.requestCounts.set(key, currentCount + 1);
      console.log(`🔄 Deduplicating request for ${key} (${currentCount + 1} total calls)`);
      return this.activeRequests.get(key)!;
    }

    // Create new request
    console.log(`🆕 Starting new request for ${key}`);
    this.requestCounts.set(key, 1);
    
    const promise = fetcher().finally(() => {
      // Clean up when request completes
      this.activeRequests.delete(key);
      this.requestCounts.delete(key);
    });

    this.activeRequests.set(key, promise);
    return promise;
  }

  getStats() {
    return {
      activeRequests: this.activeRequests.size,
      requestCounts: Object.fromEntries(this.requestCounts.entries())
    };
  }

  clear() {
    this.activeRequests.clear();
    this.requestCounts.clear();
  }
}

export const requestDeduplicator = RequestDeduplicator.getInstance();
