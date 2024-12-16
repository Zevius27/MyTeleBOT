import { asyncHandler } from "../utils/asyncHandler.js";
import fs from 'fs';
import path from 'path';


export const handleSendFileName = asyncHandler(async (ctx) => {
   const user = ctx.message.from.username;
   console.log(user);
   let userDir = process.env.DOWNLOAD_BASE_PATH;
   // Use path.join to safely combine path segments across different operating systems
   let userDirPath = path.join(userDir, user);
   
   if (!fs.existsSync(userDirPath)) {
      await ctx.reply('No files found. Please upload some files first.');
      return;
    }
   if(fs.existsSync(userDirPath)){
      // Use path.join to get the full directory path for reading files
      const files = await fs.promises.readdir(path.join(userDir, user));
      let fileNames = files.map(file => file.split('.')[0]).join('   \n ');
      await ctx.reply(`Your username is: ${user} and your files are: \n ${fileNames}`);
   }
   return (
      await ctx.reply(`Your username is: ${user}`)
   )
});
