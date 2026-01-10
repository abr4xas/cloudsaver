/**
 * Server-side rate limiting (backup/fallback)
 * Primary rate limiting is done client-side using localStorage
 * This serves as a backup for server-side validation
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if request is allowed
   */
  isAllowed(identifier: string): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    // No entry or expired window
    if (!entry || now > entry.resetAt) {
      this.limits.set(identifier, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetAt: now + this.windowMs,
      };
    }

    // Check if limit exceeded
    if (entry.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt,
      };
    }

    // Increment count
    entry.count++;
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
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetAt) {
        this.limits.delete(key);
      }
    }
  }
}

// Singleton instance - Very permissive server-side rate limit (backup only)
// Primary rate limiting is done client-side with localStorage
// This is just a safety net for server-side validation
const rateLimiter = new RateLimiter(
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10), // Much higher limit
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10)
);

// Clean expired entries every minute
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    rateLimiter.cleanExpired();
  }, 60 * 1000);
}

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
