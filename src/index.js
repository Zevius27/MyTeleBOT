import { Telegraf } from 'telegraf';
import express from 'express';
import dotenv from 'dotenv';
import { registerCommands } from './commands/index.js';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());

// Register all bot commands
registerCommands(bot);

// Set webhook
app.use(bot.webhookCallback('/webhook'));
bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/webhook`);

// Start server
app.listen(port, (err) => {
  if (err) {
    console.error('Server error:', err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});

export { app };

