export const handleStart = async (ctx) => {
  await ctx.reply(
    'Welcome to the File Storage Bot! 👋\n\n' +
    'I can help you store and manage your files. Here are the available commands:\n\n' +
    '/start - Show this welcome message\n' +
    '/help - Show help information\n' +
    '/test - Test if the bot is working\n\n' +
    'You can also send me documents, photos, or videos to store them.'
  );
}; 