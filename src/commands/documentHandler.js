import fs from 'fs';
import fetch from 'node-fetch';
import { ensureUserDirectory } from '../utils/fileUtils.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateFile } from '../utils/fileValidation.js';
import { sanitizeFilename, validateUsername } from '../utils/security.js';
import { DirectoryError } from '../utils/errors.js';
  

export const handleDocument = asyncHandler(async (ctx) => {
  // Get file and user info
  const file = ctx.message.document;
  const rawUsername = ctx.message.from.username || `user_${ctx.message.from.id}`;
  const username = validateUsername(rawUsername);

  // Initial response
  await ctx.reply('Processing your file...');

  // Validate file
  validateFile(file);

  // Get file link and prepare directory
  const fileLink = await ctx.telegram.getFileLink(file.file_id);
  const userDir = ensureUserDirectory(username);

  // Download file
  const response = await fetch(fileLink);
  if (!response.ok) {
    throw new DirectoryError('Failed to download file from Telegram');
  }

  // Process file
  const buffer = await response.arrayBuffer().then(Buffer.from);
  const originalName = file.file_name || `file_${Date.now()}`;
  const sanitizedName = sanitizeFilename(originalName);
  const filePath = `${userDir}/${sanitizedName}`;

  // Save file asynchronously
  await fs.promises.writeFile(filePath, buffer);

  // Send success message
  await ctx.reply(
    `File saved successfully!\n` +
    `Original name: ${originalName}\n` +
    `Saved as: ${sanitizedName}`
  );
}); 



