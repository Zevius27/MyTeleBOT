import { ImageAnnotatorClient } from '@google-cloud/vision';
import path from 'path';

// Set the environment variable for authentication
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
    './config/xevis-vision-api.json'
);

async function detectText(imagePath) {
    // Initialize the Vision API client
    const client = new ImageAnnotatorClient();

    try {
        // Perform text detection on the image
        const [result] = await client.textDetection(imagePath);
        const textAnnotations = result.textAnnotations;

        if (textAnnotations && textAnnotations.length > 0) {
            // Extract the full text and individual word details
            const fullText = textAnnotations[0].description; // Full extracted text
            const words = textAnnotations.slice(1).map(annotation => ({
                text: annotation.description,
                boundingBox: annotation.boundingPoly.vertices.map(v => ({ x: v.x, y: v.y }))
            }));

            const textAnalysis = {
                fullText,
                words
            };

            console.log('Structured Text Analysis:', JSON.stringify(textAnalysis, null, 2));

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
detectText('./photos/Screenshot (14).png'); // Replace with the path to your image file
