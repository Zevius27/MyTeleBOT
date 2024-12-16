
import path from 'path';

export const sanitizeFilename = (filename) => {
  // Remove any path traversal attempts
  const sanitized = path.basename(filename);
  
  // Get the extension and name parts
  const extension = path.extname(sanitized);
  const name = path.basename(sanitized, extension);
  
  // Clean the name part only, preserving the extension
  const cleanedName = name.replace(/[<>:"\/\\|?*]/g, '');
  
  // Handle case where name is empty after cleaning
  if (!cleanedName) {
    return extension;
  }
  
  return `${cleanedName}${extension}`;
};

export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    throw new Error('Invalid username');
  }
  
  // Remove any path traversal attempts and special characters
  return username.replace(/[^a-zA-Z0-9_]/g, '');
}; 