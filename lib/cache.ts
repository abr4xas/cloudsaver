/**
 * Caching utilities for API responses and computed data
 * Implements LRU (Least Recently Used) cache with size limit and TTL
 */

import { LRUCache } from '@/lib/utils/lru-cache';

// Singleton instance with max size of 1000 entries
const memoryCache = new LRUCache<unknown>({ maxSize: 1000, cleanupIntervalMs: 2 * 60 * 1000 });

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
	return memoryCache.get(key) as T | null;
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
 * Uses Node.js crypto for secure hashing with fewer collisions
 */
export function hashToken(token: string): string {
	// Use Node.js crypto module for better hashing (server-side)
	if (typeof process !== 'undefined' && process.versions?.node) {
		try {
			// Use Node.js built-in crypto module
			// eslint-disable-next-line @typescript-eslint/no-require-imports
			const crypto = require('crypto');
			const hash = crypto.createHash('sha256').update(token).digest('hex');
			// Return first 16 characters for shorter keys (still very unique)
			return hash.substring(0, 16);
		} catch (error) {
			// Fallback to simple hash if crypto fails
			console.warn('Node.js crypto not available, using fallback hash', error);
		}
	}

	// Fallback: Simple hash function for environments without crypto
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
