/**
 * Generic LRU (Least Recently Used) cache with TTL support
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface LRUCacheOptions {
  maxSize: number;
  cleanupIntervalMs?: number;
}

/**
 * Generic LRU Cache implementation with size limit and TTL support
 */
export class LRUCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private readonly maxSize: number;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor({ maxSize, cleanupIntervalMs = 2 * 60 * 1000 }: LRUCacheOptions) {
    this.maxSize = maxSize;
    if (cleanupIntervalMs > 0) {
      this.startCleanup(cleanupIntervalMs);
    }
  }

  /**
   * Get cached value if not expired
   * Moves the entry to the end (most recently used)
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

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
  set(key: string, data: T, ttlMs: number): void {
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
  private startCleanup(intervalMs: number): void {
    if (typeof setInterval !== "undefined") {
      this.cleanupInterval = setInterval(() => {
        this.cleanExpired();
      }, intervalMs);
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
