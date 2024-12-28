import { DirectoryError } from '../../utils/errors.js';
import fs from 'fs';



export const createOperation = (ctx, fileInfo) => {
  try {
    // Check if fileInfo is an array (multiple files) or single object
    if (Array.isArray(fileInfo)) {
      // Handle multiple files
      fileInfo.forEach(file => {
        if (!file.type || !file.name || !file.path) {
          throw new DirectoryError('Please specify the type, name, and path for all files.');
        }
        if (file.type === 'folder') {
          fs.mkdirSync(file.path, { recursive: true });
        } else {
          fs.writeFileSync(file.path, file.content || '');
        }
      });
      return ['create', 'success', 'Multiple resources created successfully'];
    } else {
      // Handle single file
      if (!fileInfo.type || !fileInfo.name || !fileInfo.path) {
        throw new DirectoryError('Please specify the type, name, and path of the file or folder.');
      }
      if (fileInfo.type === 'folder') {
        fs.mkdirSync(fileInfo.path, { recursive: true });
      } else {
        fs.writeFileSync(fileInfo.path, fileInfo.content || '');
      }
      return ['create', 'success', 'Resource created successfully'];
    }
  } catch (error) {
    throw new DirectoryError('Failed to create resource: ' + error.message);
  }
};