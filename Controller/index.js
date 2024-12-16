import { HandleMessage } from './lib/Telegram.js';
// TBot/Controller/index.js
const Handler = async (req, method) => {
  // let messageObj = req.body.message;
  if (!req.body) {
    console.log('No body exists');
    return; // Add early return if no body exists
  }

  if (req.body.message) {
    HandleMessage(req.body.message);
  }
};

export { Handler };
