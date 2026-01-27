import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  validateContactForm,
  sanitizeInput,
  isWithinLength,
} from './validation';
import type { ContactFormData } from './types';

describe('isValidEmail', () => {
  it('should return true for valid email addresses', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.org')).toBe(true);
    expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
  });

  it('should return false for invalid email addresses', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('invalid@')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('user@.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('should return false for emails with spaces', () => {
    expect(isValidEmail('user @example.com')).toBe(false);
    expect(isValidEmail('user@ example.com')).toBe(false);
  });
});

describe('validateContactForm', () => {
  const validData: ContactFormData = {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Hello',
    message: 'This is a test message.',
  };

  it('should return valid for complete valid form', () => {
    const result = validateContactForm(validData);

    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should return error for missing name', () => {
    const data = { ...validData, name: '' };
    const result = validateContactForm(data);

    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it('should return error for invalid email', () => {
    const data = { ...validData, email: 'invalid-email' };
    const result = validateContactForm(data);

    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it('should return error for missing subject', () => {
    const data = { ...validData, subject: '' };
    const result = validateContactForm(data);

    expect(result.valid).toBe(false);
    expect(result.errors.subject).toBeDefined();
  });

  it('should return error for message too short', () => {
    const data = { ...validData, message: 'Hi' };
    const result = validateContactForm(data);

    expect(result.valid).toBe(false);
    expect(result.errors.message).toBeDefined();
  });

  it('should return error for message too long', () => {
    const data = { ...validData, message: 'a'.repeat(5001) };
    const result = validateContactForm(data);

    expect(result.valid).toBe(false);
    expect(result.errors.message).toBeDefined();
  });

  it('should return multiple errors for multiple invalid fields', () => {
    const data: ContactFormData = {
      name: '',
      email: 'invalid',
      subject: '',
      message: '',
    };
    const result = validateContactForm(data);

    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors).length).toBeGreaterThan(1);
  });

  it('should trim whitespace from fields', () => {
    const data = { ...validData, name: '  John Doe  ' };
    const result = validateContactForm(data);

    expect(result.valid).toBe(true);
  });
});

describe('sanitizeInput', () => {
  it('should escape HTML tags', () => {
    const result = sanitizeInput('<script>alert("xss")</script>');
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('</script>');
  });

  it('should escape special characters', () => {
    const result = sanitizeInput('<div onclick="hack()">');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('should preserve normal text', () => {
    const result = sanitizeInput('Hello World');
    expect(result).toBe('Hello World');
  });

  it('should handle empty string', () => {
    const result = sanitizeInput('');
    expect(result).toBe('');
  });

  it('should escape ampersands', () => {
    const result = sanitizeInput('Tom & Jerry');
    expect(result).toBe('Tom &amp; Jerry');
  });

  it('should escape quotes', () => {
    const result = sanitizeInput('He said "hello"');
    expect(result).toContain('&quot;');
  });
});

describe('isWithinLength', () => {
  it('should return true for string within limits', () => {
    expect(isWithinLength('hello', 1, 10)).toBe(true);
  });

  it('should return true for string at minimum length', () => {
    expect(isWithinLength('hi', 2, 10)).toBe(true);
  });

  it('should return true for string at maximum length', () => {
    expect(isWithinLength('hello', 1, 5)).toBe(true);
  });

  it('should return false for string below minimum', () => {
    expect(isWithinLength('a', 2, 10)).toBe(false);
  });

  it('should return false for string above maximum', () => {
    expect(isWithinLength('hello world', 1, 5)).toBe(false);
  });

  it('should return false for empty string when min > 0', () => {
    expect(isWithinLength('', 1, 10)).toBe(false);
  });

  it('should return true for empty string when min is 0', () => {
    expect(isWithinLength('', 0, 10)).toBe(true);
  });
});
