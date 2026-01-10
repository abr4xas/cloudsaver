/**
 * Centralized error handling utilities
 */

import { formatErrorForResponse, CloudSaverError } from "./errors";

/**
 * Log error with context
 */
export function logError(
  error: unknown,
  context?: {
    component?: string;
    action?: string;
    metadata?: Record<string, unknown>;
  }
): void {
  const errorInfo = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...context?.metadata,
  };

  if (process.env.NODE_ENV === "development") {
    console.error(`[${context?.component || "Error"}]`, errorInfo);
  }

  // In production, send to error tracking service
  // Example: Sentry.captureException(error, { extra: errorInfo });
}

/**
 * Handle API route errors
 */
export function handleApiError(error: unknown): Response {
  const formatted = formatErrorForResponse(error);
  logError(error, { action: "api_error" });

  return new Response(JSON.stringify(formatted), {
    status: formatted.statusCode,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Safe async handler wrapper for API routes
 */
export function withErrorHandling<T extends unknown[]>(
  handler: (...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
