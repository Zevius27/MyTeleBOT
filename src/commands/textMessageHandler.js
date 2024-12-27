import 'dotenv/config'; // Load environment variables from .env file
import fetch from 'node-fetch';
import { asyncHandler } from '../utils/asyncHandler.js';
import fs from 'fs/promises'; // Import fs/promises for async file operations
import path from 'path';
import { validateUsername } from '../utils/security.js';


// Define the handleTextMessage function
export const handleTextMessage = asyncHandler(async (ctx) => {
  const userMessage = ctx.message.text;
  const model = process.env.MODEL_NAME;

  // Read content from index.md
  const rawUsername = ctx.message.from.username || `user_${ctx.message.from.id}`;
  const baseDir = process.env.DOWNLOAD_BASE_PATH;
  const userDirPath = path.join(baseDir, validateUsername(rawUsername));
  const indexFilePath = path.join(userDirPath, 'index.md');

  let contentInstructions = '';

  try {
    contentInstructions = await fs.readFile(indexFilePath, 'utf-8');
  } catch (error) {
    console.error('Failed to read index.md:', error);
    await ctx.reply('Could not read instructions. Please try again later.');
    return;
  }

  // Check if the message is a text message
  if (!userMessage) {
    await ctx.reply('Please send a valid text message.');
    return;
  }

  try {
    // Define the headers for the API request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.LAMMA_API_KEY}`,
    };

    // Define the body of the API request as a JavaScript object
    const body = {
      model: model, // Use the correct model name with the prefix
      messages: [
        {
          role: 'system',
          content: contentInstructions, // Use the content from index.md
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    };

    // Print the JSON body to verify its structure
    console.log('JSON Body:');
    console.log(JSON.stringify(body, null, 2));

    // Send the user message to LAMMA and fetch the response
    const lammaUri = `${process.env.LAMMA_URI}/chat/completions`;
    const lammaResponse = await fetch(lammaUri, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!lammaResponse.ok) {
      const errorText = await lammaResponse.text();
      throw new Error(
        `Failed to fetch response from LAMMA. Status: ${lammaResponse.status}. Details: ${errorText}`
      );
    }

    // Convert the response to JSON and extract the message content
    const responseData = await lammaResponse.json();
    const lammaMessage = responseData.choices[0].message.content; // Extracting the content from the response
    console.log('Response Content:');
    console.log(lammaMessage);

    // Send the response back to the user
    await ctx.reply(lammaMessage);
  } catch (error) {
    console.error('Error while communicating with LAMMA:', error.message);
    await ctx.reply('An error occurred while processing your request.');
  }
});
