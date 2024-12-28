import fs from 'fs';
import path from 'path';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateUsername } from '../utils/security.js';
import { DirectoryError } from '../utils/errors.js';

export const handleDelete = asyncHandler(async (ctx) => {
  const filename = ctx.message.text.replace('/delete ', '').trim();
  
  if (!filename) {
    await ctx.reply('Usage: /delete <filename>\nExample: /delete document.pdf');
    return;
  }

  const rawUsername = ctx.message.from.username || `user_${ctx.message.from.id}`;
  const username = validateUsername(rawUsername);
  const baseDir = process.env.DOWNLOAD_BASE_PATH;
  const userDir = `${baseDir}/${username}`;

  if (!fs.existsSync(userDir)) {
    await ctx.reply('No files found. Please upload some files first.');
    return;
  }

  // Find the actual file
  const files = await fs.promises.readdir(userDir);
  const targetFile = files.find(file => 
    file.toLowerCase().startsWith(path.parse(filename).name.toLowerCase())
  );

  if (!targetFile) {
    await ctx.reply(
      'File not found. Please check the filename and try again.\n\n' +
      'Note: Use the exact filename shown when the file was uploaded.'
    );
    return;
  }

  const filePath = path.join(userDir, targetFile);

  try {
    // Delete the file
    await fs.promises.unlink(filePath);
    
    await ctx.reply(
      `✅ File deleted successfully!\n\n` +
      `Deleted file: <code>${targetFile}</code>`,
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    throw new DirectoryError(`Failed to delete file: ${error.message}`);
  }
}); 