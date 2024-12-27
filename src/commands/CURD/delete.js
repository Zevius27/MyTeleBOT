import { DirectoryError } from '../../utils/errors.js';


export const deleteOperation = async (ctx, fileInfo) => {
  try {
    // Logic to delete a resource
    // For example, removing data from a database or file
    return ['delete', 'success', `Resource with ID ${fileInfo.id} deleted successfully`];
  } catch (error) {
    throw new DirectoryError('Failed to delete resource: ' + error.message);
  }
}; 