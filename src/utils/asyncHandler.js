export const asyncHandler = (fn) => async (ctx, next) => {
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), 30000);
    });

    await Promise.race([fn(ctx, next), timeoutPromise]);
  } catch (error) {
    console.error(`Error in ${fn.name}:`, error);
    
    const errorMessages = {
      ValidationError: 'Invalid input provided',
      FileTypeError: 'This file type is not supported',
      FileSizeError: 'File size exceeds the maximum limit',
      DirectoryError: 'Error accessing file directory',
      SecurityError: 'Security check failed',
      Error: error.message
    };
    
    const message = errorMessages[error.name] || 'An error occurred while processing your request';
    await ctx.reply(message);
    
    throw error; // Re-throw to ensure promise rejection
  }
}; 
