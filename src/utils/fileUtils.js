import fs from 'fs/promises';
import path from 'path';
import { DirectoryError } from './errors.js';
import { validateUsername } from './security.js';
import { log } from 'console';

let userDir;

export async function ensureUserDirectory(ctx,rawUsername, fileInfo = null) {
  try {
  
    const username = validateUsername(rawUsername);
    // log(username + " is the username \n");
    const baseDir = process.env.DOWNLOAD_BASE_PATH;
  
    if (!baseDir) {
      throw new DirectoryError('DOWNLOAD_BASE_PATH environment variable is not configured');
    }

    // let USERDIR = ctx.message.from.username || `user_${ctx.message.from.id}`;
    userDir = `${baseDir}/${rawUsername}`; // no / at the end ?
    
    // await fs.mkdir(baseDir, { recursive: true });// creates the base directory if it doesn't exist
    await fs.mkdir(userDir, { recursive: true });// creates the user directory if it doesn't exist
    // await fs.mkdir(userDir, { recursive: true });// creates the user directory if it doesn't exist
    // console.log(userDir);
    await validateDirectoryPath(userDir, baseDir);

    // await Dirlog(userDir);
    return userDir;// whats the userDir content path? = userDir

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
  // return true;
}


async function Dirlog(userDir) {
  console.log(userDir);
}