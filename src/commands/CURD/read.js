
import { DirectoryError } from '../../utils/errors.js';
import fs from 'fs/promises';








export const readOperation = async (ctx, fileInfo) => {
  try {
    // Logic to read a resource
    // For example, fetching data from a database or file

    const rawUsername = ctx.message.from.username || `user_${ctx.message.from.id}`;
    const username = validateUsername(rawUsername);
    const info = await fs.readFile(fileInfo.path);
    await fs.writeFile(`./downloads/${username}/readRetrivedInfo.txt`, info);
    await ctx.reply(`${info}`);
    return ['read', 'success', `Resource Read successfully`];
  } catch (error) {
    throw new DirectoryError('Failed to read resource: ' + error.message);
  }
}; 