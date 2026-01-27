/**
 * Form validation utilities
 * @module utils/validation
 */

import type { ContactFormData, ValidationResult } from './types';

// Email regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation constants
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 5000;

/**
 * Validate an email address
 * @param email - Email to validate
 * @returns True if email is valid
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Validate contact form data
 * @param data - Form data to validate
 * @returns Validation result with errors
 */
export function validateContactForm(data: ContactFormData): ValidationResult {
  const errors: Record<string, string> = {};
  const trimmedName = data.name.trim();
  const trimmedEmail = data.email.trim();
  const trimmedSubject = data.subject.trim();
  const trimmedMessage = data.message.trim();

  // Validate name
  if (!trimmedName) {
    errors.name = 'Name is required';
  }

  // Validate email
  if (!isValidEmail(trimmedEmail)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate subject
  if (!trimmedSubject) {
    errors.subject = 'Subject is required';
  }

  // Validate message
  if (!trimmedMessage) {
    errors.message = 'Message is required';
  } else if (trimmedMessage.length < MIN_MESSAGE_LENGTH) {
    errors.message = `Message must be at least ${MIN_MESSAGE_LENGTH} characters`;
  } else if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    errors.message = `Message must be less than ${MAX_MESSAGE_LENGTH} characters`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Sanitize user input (basic XSS prevention)
 * @param input - User input to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Check if a string is within length limits
 * @param str - String to check
 * @param min - Minimum length
 * @param max - Maximum length
 * @returns True if string is within limits
 */
export function isWithinLength(str: string, min: number, max: number): boolean {
  const length = str.length;
  return length >= min && length <= max;
}
