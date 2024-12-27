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
    "1. operation: Must be 'create', 'read', 'update', or 'delete'."
    "2. status: Must be 'success', 'error', or 'pending'."
    "3. message: Any user-friendly message explaining the operation result."
    "4. file: { 
      id: File ID,
      name: File name,
      content: File content,
      path: File path,
      size: File size in bytes,
      type: File type (e.g., 'txt', 'json'),
      link: URL or link to the file,
      duration: File duration (null if not applicable)
    }. Any unspecified fields should be set to null." 
    " Follow these instructions when any curd opertions are specified "
    "Strictly follow the instructions when any curd opertions are specified"
    "When no instructions are specified, the response will be a text response chat normally And be concise" 
    we are in ${userDir}&&  Dont say directory name until asked && Always give Complete path in the file object
    "The response shall be pure obj Not even a single string or charater just begin with obj starting charter shall be === "{" ,when file operation is specified when not specified normal text response"

 `;


  /* 
  "1. operation: Must be 'create', 'read', 'update', or 'delete'."
  "2. status: Must be 'success', 'error', or 'pending'."
  "3. message: Any user-friendly message explaining the operation result."
  "4. file: { 
    id: File ID,
    name: File name,
    content: File content,
    path: File path,
    size: File size in bytes,
    type: File type (e.g., 'txt', 'json'),
    link: URL or link to the file,
    duration: File duration (null if not applicable)
  }. Any unspecified fields should be set to null."
  */

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
