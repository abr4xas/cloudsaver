/**
 * Client-side caching using localStorage
 * Useful for caching non-sensitive data like pricing, sizes, etc.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Cache keys
 */
export const CLIENT_CACHE_KEYS = {
  PRICING: "cloudsaver_cache_pricing",
  SIZES: "cloudsaver_cache_sizes",
  CONFIG: "cloudsaver_cache_config",
} as const;

/**
 * Default TTL (time to live) in milliseconds
 */
export const CLIENT_CACHE_TTL = {
  PRICING: 24 * 60 * 60 * 1000, // 24 hours
  SIZES: 24 * 60 * 60 * 1000, // 24 hours
  CONFIG: 60 * 60 * 1000, // 1 hour
} as const;

/**
 * Get cached value from localStorage
 */
export function getClientCache<T>(key: string): T | null {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return null;

    const entry = JSON.parse(stored) as CacheEntry<T>;
    const now = Date.now();

    // Check if expired
    if (now > entry.expiresAt) {
      window.localStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch {
    // Invalid data, clear it
    window.localStorage.removeItem(key);
    return null;
  }
}

/**
 * Set cache value in localStorage
 */
export function setClientCache<T>(
  key: string,
  data: T,
  ttlMs: number = CLIENT_CACHE_TTL.PRICING
): void {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  try {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttlMs,
    };

    window.localStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    // localStorage might be full or disabled, ignore
    console.warn(`Failed to save cache to localStorage (key: ${key}):`, error);
  }
}

/**
 * Delete cache entry
 */
export function deleteClientCache(key: string): void {
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.removeItem(key);
  }
}

/**
 * Clear all CloudSaver cache entries
 */
export function clearAllClientCache(): void {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  try {
    const keys = Object.keys(window.localStorage);
    keys.forEach((key) => {
      if (key.startsWith("cloudsaver_")) {
        window.localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn("Failed to clear cache:", error);
  }
}

/**
 * Get cache entry with metadata (useful for debugging)
 */
export function getClientCacheMetadata<T>(key: string): {
  data: T | null;
  timestamp: number | null;
  expiresAt: number | null;
  isExpired: boolean;
  ageMs: number | null;
} {
  if (typeof window === "undefined" || !window.localStorage) {
    return {
      data: null,
      timestamp: null,
      expiresAt: null,
      isExpired: true,
      ageMs: null,
    };
  }

  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      return {
        data: null,
        timestamp: null,
        expiresAt: null,
        isExpired: true,
        ageMs: null,
      };
    }

    const entry = JSON.parse(stored) as CacheEntry<T>;
    const now = Date.now();
    const isExpired = now > entry.expiresAt;

    if (isExpired) {
      window.localStorage.removeItem(key);
    }

    return {
      data: isExpired ? null : entry.data,
      timestamp: entry.timestamp,
      expiresAt: entry.expiresAt,
      isExpired,
      ageMs: now - entry.timestamp,
    };
  } catch {
    window.localStorage.removeItem(key);
    return {
      data: null,
      timestamp: null,
      expiresAt: null,
      isExpired: true,
      ageMs: null,
    };
  }
}

/**
 * Check if localStorage is available and has space
 */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }

  try {
    const test = "__cloudsaver_test__";
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
