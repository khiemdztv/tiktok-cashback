type CacheEntry = { expiresAt: number; value: unknown };

const globalCache = globalThis as typeof globalThis & {
  shopeeVoucherCache?: Map<string, CacheEntry>;
};

const cache = globalCache.shopeeVoucherCache ?? new Map<string, CacheEntry>();
globalCache.shopeeVoucherCache = cache;

export function getVoucherCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }
  return entry.value as T;
}

export function setVoucherCache(key: string, value: unknown, ttlMs = 5 * 60 * 1000) {
  if (cache.size > 100) cache.clear();
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function invalidateVoucherCache() {
  cache.clear();
}
