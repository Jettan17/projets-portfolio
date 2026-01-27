/**
 * Date formatting utilities
 * @module utils/dates
 */

/**
 * Format a date to a human-readable string
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date string (e.g., "January 15, 2024")
 */
export function formatDate(date: Date, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format a date to a relative time string (e.g., "2 days ago")
 * @param date - Date to compare
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) {
    return 'just now';
  }
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  if (days < 7) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
  if (weeks < 4) {
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  }
  return `${months} month${months === 1 ? '' : 's'} ago`;
}

/**
 * Check if a date is within a certain number of days from now
 * @param date - Date to check
 * @param days - Number of days
 * @returns True if date is within the specified days
 */
export function isWithinDays(date: Date, days: number): boolean {
  const now = Date.now();
  const dateTime = date.getTime();
  const diff = now - dateTime;
  const daysDiff = diff / (1000 * 60 * 60 * 24);

  // Must be in the past and within the specified days
  return diff >= 0 && daysDiff <= days;
}
