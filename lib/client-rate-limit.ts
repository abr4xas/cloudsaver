/**
 * Client-side rate limiting using localStorage
 * Prevents excessive API calls from the browser
 */

import { RATE_LIMIT_CONFIG } from '@/lib/config/rate-limit';
import {
  getLocalStorageJSON,
  setLocalStorageJSON,
  removeLocalStorageItem,
} from '@/lib/utils/storage';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const STORAGE_KEY = "cloudsaver_rate_limit";

/**
 * Get rate limit configuration from environment or defaults
 */
function getRateLimitConfig(): { maxRequests: number; windowMs: number } {
  // In browser, we can't access process.env directly, so use client defaults
  return {
    maxRequests: RATE_LIMIT_CONFIG.CLIENT_MAX_REQUESTS,
    windowMs: RATE_LIMIT_CONFIG.WINDOW_MS,
  };
}

/**
 * Get rate limit entry from localStorage
 */
function getRateLimitEntry(): RateLimitEntry | null {
  const entry = getLocalStorageJSON<RateLimitEntry>(STORAGE_KEY);
  if (!entry) return null;

  const now = Date.now();

  // Check if expired
  if (now > entry.resetAt) {
    removeLocalStorageItem(STORAGE_KEY);
    return null;
  }

  return entry;
}

/**
 * Set rate limit entry in localStorage
 */
function setRateLimitEntry(entry: RateLimitEntry): void {
  setLocalStorageJSON(STORAGE_KEY, entry);
}

/**
 * Check if request is allowed (client-side)
 */
export function checkClientRateLimit(): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const config = getRateLimitConfig();
  const now = Date.now();
  const entry = getRateLimitEntry();

  // No entry or expired
  if (!entry) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    setRateLimitEntry(newEntry);
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: newEntry.resetAt,
    };
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Increment count
  entry.count++;
  setRateLimitEntry(entry);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Reset rate limit (useful for testing or manual reset)
 */
export function resetClientRateLimit(): void {
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Get remaining requests and reset time
 */
export function getClientRateLimitStatus(): {
  remaining: number;
  resetAt: number;
  resetInSeconds: number;
} {
  const config = getRateLimitConfig();
  const entry = getRateLimitEntry();

  if (!entry) {
    return {
      remaining: config.maxRequests,
      resetAt: Date.now() + config.windowMs,
      resetInSeconds: Math.ceil(config.windowMs / 1000),
    };
  }

  const remaining = Math.max(0, config.maxRequests - entry.count);
  const resetInSeconds = Math.max(0, Math.ceil((entry.resetAt - Date.now()) / 1000));

  return {
    remaining,
    resetAt: entry.resetAt,
    resetInSeconds,
  };
}
