import fs from 'fs';
import path from 'path';

export function ensureUserDirectory(username) {
  const baseDir = process.env.DOWNLOAD_BASE_PATH;
  if (!baseDir) {
    throw new Error('DOWNLOAD_BASE_PATH not configured');
  }

  const userDir = path.join(baseDir, username);
  const normalizedPath = path.normalize(userDir);

  // Ensure the path doesn't escape baseDir
  if (!normalizedPath.startsWith(baseDir)) {
    throw new Error('Invalid directory path');
  }

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  return userDir;
} 