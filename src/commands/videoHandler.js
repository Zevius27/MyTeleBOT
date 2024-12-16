import fs from 'fs';
import fetch from 'node-fetch';
import { ensureUserDirectory } from '../utils/fileUtils.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateFile } from '../utils/fileValidation.js';
import { sanitizeFilename, validateUsername } from '../utils/security.js';

export const handleVideo = asyncHandler(async (ctx) => {
  // Get video info
  const video = ctx.message.video;
  const rawUsername = ctx.message.from.username || `user_${ctx.message.from.id}`;
  const username = validateUsername(rawUsername);

  // Initial response
  await ctx.reply('Processing your video...');

  // Create a file-like object for validation
  const videoFile = {
    file_size: video.file_size,
    file_name: video.file_name || `video_${Date.now()}.mp4`
  };

  // Validate file
  validateFile(videoFile);

  // Get file link and prepare directory
  const fileLink = await ctx.telegram.getFileLink(video.file_id);
  const userDir = ensureUserDirectory(username);

  // Download file
  const response = await fetch(fileLink);
  if (!response.ok) {
    throw new Error('Failed to download video from Telegram');
  }

  // Process file
  const buffer = await response.arrayBuffer().then(Buffer.from);
  const sanitizedName = sanitizeFilename(videoFile.file_name);
  const filePath = `${userDir}/${sanitizedName}`;

  // Save file asynchronously
  await fs.promises.writeFile(filePath, buffer);

  // Send success message
  await ctx.reply(
    `Video saved successfully!\n` +
    `Original name: ${videoFile.file_name}\n` +
    `Saved as: ${sanitizedName}`
  );
}); 