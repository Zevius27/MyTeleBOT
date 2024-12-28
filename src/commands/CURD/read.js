import { DirectoryError } from '../../utils/errors.js';
import fs from 'fs/promises';
import { validateUsername } from '../../utils/security.js';






export const readOperation = (ctx, fileInfo) => {
  try {
    // Logic to read a resource
    // For example, fetching data from a database or file

    const rawUsername = ctx.message.from.username || `user_${ctx.message.from.id}`;
    const username = validateUsername(rawUsername);
    const info = fs.readFileSync(fileInfo.path);
    fs.writeFileSync(`./downloads/${username}/readRetrivedInfo.txt`, info);
    
    ctx.reply(`${info}`);
    return ['read', 'success', `Resource Read successfully`];
  } catch (error) {
    throw new DirectoryError('Failed to read resource: ' + error.message);
  }
}; 