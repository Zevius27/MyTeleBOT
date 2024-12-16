import crypto from 'crypto';
import path from 'path';

export const sanitizeFilename = (filename) => {
  // Remove any path traversal attempts
  const sanitized = path.basename(filename);
  
  // Remove any non-alphanumeric characters except for - _ . and space
  const cleaned = sanitized.replace(/[^a-zA-Z0-9\-_\. ]/g, '');
  
  // Add random suffix for uniqueness
  const extension = path.extname(cleaned);
  const name = path.basename(cleaned, extension);
  const randomSuffix = crypto.randomBytes(4).toString('hex');
  
  return `${name}_${randomSuffix}${extension}`;
};

export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    throw new Error('Invalid username');
  }
  
  // Remove any path traversal attempts and special characters
  return username.replace(/[^a-zA-Z0-9_]/g, '');
}; 