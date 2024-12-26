import 'dotenv/config';  // Load environment variables from .env file
import fetch from 'node-fetch';
import { asyncHandler } from '../utils/asyncHandler.js';

export const handleFetchModels = asyncHandler(async (ctx) => {
   try {
      const headers = {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${process.env.LAMMA_API_KEY}`
      };

      const uri = `${process.env.LAMMA_URI}/models`;

      const response = await fetch(uri, {
         method: 'GET',
         headers: headers
      });

      if (!response.ok) {
         const errorText = await response.text();
         throw new Error(`Failed to fetch models. Status: ${response.status}. Details: ${errorText}`);
      }

      const models = await response.json();
      console.log(models);

      // Create a readable string from the models
      const modelList = models.data.map(model => `<code>${model.id}</code>`).join('\n');
      await ctx.reply(`Available Models:\n${modelList}\n\nYou can send me a model name to use it.`, { parse_mode: 'HTML' });
   } catch (error) {
      console.error('Error while fetching available models:', error.message);
      await ctx.reply('An error occurred while fetching available models. Please try again later.');
   }
}); 