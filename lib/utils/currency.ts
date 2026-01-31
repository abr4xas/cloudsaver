/**
 * Currency utility functions
 */

/**
 * Round currency to 2 decimal places
 * @param value - The numeric value to round
 * @returns Rounded value with 2 decimal places
 */
export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Format currency for display
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with fixed decimals
 */
export function formatCurrency(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}
