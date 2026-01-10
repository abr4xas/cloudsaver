/**
 * Custom error classes for better error handling
 */

export class CloudSaverError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends CloudSaverError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

export class AuthenticationError extends CloudSaverError {
  constructor(message: string = "Authentication failed", details?: Record<string, unknown>) {
    super(message, "AUTH_ERROR", 401, details);
  }
}

export class RateLimitError extends CloudSaverError {
  constructor(
    message: string = "Rate limit exceeded",
    public retryAfter?: number,
    details?: Record<string, unknown>
  ) {
    super(message, "RATE_LIMIT_ERROR", 429, details);
  }
}

export class ApiError extends CloudSaverError {
  constructor(
    message: string,
    public statusCode: number = 500,
    code?: string,
    details?: Record<string, unknown>
  ) {
    super(message, code || "API_ERROR", statusCode, details);
  }
}

export class DigitalOceanApiError extends CloudSaverError {
  constructor(
    message: string,
    public statusCode: number = 500,
    code?: string,
    details?: Record<string, unknown>
  ) {
    super(message, code || "DO_API_ERROR", statusCode, details);
  }
}

/**
 * Format error for API response
 */
export function formatErrorForResponse(error: unknown): {
  error: string;
  code?: string;
  statusCode: number;
  details?: Record<string, unknown>;
} {
  if (error instanceof CloudSaverError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode || 500,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      error: error.message || "An unexpected error occurred",
      statusCode: 500,
    };
  }

  return {
    error: "An unexpected error occurred",
    statusCode: 500,
  };
}

/**
 * Check if error is a known error type
 */
export function isKnownError(error: unknown): error is CloudSaverError {
  return error instanceof CloudSaverError;
}
