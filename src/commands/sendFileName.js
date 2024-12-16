import { asyncHandler } from "../utils/asyncHandler.js";
import fs from 'fs';
import path from 'path';
import { validateUsername } from "../utils/security.js";

export const handleSendFileName = asyncHandler(async (ctx) => {
  const rawUsername = ctx.message.from.username || `user_${ctx.message.from.id}`;
  const username = validateUsername(rawUsername);
  const baseDir = process.env.DOWNLOAD_BASE_PATH;
   
  if (!baseDir) {
    await ctx.reply('Error: Download path not configured');
    return;
  }

  const userDirPath = path.join(baseDir, username);
   
  if (!fs.existsSync(userDirPath)) {
    await ctx.reply('No files found. Please upload some files first.');
    return;
  }

  // Read directory contents
  const files = await fs.promises.readdir(userDirPath);
  if (files.length === 0) {
    await ctx.reply('No files found. Please upload some files first.');
    return;
  }

  const fileList = files.map(file => `<code>${file}</code>`).join('\n');
  await ctx.reply(
    `Your files:\n${fileList}`,
    { parse_mode: 'HTML' }
  );
});
