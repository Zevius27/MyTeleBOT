import { ImageAnnotatorClient } from '@google-cloud/vision';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { handleTextMessage } from './textMessageHandler.js';
dotenv.config();

// Set the environment variable for authentication
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
  './config/xevis-vision-api.json'
);

export async function detectText(ctx, imagePath) {
  // Initialize the Vision API client
  const client = new ImageAnnotatorClient();

  try {
    // Perform text detection on the image
    const [result] = await client.textDetection(imagePath);
    const textAnnotations = result.textAnnotations;

    if (textAnnotations && textAnnotations.length > 0) {
      // Extract the full text and individual word details
      const fullText = textAnnotations[0].description; // Full extracted text
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

      // console.log(
      //   'Structured Text Analysis:',
      //   JSON.stringify(textAnalysis, null, 2)
      // );

      // Write text analysis to file at same location as image
      // const analysisPath = imagePath.replace(/\.[^.]+$/, '_analysis.json');
      fs.writeFileSync(imagePath, JSON.stringify(textAnalysis, null, 2));

      // Create a file with the text analysis data
      const fileData = {
        operation: 'create',
        status: 'success',
        message: 'Created file with extracted text from image',
        file: {
          name: 'extracted_text.json',
          content: JSON.stringify(textAnalysis, null, 2),
          type: 'json',
          path: imagePath,
        },
      };
      
      return textAnalysis; // Return data for further AI processing
    } else {
      console.log('No text detected in the provided image.');
      return { fullText: '', words: [] };
    }
  } catch (err) {
    console.error('Error detecting text:', err);
    throw err;
  }
}

// Call the function with an image file path
// detectText('./photos/Screenshot (14).png'); // Replace with the path to your image file
