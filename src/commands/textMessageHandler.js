import 'dotenv/config'; // Load environment variables from .env file
import fetch from 'node-fetch';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateUsername } from '../utils/security.js';
import fs from 'fs/promises'; // Added to use fs/promises for reading the README file
import { createOperation } from './CURD/create.js';
import { readOperation } from './CURD/read.js';
import { updateOperation } from './CURD/update.js';
import { deleteOperation } from './CURD/delete.js';

// Define the handleTextMessage function
export const handleTextMessage = asyncHandler(async (ctx) => {
  const userMessage = ctx.message.text;
  const model = process.env.MODEL_NAME;

  // Get the username to locate the README file
  const rawUsername =
    ctx.message.from.username || `user_${ctx.message.from.id}`;
  const username = validateUsername(rawUsername);
  const baseDir = process.env.DOWNLOAD_BASE_PATH;
  const userDir = `${baseDir}/${username}`;
  const readmePath = `${userDir}/index.md` || `${baseDir}/index.md`; // Path to the README file

  // Read instructions from the README file
  let instructions;
  try {
    instructions = await fs.readFile(readmePath, 'utf-8');
  } catch (error) {
    console.error('Error reading README file:', error.message);
    instructions = 'Send : /start once to get started'; // Fallback instructions if the file cannot be read
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
      Authorization: `Bearer ${process.env.AI_API_KEY}`,
    };

    // Define the body of the API request as a JavaScript object
    const body = {
      model: model, // Use the correct model name with the prefix
      messages: [
        {
          role: 'system',
          content: instructions,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    };

    // Send the user message to LAMMA and fetch the response
    const aiUri = `${process.env.BASE_URL}/chat/completions`;
    const aiResponse = await fetch(aiUri, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(
        `Failed to fetch response from LAMMA. Status: ${aiResponse.status}. Details: ${errorText}`
      );
    }

    // Convert the response to JSON and extract the message content
    const responseData = await aiResponse.json();
    const aiMessage = responseData.choices[0].message.content; // Extracting the content from the response
    // Send the response back to the user

    if (aiMessage[0] === '{') {
      console.log('The response is an object:', aiMessage + '\n\n\n');
      indexCURD(ctx, aiMessage);
    } else {
      await ctx.reply(aiMessage);
    }
  } catch (error) {
    console.error('Error while communicating with AI:', error.message);
    await ctx.reply('An error occurred while processing your request.');
  }
});

// AI CURD operations
async function indexCURD(ctx, aiMessage) {
  try {
    const { operation, status, message, file } = JSON.parse(aiMessage);
    ctx.reply('Your request has been processed.');

    let result;
    switch (operation) {
      case 'create':
        result = await createOperation(ctx, file);
        break;
      case 'read':
        result = await readOperation(ctx, file);
        break;
      case 'update':
        result = await updateOperation(ctx, file);
        break;
      case 'delete':
        result = await deleteOperation(ctx, file);
        break;
      default:
        throw new Error('Invalid operation');
    }

    if (status === 'success') {
      await ctx.reply('Operation successful!');
      // Handle both single and multiple file operations
      if (Array.isArray(file)) {
        const fileNames = file.map((f) => f.name).join(', ');
        await ctx.reply(`Created files: ${fileNames}`);
      } else {
        await ctx.reply(result[2]);
      }
    } else if (status === 'pending') {
      await ctx.reply(
        'Your request is pending. Please wait for further updates.'
      );
    } else if (status === 'aborted' || status === 'error') {
      await ctx.reply('An error occurred during the operation: ' + result[2]);
    }
  } catch (error) {
    console.error('Error in CURD operation:', error.message);
    await ctx.reply('An error occurred during the operation: ' + error.message);
  }
}
