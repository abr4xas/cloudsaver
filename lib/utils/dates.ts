/**
 * Date calculation utilities
 */

/**
 * Get a date N months ago from now
 * @param months - Number of months to subtract
 * @returns Date object
 */
export function getDateMonthsAgo(months: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}

/**
 * Calculate days between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days between dates
 */
export function getDaysBetween(date1: Date, date2: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffMs = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffMs / msPerDay);
}

/**
 * Check if a date is older than N days
 * @param date - Date to check (Date object or ISO string)
 * @param days - Number of days threshold
 * @returns true if older than threshold
 */
export function isOlderThanDays(date: Date | string, days: number): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const daysDiff = getDaysBetween(dateObj, now);
  return daysDiff > days;
}

/**
 * Check if a date is older than N months
 * @param date - Date to check (Date object or ISO string)
 * @param months - Number of months threshold
 * @returns true if older than threshold
 */
export function isOlderThanMonths(date: Date | string, months: number): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const thresholdDate = getDateMonthsAgo(months);
  return dateObj < thresholdDate;
}
