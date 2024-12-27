export const handleHelp = async (ctx) => {
  await ctx.reply(
    'File Storage Bot Help 📚\n\n' +
      'Commands:\n' +
      '/start - Show welcome message\n' +
      '/help - Show this help message\n' +
      '/rename - Rename a saved file\n' +
      '/delete - Delete a saved file\n' +
      '/sendfilename - Show the name of the file you sent\n' +
      '/test - Test if bot is working\n' +
      '/fetchmodels - Fetch available models from the API\n' +
      '/selectmodel - Select a model\n' +
      'You can also send me images to use Gemini to generate text from them. By command: /imgtogemini' +
      '\n\n' +
      'Supported file types:\n' +
      '- Documents (PDF, DOC, DOCX, TXT)\n' +
      '- Images (JPG, JPEG, PNG)\n' +
      '- Videos (MP4, MOV, AVI)\n\n' +
      'Maximum file size: 50MB\n\n' +
      'Your files are stored securely and organized by your username.',

    { parse_mode: 'HTML' }
  );
};
