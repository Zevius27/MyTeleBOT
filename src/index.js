import { Telegraf } from 'telegraf';
import express from 'express';
import dotenv from 'dotenv';
import { registerCommands } from './commands/index.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Add security headers
app.use(helmet());

// Add this line before setting up the rate limiter
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

// Basic routes
app.get('/', (req, res) => {
  console.log('GET request received');
  console.log(req.body);
  res.send('Welcome to the Telegram Bot API');
});

app.post('/', (req, res) => {
  console.log('POST request received');
  console.log(req.body);
  res.json({ message: 'POST request received successfully' });
});

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
