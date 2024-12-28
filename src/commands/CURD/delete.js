import { DirectoryError } from '../../utils/errors.js';
import fs from 'fs';

export const deleteOperation = (ctx, fileInfo) => {
  try {
    // Logic to delete a file
    fs.unlinkSync(fileInfo.path);
    return ['delete', 'success', `Resource with Name ${fileInfo.name} deleted successfully`];
  } catch (error) {
    throw new DirectoryError('Failed to delete resource: ' + error.message);
  }
}; 