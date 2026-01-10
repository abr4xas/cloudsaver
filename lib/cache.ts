/**
 * Caching utilities for API responses and computed data
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();

  /**
   * Get cached value if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cache value with TTL
   */
  set<T>(key: string, data: T, ttlMs: number): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttlMs,
    });
  }

  /**
   * Delete cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton instance
const memoryCache = new MemoryCache();

// Clean expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    memoryCache.cleanExpired();
  }, 5 * 60 * 1000);
}

/**
 * Cache keys
 */
export const CACHE_KEYS = {
  pricing: (region?: string) => `pricing:${region || "all"}`,
  analysis: (tokenHash: string) => `analysis:${tokenHash}`,
  sizes: "sizes:all",
} as const;

/**
 * Cache TTL constants (in milliseconds)
 */
export const CACHE_TTL = {
  PRICING: 24 * 60 * 60 * 1000, // 24 hours (pricing changes rarely)
  SIZES: 24 * 60 * 60 * 1000, // 24 hours
  ANALYSIS: 0, // No cache for analysis (user-specific, sensitive data)
} as const;

/**
 * Get cached value
 */
export function getCache<T>(key: string): T | null {
  return memoryCache.get<T>(key);
}

/**
 * Set cache value
 */
export function setCache<T>(key: string, data: T, ttlMs: number = CACHE_TTL.PRICING): void {
  memoryCache.set(key, data, ttlMs);
}

/**
 * Delete cache entry
 */
export function deleteCache(key: string): void {
  memoryCache.delete(key);
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  memoryCache.clear();
}

/**
 * Generate cache key from token (hash for privacy)
 */
export function hashToken(token: string): string {
  // Simple hash function (in production, use crypto.subtle)
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    const char = token.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Next.js cache configuration helpers
 */
export const nextCacheConfig = {
  /**
   * Revalidate after time (ISR)
   */
  revalidate: (seconds: number) => ({
    next: {
      revalidate: seconds,
    },
  }),

  /**
   * No cache
   */
  noCache: {
    cache: "no-store" as const,
  },

  /**
   * Cache with revalidation
   */
  staleWhileRevalidate: (seconds: number) => ({
    next: {
      revalidate: seconds,
    },
  }),
} as const;
