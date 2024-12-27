// The command is searching in the current working directory (CWD)
// To specify a different directory, use the --directory or -d option
// For example: create --directory /path/to/directory
// import { ensureUserDirectory } from '../../utils/fileUtils.js';
// import { createReadmeFile } from '../../utils/fileUtils.js';
// import { validateUsername } from '../../utils/security.js';
// import fs from 'fs/promises';
// import path from 'path';
import { DirectoryError } from '../../utils/errors.js';
import fs from 'fs/promises';
import path from 'path';
import { validateUsername } from '../../utils/security.js';
// import { ensureUserDirectory } from '../../utils/fileUtils.js';
import { Console, log } from 'console';
import { console } from 'inspector';
// import { validateDirectoryPath } from '../../utils/fileUtils.js';

export const createOperation = async (ctx, fileInfo) => {
  try {
    // Logic to create a resource
    // For example, saving data to a database or file
    if (!fileInfo.type || !fileInfo.name || !fileInfo.path) {
      ctx.reply('Please specify the type, name, and path of the file or folder.');
      return;
    }
    if (fileInfo.type === 'folder') {
      // ctx.reply('Your request is being processed.');
      await fs.mkdir(fileInfo.path, { recursive: true });
    } else {
      // ctx.reply('Your request is being processed.');
      await fs.writeFile(fileInfo.path, fileInfo.content);
    }
    // console.log(" this is the userDir", userDir);
    return ['create', 'success', 'Resource created successfully'];
  } catch (error) {
    throw new DirectoryError('Failed to create resource: ' + error.message);
  }
};