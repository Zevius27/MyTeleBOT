import { FileTypeError, FileSizeError } from './errors.js';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_FILE_TYPES = new Set([
  'pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png',
  'mp4', 'mov', 'avi'
]);

export const validateFile = (file) => {
  // Check file size
  if (file.file_size > MAX_FILE_SIZE) {
    throw new FileSizeError('File size exceeds 100MB limit');
  }

  // Check file type
  const extension = file.file_name?.split('.').pop()?.toLowerCase();
  if (!extension || !ALLOWED_FILE_TYPES.has(extension)) {
    throw new FileTypeError('Unsupported file type');
  }

  return true;
};