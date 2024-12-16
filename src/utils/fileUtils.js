import fs from 'fs';

export function ensureUserDirectory(username) {
  const baseDir = process.env.DOWNLOAD_BASE_PATH;
  const userDir = `${baseDir}/${username}`;

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
  }
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir);
  }
  return userDir;
} 