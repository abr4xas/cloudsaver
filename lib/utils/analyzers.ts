/**
 * Analyzer helper utilities
 */

import type { ConfidenceLevel } from "@/lib/recommendations/types";

/**
 * Calculate confidence level based on a score
 * @param score - Confidence score (0-1)
 * @returns ConfidenceLevel
 */
export function calculateConfidence(score: number): ConfidenceLevel {
  if (score >= 0.9) return "High";
  if (score >= 0.7) return "Medium";
  return "Low";
}

/**
 * Normalize resource ID to string
 * @param id - Resource ID (number, string, or unknown)
 * @returns String ID
 */
export function normalizeResourceId(id: unknown): string {
  if (typeof id === "string") return id;
  if (typeof id === "number") return id.toString();
  return String(id);
}

/**
 * Check if value is a valid number
 * @param value - Value to check
 * @returns true if valid numeric value
 */
export function isValidNumeric(value: unknown): boolean {
  if (typeof value === "number") {
    return !isNaN(value) && isFinite(value);
  }
  if (typeof value === "string") {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num);
  }
  return false;
}

/**
 * Safely convert unknown value to typed array
 * @param value - Value to convert
 * @returns Typed array or empty array if invalid
 */
export function safeArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }
  return [];
}
