import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatDate, formatRelativeTime, isWithinDays } from './dates';

describe('formatDate', () => {
  it('should format date to "Month Day, Year" format', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date);
    expect(result).toBe('January 15, 2024');
  });

  it('should format date with different locale', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date, 'fr-FR');
    expect(result).toBe('15 janvier 2024');
  });

  it('should handle end of year dates', () => {
    const date = new Date('2024-12-31');
    const result = formatDate(date);
    expect(result).toBe('December 31, 2024');
  });

  it('should handle leap year dates', () => {
    const date = new Date('2024-02-29');
    const result = formatDate(date);
    expect(result).toBe('February 29, 2024');
  });
});

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return "just now" for dates within a minute', () => {
    const date = new Date('2024-01-15T11:59:30');
    const result = formatRelativeTime(date);
    expect(result).toBe('just now');
  });

  it('should return minutes ago for recent dates', () => {
    const date = new Date('2024-01-15T11:55:00');
    const result = formatRelativeTime(date);
    expect(result).toBe('5 minutes ago');
  });

  it('should return hours ago for same day', () => {
    const date = new Date('2024-01-15T09:00:00');
    const result = formatRelativeTime(date);
    expect(result).toBe('3 hours ago');
  });

  it('should return days ago for recent days', () => {
    const date = new Date('2024-01-13T12:00:00');
    const result = formatRelativeTime(date);
    expect(result).toBe('2 days ago');
  });

  it('should return "1 day ago" for yesterday', () => {
    const date = new Date('2024-01-14T12:00:00');
    const result = formatRelativeTime(date);
    expect(result).toBe('1 day ago');
  });

  it('should return weeks ago for older dates', () => {
    const date = new Date('2024-01-01T12:00:00');
    const result = formatRelativeTime(date);
    expect(result).toBe('2 weeks ago');
  });

  it('should return months ago for much older dates', () => {
    const date = new Date('2023-11-15T12:00:00');
    const result = formatRelativeTime(date);
    expect(result).toBe('2 months ago');
  });
});

describe('isWithinDays', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return true for dates within the specified days', () => {
    const date = new Date('2024-01-14T12:00:00');
    expect(isWithinDays(date, 7)).toBe(true);
  });

  it('should return true for today', () => {
    const date = new Date('2024-01-15T08:00:00');
    expect(isWithinDays(date, 1)).toBe(true);
  });

  it('should return false for dates outside the specified days', () => {
    const date = new Date('2024-01-01T12:00:00');
    expect(isWithinDays(date, 7)).toBe(false);
  });

  it('should return false for future dates', () => {
    const date = new Date('2024-01-20T12:00:00');
    expect(isWithinDays(date, 7)).toBe(false);
  });

  it('should handle edge case at exactly N days', () => {
    const date = new Date('2024-01-08T12:00:00'); // exactly 7 days ago
    expect(isWithinDays(date, 7)).toBe(true);
  });
});
