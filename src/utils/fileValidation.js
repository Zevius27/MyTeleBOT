export class FileTypeError extends Error {
   constructor(message) {
     super(message);
     this.name = 'FileTypeError';
   }
 }
 
 export class FileSizeError extends Error {
   constructor(message) {
     super(message);
     this.name = 'FileSizeError';
   }
 }
 
 const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
 const ALLOWED_FILE_TYPES = new Set([
   'pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png',
   'mp4', 'mov', 'avi'
 ]);
 
 export const validateFile = (file) => {
   // Check file size
   if (file.file_size > MAX_FILE_SIZE) {
     throw new FileSizeError('File size exceeds 50MB limit');
   }
 
   // Check file type
   const extension = file.file_name?.split('.').pop()?.toLowerCase();
   if (!extension || !ALLOWED_FILE_TYPES.has(extension)) {
     throw new FileTypeError('Unsupported file type');
   }
 
   return true;
 };