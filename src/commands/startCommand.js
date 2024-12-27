import { ensureUserDirectory } from '../utils/fileUtils.js';
import { validateUsername } from '../utils/security.js';
import fs from 'fs/promises';

export const handleStart = async (ctx) => {
  const rawUsername =
    ctx.message.from.username || `user_${ctx.message.from.id}`;
  const username = validateUsername(rawUsername);

  // Ensure user directory exists
  const userDir = await ensureUserDirectory(username);

  // Create README file in the user directory
  await createReadmeFile(userDir);

  // Create default chat
  console.log('Start command received');
  await ctx.reply(
    'Welcome to the File Storage Bot! 👋\n\n' +
      'I can help you store and manage your files in the downloads directory. Here are the available commands:\n\n' +
      '/start - Show this welcome message\n' +
      '/help - Show help information\n' +
      '/rename - Rename your saved files\n' +
      '/sendfilename - Show the name of the file you sent\n' +
      '/delete - Delete your saved files\n' +
      '/test - Test if the bot is working\n' +
      '/fetchmodels - Fetch available models from the API\n' +
      '/selectmodel - Select a model\n' +
      'You can also send me documents, photos, or videos to store them.' +
      '\n\n' +
      'You can also talk directly to ai by sending me text messages.'
  );
};

// New function to create README file
const createReadmeFile = async (userDir) => {
  const readmeContent = ` 
  /*
  Instructions for AI:
  1. When a file operation is specified, respond with an array.
  2. The first element of the array should contain information for the AI to call.
  3. The second element should provide the status of the operation Doesnt need to be Boolean Keep it like a meassage for your self to respond to the user , by checking the status of the operation.
  4. The third element should be the response back to the user after the operation is completed.
  */
 `;
   
  const readmePath = `${userDir}/index.md`;

  try {
    // Check if index.md already exists
    await fs.access(readmePath);
    await ctx.reply('The README file already exists.'); // Send a message if the file is already there
  } catch (error) {
    // If the file does not exist, create it
    await fs.writeFile(readmePath, readmeContent);
    console.log('README file created successfully');
  }
};
