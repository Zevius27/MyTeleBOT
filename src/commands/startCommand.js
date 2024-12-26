export const handleStart = async (ctx) => {
  console.log('Start command received');
  await ctx.reply(
    'Welcome to the File Storage Bot! 👋\n\n' +
    'I can help you store and manage your files. Here are the available commands:\n\n' +
    '/start - Show this welcome message\n' +
    '/help - Show help information\n' +
    '/rename - Rename your saved files\n' +
    '/sendfilename - Show the name of the file you sent\n' +
    '/delete - Delete your saved files\n' +
    '/test - Test if the bot is working\n' +
    '/fetchmodels - Fetch available models from the API\n' +
    'You can also send me documents, photos, or videos to store them.'
    + '\n\n' +
    'You can also talk directly to Gemini by sending me text messages.'
  );

}; 