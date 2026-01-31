/**
 * Shared rate limit configuration
 */

export const RATE_LIMIT_CONFIG = {
  /** Maximum requests per window for client-side */
  CLIENT_MAX_REQUESTS: 10,
  /** Maximum requests per window for server-side */
  SERVER_MAX_REQUESTS: 100,
  /** Time window in milliseconds (60 seconds) */
  WINDOW_MS: 60000,
  /** Maximum entries in server-side rate limit cache */
  SERVER_MAX_ENTRIES: 10000,
  /** Cleanup interval for server-side rate limit cache */
  CLEANUP_INTERVAL_MS: 60000,
} as const;

/**
 * Get rate limit configuration from environment variables
 * Falls back to defaults if not set
 */
export function getRateLimitConfigFromEnv(): {
  maxRequests: number;
  windowMs: number;
} {
  const maxRequests = process.env.RATE_LIMIT_MAX_REQUESTS
    ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10)
    : RATE_LIMIT_CONFIG.SERVER_MAX_REQUESTS;

  const windowMs = process.env.RATE_LIMIT_WINDOW_MS
    ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10)
    : RATE_LIMIT_CONFIG.WINDOW_MS;

  return { maxRequests, windowMs };
}
