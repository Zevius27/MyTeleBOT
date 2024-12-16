import fs from 'fs';
import fetch from 'node-fetch';
import { ensureUserDirectory } from '../utils/fileUtils.js';

export const handleDocument = async (ctx) => {
  try {
    const file = ctx.message.document;
    const username = ctx.message.from.username || `user_${ctx.message.from.id}`;
    
    await ctx.reply('File information received');
    
    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    const userDir = ensureUserDirectory(username);
    
    const response = await fetch(fileLink);
    const buffer = await response.arrayBuffer().then(Buffer.from);
    const fileName = file.file_name || `file_${Date.now()}`;
    fs.writeFileSync(`${userDir}/${fileName}`, buffer);
    
    ctx.reply(`File saved successfully in your personal folder as ${fileName}`);
  } catch (error) {
    console.error('Error handling document:', error);
    ctx.reply('Error saving file');
  }
}; 