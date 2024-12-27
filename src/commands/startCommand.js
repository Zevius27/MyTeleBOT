import { ensureUserDirectory } from '../utils/fileUtils.js';
import { validateUsername } from '../utils/security.js';
import fs from 'fs/promises'; // Import fs/promises for async file operations

export const handleStart = async (ctx) => {
  const rawUsername = ctx.message.from.username || `user_${ctx.message.from.id}`;
  const username = validateUsername(rawUsername);

  // Ensure user directory exists
  const userDir = await ensureUserDirectory(username);

  // Create README file in the user directory
  const readmeContent = `Model : Be Concise and short on the responses  you are a text assistant to which we are gonna send img data and get ans , Dont give too long text until asked`;
  const readmePath = `${userDir}/index.md`;

  try {
    await fs.writeFile(readmePath, readmeContent);
    console.log('README file created successfully');
  } catch (error) {
    console.error('Failed to create README file:', error);
  }

  console.log('Start command received');
  await ctx.reply(
    'Welcome to the File Storage Bot! 👋\n\n' +
    'I can help you store and manage your files. Here are the available commands:\n\n' +
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
    'You can also talk directly to Gemini by sending me text messages.'
  );
}; 