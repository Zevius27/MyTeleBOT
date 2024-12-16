export const asyncHandler = (fn) => async (ctx, next) => {
  try {
    await fn(ctx, next);
  } catch (error) {
    console.error(`Error in ${fn.name}:`, error);
    
    // Send user-friendly message based on error type
    if (error.name === 'ValidationError') {
      await ctx.reply('Invalid input provided');
    } else if (error.name === 'FileTypeError') {
      await ctx.reply('This file type is not supported');
    } else if (error.name === 'FileSizeError') {
      await ctx.reply('File size exceeds the maximum limit');
    } else {
      await ctx.reply('An error occurred while processing your request');
    }
    
    // Pass error to any error monitoring service
    // monitorError(error);
  }
}; 
