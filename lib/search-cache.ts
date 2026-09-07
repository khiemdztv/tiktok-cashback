type CacheEntry = {
  value: unknown;
  expiresAt: number;
};

export class LruTtlCache {
  private readonly entries = new Map<string, CacheEntry>();

  constructor(private readonly maxEntries: number) {}

  get<T>(key: string): T | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;

    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return undefined;
    }

    // Re-inserting the entry marks it as most recently used.
    this.entries.delete(key);
    this.entries.set(key, entry);
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number) {
    this.deleteExpired();
    this.entries.delete(key);
    this.entries.set(key, { value, expiresAt: Date.now() + ttlMs });

    while (this.entries.size > this.maxEntries) {
      const oldestKey = this.entries.keys().next().value as string | undefined;
      if (!oldestKey) break;
      this.entries.delete(oldestKey);
    }
  }

  private deleteExpired() {
    const now = Date.now();
    this.entries.forEach((entry, key) => {
      if (entry.expiresAt <= now) this.entries.delete(key);
    });
  }
}

const globalCache = globalThis as typeof globalThis & {
  __cashbackSearchCache?: LruTtlCache;
  __cashbackAnalysisCache?: LruTtlCache;
};

export const searchCache =
  globalCache.__cashbackSearchCache ??
  (globalCache.__cashbackSearchCache = new LruTtlCache(500));

export const analysisCache =
  globalCache.__cashbackAnalysisCache ??
  (globalCache.__cashbackAnalysisCache = new LruTtlCache(500));

export const SEARCH_CACHE_TTL_MS = 2 * 60 * 60 * 1000;
export const ANALYSIS_CACHE_TTL_MS = 4 * 60 * 60 * 1000;
