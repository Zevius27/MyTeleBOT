export const handleHelp = async (ctx) => {
  await ctx.reply(
    'File Storage Bot Help 📚\n\n' +
    'Supported file types:\n' +
    '- Documents (PDF, DOC, DOCX, TXT)\n' +
    '- Images (JPG, JPEG, PNG)\n' +
    '- Videos (MP4, MOV, AVI)\n\n' +
    'Maximum file size: 50MB\n\n' +
    'Your files are stored securely and organized by your username.'
  );
}; 