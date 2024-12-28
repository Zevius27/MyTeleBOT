import path from 'path';
import { SecurityError } from './errors.js';

export const sanitizeFilename = (filename) => {
  if (!filename || typeof filename !== 'string') {
    throw new SecurityError('Invalid filename');
  }

  // Remove path traversal attempts
  const sanitized = filename
    .replace(/^\.+[/\\]*/g, '') // Remove leading dots and slashes
    .replace(/[/\\]+/g, '') // Remove path separators
    .trim();

  if (!sanitized) {
    throw new SecurityError('Invalid filename after sanitization');
  }

  return sanitized;
};




export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    throw new SecurityError('Invalid username');
  }

  // Remove any path traversal attempts and special characters
  return username.replace(/[^a-zA-Z0-9_]/g, '');
}; 