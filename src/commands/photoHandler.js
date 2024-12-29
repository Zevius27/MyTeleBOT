import fs from 'fs';
import fetch from 'node-fetch';
import { ensureUserDirectory } from '../utils/fileUtils.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateFile } from '../utils/fileValidation.js';
import { sanitizeFilename, validateUsername } from '../utils/security.js';
import { DirectoryError } from '../utils/errors.js';
import { getButtonState } from './btntest.js';
import { detectText } from './visionHandler.js';
// import {handleTextMessage} from './textMessageHandler.js';

export const handlePhoto = asyncHandler(async (ctx) => {
  try {
    // await handleTextMessage(ctx);

    // Initial response
    await ctx.reply('Processing your photo...');

    // Get the largest photo size available
    const photos = ctx.message.photo;
    const photo = photos[photos.length - 1];

    // Get user info first
    const rawUsername =
      ctx.message.from.username || `user_${ctx.message.from.id}`;
    const username = validateUsername(rawUsername);

    // Create a file-like object for initial check
    const photoFile = {
      file_size: photo.file_size,
      file_name: `photo_${Date.now()}.jpg`,
      file_path: photo.file_path,
    };

    // Validate file before directory operations
    validateFile(photoFile);

    // Check if user directory exists and create if needed
    const baseDir = process.env.DOWNLOAD_BASE_PATH;
    const userDir = `${baseDir}/${username}`;

    if (!fs.existsSync(userDir)) {
      await ctx.reply('Creating user directory...');
      await ctx.reply(
        'Directory created successfully! Processing your photo...'
      );
      await ensureUserDirectory(ctx, username, photoFile);
    }
    // Get file link
    const fileLink = await ctx.telegram.getFileLink(photo.file_id);

    // Download file
    const response = await fetch(fileLink);
    if (!response.ok) {
      throw new DirectoryError('Failed to download photo from Telegram');
    }

    // Process and save file
    const buffer = await response.arrayBuffer().then(Buffer.from);
    const sanitizedName = sanitizeFilename(photoFile.file_name);
    const filePath = `${userDir}/${sanitizedName}`;

    // Save file asynchronously
    await fs.promises.writeFile(filePath, buffer);
    if (await getButtonState(ctx,1208927174) === false) {
      await ctx.reply(
        `Photo saved successfully!\n` +
          `Saved as: <code>${sanitizedName}</code>\n` +
          `Path: <code>${filePath}</code>\n` +
          `File size: <code>${photoFile.file_size}</code>`,
        { parse_mode: 'HTML' }
      );
    } else {
      console.log("prcoessing");
      // detectText(filePath)

    }
  } catch (error) {
    console.error(error);
    throw error;
  }
});
