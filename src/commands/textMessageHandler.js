import 'dotenv/config'; // Load environment variables from .env file
import fetch from 'node-fetch';
import { asyncHandler } from '../utils/asyncHandler.js';

// Define the handleTextMessage function
export const handleTextMessage = asyncHandler(async (ctx) => {
  const userMessage = ctx.message.text;
  let model;

  const selectModel = async (userMessage) => {
    let model; // Declare model variable
    switch(userMessage) {
      case 'hf:Qwen/Qwen2.5-Coder-32B-Instruct':
        model = 'hf:Qwen/Qwen2.5-Coder-32B-Instruct';
        break;
      case 'hf:Qwen/Qwen2.5-72B-Instruct':
        model = 'hf:Qwen/Qwen2.5-72B-Instruct';
        break;
      case 'hf:meta-llama/Llama-3.1-405B-Instruct':
        model = 'hf:meta-llama/Llama-3.1-405B-Instruct';
        break;
      case 'hf:mistralai/Mistral-7B-Instruct-v0.3':
        model = 'hf:mistralai/Mistral-7B-Instruct-v0.3';
        break;
      case 'hf:huihui-ai/Llama-3.3-70B-Instruct-abliterated':
        model = 'hf:huihui-ai/Llama-3.3-70B-Instruct-abliterated';
        break;
      case 'hf:meta-llama/Llama-3.1-70B-Instruct':
        model = 'hf:meta-llama/Llama-3.1-70B-Instruct';
        break;
      case 'hf:meta-llama/Llama-3.1-8B-Instruct':
        model = 'hf:meta-llama/Llama-3.1-8B-Instruct';
        break;
      case 'hf:meta-llama/Llama-3.2-3B-Instruct':
        model = 'hf:meta-llama/Llama-3.2-3B-Instruct';
        break;
      case 'hf:meta-llama/Llama-3.2-11B-Vision-Instruct':
        model = 'hf:meta-llama/Llama-3.2-11B-Vision-Instruct';
        break;
      case 'hf:meta-llama/Llama-3.2-90B-Vision-Instruct':
        model = 'hf:meta-llama/Llama-3.2-90B-Vision-Instruct';
        break;
      case 'hf:meta-llama/Llama-3.3-70B-Instruct':
        model = 'hf:meta-llama/Llama-3.3-70B-Instruct';
        break;
      case 'hf:google/gemma-2-9b-it':
        model = 'hf:google/gemma-2-9b-it';
        break;
      case 'hf:google/gemma-2-27b-it':
        model = 'hf:google/gemma-2-27b-it';
        break;
      case 'hf:mistralai/Mixtral-8x7B-Instruct-v0.1':
        model = 'hf:mistralai/Mixtral-8x7B-Instruct-v0.1';
        break;
      case 'hf:mistralai/Mixtral-8x22B-Instruct-v0.1':
        model = 'hf:mistralai/Mixtral-8x22B-Instruct-v0.1';
        break;
      case 'hf:NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO':
        model = 'hf:NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO';
        break;
      case 'hf:Qwen/Qwen2.5-7B-Instruct':
        model = 'hf:Qwen/Qwen2.5-7B-Instruct';
        break;
      case 'hf:upstage/SOLAR-10.7B-Instruct-v1.0':
        model = 'hf:upstage/SOLAR-10.7B-Instruct-v1.0';
        break;
      case 'hf:nvidia/Llama-3.1-Nemotron-70B-Instruct-HF':
        model = 'hf:nvidia/Llama-3.1-Nemotron-70B-Instruct-HF';
        break;
      default:
        model = 'hf:meta-llama/Llama-3.1-405B-Instruct'; // Default model
    }
    await ctx.reply(`Model selected: ${model}`);
    return model;
  };

  model = await selectModel(userMessage);

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
          content: 'You are a test assistant.',
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
