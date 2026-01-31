/**
 * Server-side rate limiting (backup/fallback)
 * Primary rate limiting is done client-side using localStorage
 * This serves as a backup for server-side validation
 * Uses LRU cache to limit memory usage
 */

import { RATE_LIMIT_CONFIG, getRateLimitConfigFromEnv } from '@/lib/config/rate-limit';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * LRU-based Rate Limiter with size limit
 */
class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly maxEntries: number;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(maxRequests: number = 10, windowMs: number = 60000, maxEntries: number = 10000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.maxEntries = maxEntries;
    this.startCleanup();
  }

  /**
   * Check if request is allowed
   * Uses LRU: moves entry to end when accessed
   */
  isAllowed(identifier: string): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    // No entry or expired window
    if (!entry || now > entry.resetAt) {
      // If cache is full, remove least recently used (first entry)
      if (this.limits.size >= this.maxEntries && !this.limits.has(identifier)) {
        const firstKey = this.limits.keys().next().value;
        if (firstKey) {
          this.limits.delete(firstKey);
        }
      }

      const newEntry = {
        count: 1,
        resetAt: now + this.windowMs,
      };
      this.limits.set(identifier, newEntry);
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetAt: newEntry.resetAt,
      };
    }

    // Check if limit exceeded
    if (entry.count >= this.maxRequests) {
      // Move to end (most recently accessed)
      this.limits.delete(identifier);
      this.limits.set(identifier, entry);
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt,
      };
    }

    // Increment count and move to end (most recently accessed)
    entry.count++;
    this.limits.delete(identifier);
    this.limits.set(identifier, entry);
    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetAt: entry.resetAt,
    };
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetAt) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.limits.delete(key);
    }
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startCleanup(): void {
    if (typeof setInterval !== "undefined") {
      // Clean every minute
      this.cleanupInterval = setInterval(() => {
        this.cleanExpired();
      }, 60 * 1000);
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

  /**
   * Get current number of entries
   */
  size(): number {
    return this.limits.size;
  }
}

// Singleton instance - Very permissive server-side rate limit (backup only)
// Primary rate limiting is done client-side with localStorage
// This is just a safety net for server-side validation
// Max entries to prevent memory issues
const envConfig = getRateLimitConfigFromEnv();
const rateLimiter = new RateLimiter(
  envConfig.maxRequests,
  envConfig.windowMs,
  RATE_LIMIT_CONFIG.SERVER_MAX_ENTRIES
);

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from headers (works with Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || realIp || "unknown";

  return ip;
}

/**
 * Check rate limit for request
 */
export function checkRateLimit(
  identifier: string,
  maxRequests?: number,
  windowMs?: number
): { allowed: boolean; remaining: number; resetAt: number } {
  if (maxRequests && windowMs) {
    const limiter = new RateLimiter(maxRequests, windowMs);
    return limiter.isAllowed(identifier);
  }

  return rateLimiter.isAllowed(identifier);
}

/**
 * Rate limit middleware for API routes (backup only)
 * Primary rate limiting is done client-side with localStorage
 * This is just a safety net with very high limits
 */
export function withRateLimit(
  handler: (request: Request) => Promise<Response>,
  options?: { maxRequests?: number; windowMs?: number }
) {
  return async (request: Request): Promise<Response> => {
    const identifier = getClientIdentifier(request);
    const result = checkRateLimit(
      identifier,
      options?.maxRequests,
      options?.windowMs
    );

    // Only enforce if limit is truly exceeded (very high limit as backup)
    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please wait before trying again.",
          code: "RATE_LIMIT_ERROR",
          retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": String(options?.maxRequests || 100),
            "X-RateLimit-Remaining": String(result.remaining),
            "X-RateLimit-Reset": String(result.resetAt),
            "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    // Add rate limit headers to response (informational)
    const response = await handler(request);
    const headers = new Headers(response.headers);
    headers.set("X-RateLimit-Limit", String(options?.maxRequests || 100));
    headers.set("X-RateLimit-Remaining", String(result.remaining));
    headers.set("X-RateLimit-Reset", String(result.resetAt));

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}
