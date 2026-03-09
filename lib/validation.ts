// Validation utilities

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// RFC 5322 compliant email regex (simplified)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Username: alphanumeric, 3-30 characters
const USERNAME_REGEX = /^[a-zA-Z0-9]{3,30}$/;

// Supported image MIME types
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

// Max image size: 10MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validateUsername(username: string): boolean {
  return USERNAME_REGEX.test(username);
}

export function validatePassword(password: string): boolean {
  return password.length >= 8;
}

export function validateImageTitle(title: string): boolean {
  return title.trim().length > 0;
}

export function validateImageFile(file: File): ValidationResult {
  const errors: string[] = [];

  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    errors.push(
      `Unsupported file type: ${file.type}. Supported types: JPEG, PNG, GIF, WebP`
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    errors.push(
      `File size exceeds maximum: ${(file.size / 1024 / 1024).toFixed(2)}MB > 10MB`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Sanitize text to prevent XSS
export function sanitizeText(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validate registration data
export function validateRegistration(
  username: string,
  email: string,
  password: string
): ValidationResult {
  const errors: string[] = [];

  if (!validateUsername(username)) {
    errors.push('Username must be 3-30 alphanumeric characters');
  }

  if (!validateEmail(email)) {
    errors.push('Invalid email format');
  }

  if (!validatePassword(password)) {
    errors.push('Password must be at least 8 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
