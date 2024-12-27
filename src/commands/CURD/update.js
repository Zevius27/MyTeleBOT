import { DirectoryError } from '../../utils/errors.js';
import fs from 'fs';

export const updateOperation = async (ctx, fileInfo) => {
  try {
    // Logic to update a resource
    // For example, updating data in a database or file
    if(!fs.existsSync(fileInfo.path)){
      console.log("file does not exists");
      ctx.reply("file does not exists please create the file");
      return;
    }
    fs.appendFile(fileInfo.path, fileInfo.content);

    return ['update', 'success', `Resource with ${fileInfo.name} updated successfully`];
  } catch (error) {
    throw new DirectoryError('Failed to update resource: ' + error.message);
  }
}; 