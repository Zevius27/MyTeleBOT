import fs from 'fs';
import path from 'path';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sanitizeFilename, validateUsername } from '../utils/security.js';

export const handleRename = asyncHandler(async (ctx) => {
//   console.log('Renaming file command received');
  
  // Get full message text and remove the command
  const fullText = ctx.message.text.replace('/rename ', '');
  
  // Split only on the first space to handle filenames with spaces
  const args = fullText.split(/ (.+)/);
//   console.log('Arguments:', args);
  
  if (args.length <= 2) {
    await ctx.reply(
      'Usage: /rename <current_filename>   <new_filename>\n\n' +
      'Example: /rename photo_123.jpg  new_photo.jpg'
    );
    return; // Add return here
  }

  const [currentName, newName] = args;
  const rawUsername = ctx.message.from.username || `user_${ctx.message.from.id}`;
//   console.log('Raw username:', rawUsername);
  const username = validateUsername(rawUsername);
//   console.log('Validated username:', username);
  
  const baseDir = process.env.DOWNLOAD_BASE_PATH;
  const userDir = `${baseDir}/${username}`;

  // Ensure user directory exists
  if (!fs.existsSync(userDir)) {
    await ctx.reply('No files found. Please upload some files first.');
    return;
  }

  // Find the actual file with the random suffix
  const files = await fs.promises.readdir(userDir);
  const targetFile = files.find(file => 
    file.toLowerCase().startsWith(path.parse(currentName).name.toLowerCase())
  );

  if (!targetFile) {
    await ctx.reply(
      'File not found. Please check the filename and try again.\n\n' +
      'Note: Use the exact filename shown when the file was uploaded.'
    );
    return;
  }

  // Prepare new filename
  const sanitizedNewName = sanitizeFilename(newName);
  const oldPath = path.join(userDir, targetFile);
  const newPath = path.join(userDir, sanitizedNewName);

  try {
    // Rename the file
    await fs.promises.rename(oldPath, newPath);
    
    await ctx.reply(
      `✅ File renamed successfully!\n\n` +
      `Old name: <code>${targetFile}</code>\n` +
      `New name: <code>${sanitizedNewName}</code>`,
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    await ctx.reply('Failed to rename file. Please try again.');
    throw error; // Re-throw for logging purposes
  }
}); 