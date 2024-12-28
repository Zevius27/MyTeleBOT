import { ImageAnnotatorClient } from '@google-cloud/vision';
import path from 'path';
import fs from 'fs/promises';
import { validateUsername } from '../utils/security.js';
import { handleTextMessage } from './textMessageHandler.js';

// Set the environment variable for authentication
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
  './config/xevis-vision-api.json'
);

export async function detectText(ctx, imagePath) {
  const client = new ImageAnnotatorClient();

  try {
    // Get user directory
    const rawUsername = ctx.message.from.username || `user_${ctx.message.from.id}`;
    const username = validateUsername(rawUsername);
    const baseDir = process.env.DOWNLOAD_BASE_PATH;
    const userDir = `${baseDir}/${username}`;

    // Perform text detection on the image
    const [result] = await client.textDetection(imagePath);
    const textAnnotations = result.textAnnotations;

    if (textAnnotations && textAnnotations.length > 0) {
      const fullText = textAnnotations[0].description;
      const words = textAnnotations.slice(1).map((annotation) => ({
        text: annotation.description,
        boundingBox: annotation.boundingPoly.vertices.map((v) => ({
          x: v.x,
          y: v.y,
        })),
      }));

      const textAnalysis = {
        fullText,
        words,
      };

      // Create analysis filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const analysisFilename = `text_analysis_${timestamp}.json`;
      const analysisPath = path.join(userDir, analysisFilename);

      // Save analysis to file
      await fs.writeFile(analysisPath, JSON.stringify(textAnalysis, null, 2));

      // Send to AI for processing
      await ctx.reply('Processing detected text from image...');

      // Process with AI using image context
      await handleTextMessage(ctx, {
        type: 'image_text',
        content: fullText,
      //   metadata: {
      //     source: 'image_analysis',
      //     filename: analysisFilename,
      //     timestamp: timestamp,
      //     wordCount: words.length
      //   },
        usrmsg:ctx.message.text
      });

      return textAnalysis;
    } else {
      console.log('No text detected in the provided image.');
      await ctx.reply('No text detected in the provided image.');
      return { fullText: '', words: [] };
    }
  } catch (err) {
    console.error('Error detecting text:', err);
    await ctx.reply('Error processing image text. Please try again.');
    throw err;
  }
}

// Call the function with an image file path
// detectText('./photos/Screenshot (14).png'); // Replace with the path to your image file









/// the full text variable has better text written