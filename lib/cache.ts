/**
 * Caching utilities for API responses and computed data
 * Implements LRU (Least Recently Used) cache with size limit and TTL
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * LRU Cache implementation with size limit and TTL support
 */
class LRUCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private readonly maxSize: number;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
    this.startCleanup();
  }

  /**
   * Get cached value if not expired
   * Moves the entry to the end (most recently used)
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

    // Move to end (most recently used) - LRU behavior
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.data;
  }

  /**
   * Set cache value with TTL
   * If cache is full, removes least recently used entry
   */
  set<T>(key: string, data: T, ttlMs: number): void {
    const now = Date.now();

    // If key exists, remove it first to update position
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // If cache is full, remove least recently used (first entry)
    else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

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
   * Get current cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key);
    }
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startCleanup(): void {
    if (typeof setInterval !== "undefined") {
      // Clean every 2 minutes (more aggressive than before)
      this.cleanupInterval = setInterval(() => {
        this.cleanExpired();
      }, 2 * 60 * 1000);
    }
  }

  /**
   * Stop cleanup interval (useful for testing or cleanup)
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Singleton instance with max size of 1000 entries
const memoryCache = new LRUCache(1000);

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
 * Uses crypto.subtle for secure hashing with fewer collisions
 */
export async function hashToken(token: string): Promise<string> {
  // Use crypto.subtle for better hashing (available in Node.js and browsers)
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(token);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      // Return first 16 characters for shorter keys (still very unique)
      return hashHex.substring(0, 16);
    } catch (error) {
      // Fallback to simple hash if crypto.subtle fails
      console.warn('crypto.subtle not available, using fallback hash', error);
    }
  }

  // Fallback: Simple hash function for environments without crypto.subtle
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    const char = token.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Synchronous version of hashToken (for backwards compatibility)
 * Uses simple hash function
 */
export function hashTokenSync(token: string): string {
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
