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
  // console.log('\n\n\nReceived message response:', ctx.message + '\n\n\n');
  // if (Array.isArray(ctx.message.text)) {
  //   console.log('The response is an array:', ctx.message.text + '\n\n\n');
  // } else {
  //   console.log('The response is not an array:', ctx.message.text + '\n\n\n');
  // }
  const userMessage = ctx.message.text;
  const model = process.env.MODEL_NAME;

  // Get the username to locate the README file
  const rawUsername =
    ctx.message.from.username || `user_${ctx.message.from.id}`;
  const username = validateUsername(rawUsername);
  const baseDir = process.env.DOWNLOAD_BASE_PATH;
  const userDir = `${baseDir}/${username}`;
  const readmePath = `${userDir}/index.md`; // Path to the README file

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
      Authorization: `Bearer ${process.env.LAMMA_API_KEY}`,
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

    // Print the JSON body to verify its structure
    // console.log('JSON Body:');
    // console.log(JSON.stringify(body, null, 2));

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
    // console.log('Response Content:');
    // console.log(lammaMessage);

    // Send the response back to the user

    if (lammaMessage[0] === '{') {
      console.log('The response is an object:', lammaMessage + '\n\n\n');
      // const responseArray = JSON.parse(lammaMessage); // Parse the JSON string into an array
      // console.log('Extracted Array:', responseArray); // Log the extracted array separately
      // await ctx.reply(responseArray + '\n\n\n'); // Send the array to the user
      // await ctx.reply(responseArray[2]); // Send the response to the user
      indexCURD(ctx, lammaMessage);
      
    } else {
      console.log('Baigan');
      await ctx.reply(lammaMessage);
      // await ctx.reply(`\n\n\n\n`+lammaMessage[0]);
    }
  } catch (error) {
    console.error('Error while communicating with LAMMA:', error.message);
    await ctx.reply('An error occurred while processing your request.');
  }
});





// AI CURD operations
async function indexCURD(ctx, lammaMessage) {
  let result;
  const { operation, status, message, file } = JSON.parse(lammaMessage);
  try {
    ctx.reply('Your request is being processed.');
    switch (operation) {
      case 'create':
        result = await createOperation(ctx, file);// Is in create.js
        await ctx.reply(result[2]);
        await ctx.reply(lammaMessage);
        break;
      case 'read':
        result = await readOperation(ctx, file); // Is in read.js 
        await ctx.reply(result[2]);
        await ctx.reply(lammaMessage); 
        break;
      case 'update':
        result = await updateOperation(ctx, file); // Is in update.js
        await ctx.reply(result[2]);
        await ctx.reply(lammaMessage);
        break;
      case 'delete':
        result = await deleteOperation(ctx,file); // Is in delete.js
        await ctx.reply(result[2]);
        await ctx.reply(lammaMessage);
        break;
      default:
        throw new Error('Invalid operation');
    }
    if (status === 'success') {
      await ctx.reply('Operation successful!');
      await ctx.reply(result[2]); // Send the response back to the user
    } else if (status === 'pending') {
      await ctx.reply('Your request is pending. Please wait for further updates.');
    } else if (status === 'aborted' || status === 'error') {
      await ctx.reply('An error occurred during the operation: ' + result[2]);
    }
    // console.log(result);
  } catch (error) {
    console.error('Error in CURD operation:', error.message);
    await ctx.reply('An error occurred during the operation: ' + error.message);
  }
}
