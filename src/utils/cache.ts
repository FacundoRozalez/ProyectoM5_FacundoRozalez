export class MemoryCache {
  private store = new Map<string, { data: any; expiry: number }>();

  set(key: string, data: any, ttl = 300000): void {
    this.store.set(key, { data, expiry: Date.now() + ttl });
  }

  get(key: string): any | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }
    return entry.data;
  }
}

export const memoryCache = new MemoryCache();