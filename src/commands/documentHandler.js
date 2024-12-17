import fs from 'fs';
import fetch from 'node-fetch';
import { ensureUserDirectory } from '../utils/fileUtils.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateFile } from '../utils/fileValidation.js';
import { sanitizeFilename, validateUsername } from '../utils/security.js';
import { DirectoryError } from '../utils/errors.js';

export const handleDocument = asyncHandler(async (ctx) => {
  try {
    // Initial response
    await ctx.reply('Processing your document...');

    // Get file and user info
    const file = ctx.message.document;
    const rawUsername = ctx.message.from.username || `user_${ctx.message.from.id}`;
    const username = validateUsername(rawUsername);

    // Create a file-like object for validation
    const documentFile = {
      file_size: file.file_size,
      file_name: file.file_name || `document_${Date.now()}`
    };

    // Validate file
    validateFile(documentFile);

    // Check if user directory exists and create if needed
    const baseDir = process.env.DOWNLOAD_BASE_PATH;
    const userDir = `${baseDir}/${username}`;

    if (!fs.existsSync(userDir)) {
      await ctx.reply('Creating user directory...');
      await ctx.reply('Directory created successfully! Processing your document...');
      await ensureUserDirectory(username);
    }

    // Get file link
    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    
    // Download file
    const response = await fetch(fileLink);
    if (!response.ok) {
      throw new DirectoryError('Failed to download document from Telegram');
    }

    // Process and save file
    const buffer = await response.arrayBuffer().then(Buffer.from);
    const sanitizedName = sanitizeFilename(documentFile.file_name);
    const filePath = `${userDir}/${sanitizedName}`;

    // Save file asynchronously
    await fs.promises.writeFile(filePath, buffer);

    // Send success message with copyable filename
    await ctx.reply(
      `Document saved successfully!\n` +
      `Original name: <code>${documentFile.file_name}</code>\n` +
      `Saved as: <code>${sanitizedName}</code>`,
      { parse_mode: 'HTML' }
    );

  } catch (error) {
    console.error(error);
    throw error;
  }
}); 



