import { Telegraf } from 'telegraf';
import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import fetch from 'node-fetch';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());

// Helper function for directory management
function ensureUserDirectory(username) {
  const baseDir = process.env.DOWNLOAD_BASE_PATH;
  const userDir = `${baseDir}/${username}`;

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
  }
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir);
  }
  return userDir;
}

// Bot commands
bot.command('start', (ctx) => {
  ctx.reply('Hello, Welcome to the bot created by Zevius \n Refer to /help for more information');
});

bot.command('help', (ctx) => {
  ctx.reply(
    'Available commands:\n/start - Start the bot\n/help - Show this message\n/test - Test command\n\n' +
    '* The bot has Capabilities to download files and photos from telegram and save them in our personal server\n' +
    '* Try sending A Document or a photo In your Chat.\n' +
    '* Speed is on limit of 1MB ps so please be patient for larger files'
  );
});

bot.command('test', (ctx) => {
  ctx.reply('Test command executed');
});

// Handle documents
bot.on('document', async (ctx) => {
  try {
    const file = ctx.message.document;
    const username = ctx.message.from.username || `user_${ctx.message.from.id}`;
    
    await ctx.reply('File information received');
    
    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    const userDir = ensureUserDirectory(username);
    
    const response = await fetch(fileLink);
    const buffer = await response.arrayBuffer().then(Buffer.from);
    const fileName = file.file_name || `file_${Date.now()}`;
    fs.writeFileSync(`${userDir}/${fileName}`, buffer);
    
    ctx.reply(`File saved successfully in your personal folder as ${fileName}`);
  } catch (error) {
    console.error('Error handling document:', error);
    ctx.reply('Error saving file');
  }
});

// Handle photos
bot.on('photo', async (ctx) => {
  try {
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const username = ctx.message.from.username || `user_${ctx.message.from.id}`;
    
    await ctx.reply('Photo information received');
    
    const fileLink = await ctx.telegram.getFileLink(photo.file_id);
    const userDir = ensureUserDirectory(username);
    
    const response = await fetch(fileLink);
    const buffer = await response.arrayBuffer().then(Buffer.from);
    const fileName = `photo_${ctx.message.from.username}-${Date.now()}.jpg`;
    fs.writeFileSync(`${userDir}/${fileName}`, buffer);
    
    ctx.reply(`Photo saved successfully in your personal folder as ${fileName}`);
  } catch (error) {
    console.error('Error handling photo:', error);
    ctx.reply('Error saving photo');
  }
});

// Handle videos
bot.on('video', async (ctx) => {
  try {
    const video = ctx.message.video;
    const username = ctx.message.from.username || `user_${ctx.message.from.id}`;
    
    await ctx.reply('Video information received');
    
    const fileLink = await ctx.telegram.getFileLink(video.file_id);
    const userDir = ensureUserDirectory(username);
    
    const response = await fetch(fileLink);
    const buffer = await response.arrayBuffer().then(Buffer.from);
    const fileName = `video_${ctx.message.from.username}-${Date.now()}.mp4`;
    fs.writeFileSync(`${userDir}/${fileName}`, buffer);
    
    ctx.reply(`Video saved successfully in your personal folder as ${fileName}`);
  } catch (error) {
    console.error('Error handling video:', error);
    ctx.reply('Error saving video');
  }
});

// Set webhook
app.use(bot.webhookCallback('/webhook'));
bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/webhook`);

// Start server
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});

export { app };

