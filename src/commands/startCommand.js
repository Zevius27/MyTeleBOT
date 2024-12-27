import { ensureUserDirectory } from '../utils/fileUtils.js';
import { validateUsername } from '../utils/security.js';
import fs from 'fs/promises';

export const handleStart = async (ctx) => {
  const rawUsername = ctx.message.from.username || `user_${ctx.message.from.id}`;
  const username = validateUsername(rawUsername);

  // Ensure user directory exists
  const userDir = await ensureUserDirectory(ctx,rawUsername);

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
    '/fetchmodels - Fetch available models from the API ❌  yet to be active\n' +
    '/selectmodel - Select a model ❌  yet to be active\n' +
    'You can also send me documents, photos, or videos to store them.' +
    '\n\n' +
    'You can also talk directly to ai by sending me text messages.'
  );
};

// New function to create README file
const createReadmeFile = async (userDir) => {
  const readmeContent = ` 
{ 
  "1. operation": "Must be 'create', 'read', 'update', or 'delete'.",
  "2. status": "Must be 'success', 'error', or 'pending'.",
  "3. message": "User-friendly explanation of the operation result.",
  "4. file": {
    "id": "File ID",
    "name": "File name",
    "content": "File content",
    "path": "Complete file path",
    "size": "File size in bytes",
    "type": "File type (e.g., 'txt', 'json')",
    "link": "File URL or link",
    "duration": "File duration (null if not applicable)"
  },
  "Notes": {
    "Unspecified fields": "Set to null.",
    "Response format": "Pure object for file operations, starts with '{'. Normal text response otherwise.",
    "Directory info": "We are in ${userDir}, omit unless requested. Always use complete paths.",
    "message": "if noInstruction == true then Normal text response precise ,conscise and short.",
    "Strict adherence": "Follow notes strictly."
    
    }
    Role = you are File Handler and Normal text person if no instruction is given.
} `;


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
