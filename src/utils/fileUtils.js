import fs from 'fs/promises';
import path from 'path';
import { DirectoryError } from './errors.js';
import { validateUsername } from './security.js';

export async function ensureUserDirectory(rawUsername) {
  try {
    const username = validateUsername(rawUsername);
    const baseDir = process.env.DOWNLOAD_BASE_PATH;
    
    if (!baseDir) {
      throw new DirectoryError('DOWNLOAD_BASE_PATH environment variable is not configured');
    }

    const userDir = path.join(baseDir, username);
    console.log(userDir);
    const normalizedPath = path.normalize(userDir);

    await fs.mkdir(baseDir, { recursive: true });// creates the base directory if it doesn't exist
    await fs.mkdir(userDir, { recursive: true });// creates the user directory if it doesn't exist

    await validateDirectoryPath(normalizedPath, baseDir);
    return userDir;

  } catch (error) {
    if (!(error instanceof DirectoryError)) {
      throw new DirectoryError(`Directory operation failed: ${error.message}`);
    }
    throw error;
  }
} 



export async function validateDirectoryPath(normalizedPath, baseDir) {
  if (!normalizedPath.startsWith(baseDir)) {
    throw new DirectoryError(
      `Invalid directory path detected. Path "${normalizedPath}" attempts to escape base directory`
    );
  }
}


