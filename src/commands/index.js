import { handleStart } from './startCommand.js';
import { handleHelp } from './helpCommand.js';
import { handleTest } from './testCommand.js';
import { handleDocument } from './documentHandler.js';
import { handlePhoto } from './photoHandler.js';
import { handleVideo } from './videoHandler.js';

export const registerCommands = (bot) => {
  bot.command('start', handleStart);
  bot.command('help', handleHelp);
  bot.command('test', handleTest);
  
  // File handlers
  bot.on('document', handleDocument);
  bot.on('photo', handlePhoto);
  bot.on('video', handleVideo);
}; 
