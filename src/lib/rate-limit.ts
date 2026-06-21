const LIMIT_WINDOW_MS = 60_000;
const LIMIT_REQUESTS = 20;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const entries = new Map<string, RateLimitEntry>();

function pruneExpired(now: number) {
  for (const [key, entry] of entries.entries()) {
    if (entry.resetAt <= now) {
      entries.delete(key);
    }
  }
}

export function checkRateLimit(identifier: string, routeKey = 'default') {
  const now = Date.now();
  pruneExpired(now);

  const normalizedIdentifier = identifier.trim().toLowerCase() || 'unknown';
  const bucketKey = `${routeKey}:${normalizedIdentifier}`;
  const existing = entries.get(bucketKey);

  if (!existing) {
    const nextEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + LIMIT_WINDOW_MS,
    };
    entries.set(bucketKey, nextEntry);
    return { allowed: true, remaining: LIMIT_REQUESTS - 1 };
  }

  if (existing.count >= LIMIT_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(existing.resetAt - now, 0),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(LIMIT_REQUESTS - existing.count, 0),
  };
}
