import dotenv from 'dotenv';

dotenv.config();

const BotToken = process.env.BOT_TOKEN;
const BotUrl = process.env.WEBHOOK_URL;

function getFetchInstance() {
  return {
    token: BotToken,
    async get(method, params) {
      try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${BotUrl}/${method}${queryString ? '?' + queryString : ''}`;

        const response = await fetch(url);
        return response.json();
      } catch (error) {
        console.error('Error in GET request:', error);
        throw error;
      }
    },

    async post(method, data) {
      try {
        const url = `${BotUrl}/${method}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        return response.json();
      } catch (error) {
        console.error('Error in POST request:', error);
        throw error;
      }
    },
  };
}

export const fetchInstance = getFetchInstance();
