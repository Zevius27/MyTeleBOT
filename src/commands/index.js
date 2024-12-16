import { handleStart } from './startCommand.js';
import { handleHelp } from './helpCommand.js';
import { handleTest } from './testCommand.js';
import { handleDocument } from './documentHandler.js';
import { handlePhoto } from './photoHandler.js';
import { handleVideo } from './videoHandler.js';
import { handleRename } from './renameFileCommand.js';
import { handleSendFileName } from './sendFileName.js';
import { handleDelete } from './deleteFileCommand.js';


export const registerCommands = (bot) => {
  bot.command('start', handleStart);
  bot.command('help', handleHelp);
  bot.command('test', handleTest);
  bot.command('rename', handleRename);
  bot.command('sendFileName', handleSendFileName);
  bot.command('delete', handleDelete);
  // File handlers
  bot.on('document', handleDocument);
  bot.on('photo', handlePhoto);
  bot.on('video', handleVideo);
}; 
