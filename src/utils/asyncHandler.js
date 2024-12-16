export const asyncHandler = (fn) => async (ctx, next) => {
  try {
    await fn(ctx, next);
  } catch (error) {
    console.error(`Error in ${fn.name}:`, error);
    
    const errorMessages = {
      ValidationError: 'Invalid input provided',
      FileTypeError: 'This file type is not supported',
      FileSizeError: 'File size exceeds the maximum limit',
      DirectoryError: 'Error accessing file directory',
      SecurityError: 'Security check failed'
    };
    
    const message = errorMessages[error.name] || 'An error occurred while processing your request';
    await ctx.reply(message);
    
    // Log error details for monitoring
    console.error({
      handler: fn.name,
      errorType: error.name,
      message: error.message,
      stack: error.stack
    });
  }
}; 
