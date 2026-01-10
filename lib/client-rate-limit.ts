/**
 * Client-side rate limiting using localStorage
 * Prevents excessive API calls from the browser
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const STORAGE_KEY = "cloudsaver_rate_limit";
const DEFAULT_MAX_REQUESTS = 10;
const DEFAULT_WINDOW_MS = 60000; // 1 minute

/**
 * Get rate limit configuration from environment or defaults
 */
function getRateLimitConfig(): { maxRequests: number; windowMs: number } {
  // In browser, we can't access process.env directly, so use defaults
  // These could be passed from the server via a config endpoint if needed
  return {
    maxRequests: DEFAULT_MAX_REQUESTS,
    windowMs: DEFAULT_WINDOW_MS,
  };
}

/**
 * Get rate limit entry from localStorage
 */
function getRateLimitEntry(): RateLimitEntry | null {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const entry = JSON.parse(stored) as RateLimitEntry;
    const now = Date.now();

    // Check if expired
    if (now > entry.resetAt) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return entry;
  } catch {
    // Invalid data, clear it
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

/**
 * Set rate limit entry in localStorage
 */
function setRateLimitEntry(entry: RateLimitEntry): void {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  } catch (error) {
    // localStorage might be full or disabled, ignore
    console.warn("Failed to save rate limit to localStorage:", error);
  }
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
