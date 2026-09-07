type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

const WINDOW_MS = 24 * 60 * 60 * 1000;

class SlidingWindowRateLimiter {
  private readonly requests = new Map<string, number[]>();

  consume(key: string, limit: number): RateLimitResult {
    const now = Date.now();
    const windowStart = now - WINDOW_MS;
    const active = (this.requests.get(key) ?? []).filter((timestamp) => timestamp > windowStart);

    if (active.length >= limit) {
      this.requests.set(key, active);
      return {
        allowed: false,
        limit,
        remaining: 0,
        resetAt: active[0] + WINDOW_MS,
      };
    }

    active.push(now);
    this.requests.set(key, active);
    return {
      allowed: true,
      limit,
      remaining: Math.max(limit - active.length, 0),
      resetAt: active[0] + WINDOW_MS,
    };
  }
}

const globalRateLimiter = globalThis as typeof globalThis & {
  __cashbackRateLimiter?: SlidingWindowRateLimiter;
};

const limiter =
  globalRateLimiter.__cashbackRateLimiter ??
  (globalRateLimiter.__cashbackRateLimiter = new SlidingWindowRateLimiter());

function configuredLimit() {
  const parsed = Number.parseInt(process.env.SEARCH_RATE_LIMIT_PER_DAY ?? "30", 10);
  return Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), 1_000) : 30;
}

export function consumeRateLimit(identifier: string) {
  return limiter.consume(identifier || "unknown", configuredLimit());
}

export function rateLimitHeaders(result: RateLimitResult) {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
}
