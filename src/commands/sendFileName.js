import { asyncHandler } from "../utils/asyncHandler.js";
import fs from 'fs';
import path from 'path';

export const handleSendFileName = asyncHandler(async (ctx) => {
   const user = ctx.message.from.username;
   const userDir = process.env.DOWNLOAD_BASE_PATH;
   
   if (!userDir) {
     await ctx.reply('Error: Download path not configured');
     return;
   }

   // Use path.join to safely combine path segments
   const userDirPath = path.join(userDir, user);
   
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

   const fileNames = files.map(file => file.split('.')[0]).join('\n');
   await ctx.reply(
      `Your files:\n${fileNames}`,
      { parse_mode: 'HTML' }
   );
});
