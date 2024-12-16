import fs from 'fs';
import fetch from 'node-fetch';
import { ensureUserDirectory } from '../utils/fileUtils.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateFile } from '../utils/fileValidation.js';
import { sanitizeFilename, validateUsername } from '../utils/security.js';
import { DirectoryError } from '../utils/errors.js';

export const handlePhoto = asyncHandler(async (ctx) => {
  // Get the largest photo size available
  const photos = ctx.message.photo;
  const photo = photos[photos.length - 1];
  
  // Get user info
  const rawUsername = ctx.message.from.username || `user_${ctx.message.from.id}`;
  const username = validateUsername(rawUsername);

  // Initial response
  await ctx.reply('Processing your photo...');

  // Create a file-like object for validation
  const photoFile = {
    file_size: photo.file_size,
    file_name: `photo_${Date.now()}.jpg`
  };

  // Validate file
  validateFile(photoFile);

  // Get file link and prepare directory
  const fileLink = await ctx.telegram.getFileLink(photo.file_id);
  const userDir = await ensureUserDirectory(username);

  // Download file
  const response = await fetch(fileLink);
  if (!response.ok) {
    throw new DirectoryError('Failed to download photo from Telegram');
  }

  try {
    // Process file
    const buffer = await response.arrayBuffer().then(Buffer.from);
    const sanitizedName = sanitizeFilename(photoFile.file_name);
    const filePath = `${userDir}/${sanitizedName}`;

    // Save file asynchronously
    await fs.promises.writeFile(filePath, buffer);

    // Send success message with copyable filename
    await ctx.reply(
      `Photo saved successfully!\n` +
      `Saved as: <code>${sanitizedName}</code>`,
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    throw new DirectoryError(`Failed to save photo: ${error.message}`);
  }
}); 