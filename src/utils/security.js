import path from 'path';
import { SecurityError } from './errors.js';

export const sanitizeFilename = (filename) => {
  if (!filename || typeof filename !== 'string') {
    throw new SecurityError('Invalid filename');
  }

  // Remove any path traversal attempts
  const sanitized = path.basename(filename);
  
  // Get the extension and name parts
  const extension = path.extname(sanitized);
  const name = path.basename(sanitized, extension);
  
  // Clean the name part while preserving valid characters
  const cleanedName = name.replace(/[^a-zA-Z0-9_\-\s]/g, '')
                          .trim()
                          .replace(/\s+/g, '_');
  
  // Handle empty name case
  if (!cleanedName) {
    return `file_${Date.now()}${extension}`;
  }
  
  return `${cleanedName}${extension}`;
};

export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    throw new SecurityError('Invalid username');
  }
  
  // Remove any path traversal attempts and special characters
  return username.replace(/[^a-zA-Z0-9_]/g, '');
}; 