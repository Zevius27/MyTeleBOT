import fs from 'fs';
import fetch from 'node-fetch'; // TBot/Controller/lib/Telegram.js
import { fetchInstance } from './fetch.js';
import dotenv from 'dotenv';

dotenv.config();

async function SendMessage(messageObj, text) {
  try {
    const chatId = messageObj.chat.id;
    const response = await fetchInstance.get('sendMessage', {
      chat_id: chatId,
      text: text,
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

async function HandleMessage(messageObj) {
  try {
    // Handle text messages
    if (messageObj.text) {
      const messageText = messageObj.text;
      console.log('Received message:', messageText);

      if (messageText[0] === '/') {
        const command = messageText.substring(1);
        switch (command) {
          case 'start':
            return await SendMessage(
              messageObj,
              'Hello, Welcome to the bot created by Zevius \n Refer to /help for more information'
            );
          case 'help':
            return await SendMessage(
              messageObj,
              'Available commands:\n/start - Start the bot\n/help - Show this message\n/test - Test command   \n *   The bot has Capabilities to download files and photos from telegram and save them in our personal server we use \n *    Try sending A Document or a photo In your Chat. \n *    Speed is on llimt of 1MB ps so please be patient for larger files'
            );
          case 'test':
            return await SendMessage(messageObj, 'Test command executed');

          default:
            return await SendMessage(messageObj, 'Command not found');
        }
      }
    }
    // Handle documents/files
    else if (messageObj.document) {
      return await HandleDocument(messageObj);
    }
    // Handle photos
    else if (messageObj.photo) {
      return await HandlePhoto(messageObj);
    } else if (messageObj.video) {
      return await HandleVideo(messageObj);
    }
  } catch (error) {
    console.error('Error handling message:', error);
    return await SendMessage(
      messageObj,
      'Sorry, an error occurred while processing your request'
    );
  }
}

// Add this helper function at the top of the file
function ensureUserDirectory(username) {
  const baseDir = process.env.DOWNLOAD_BASE_PATH;
  const userDir = `${baseDir}/${username}`;

  // Create base downloads directory if it doesn't exist
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
  }

  // Create user-specific directory if it doesn't exist
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir);
  }
  console.log('User directory created:', userDir);
  return userDir;
}

async function HandleDocument(messageObj) {
  try {
    const file = messageObj.document;
    const fileId = file.file_id;
    const username = messageObj.from.username || `user_${messageObj.from.id}`;

    // Get file info from Telegram
    const fileInfo = await fetchInstance.get('getFile', { file_id: fileId });
    if (fileInfo.ok) {
      await SendMessage(messageObj, 'File information received');
    }

    if (!fileInfo.ok) {
      return await SendMessage(messageObj, 'Failed to get file information');
    }

    // Download the file
    const filePath = fileInfo.result.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${fetchInstance.token}/${filePath}`;

    // Create user-specific directory
    const userDir = ensureUserDirectory(username);

    // Save the file
    const response = await fetch(fileUrl);
    const buffer = await response.arrayBuffer().then(Buffer.from);
    const fileName = file.file_name || `file_${Date.now()}`;
    fs.writeFileSync(`${userDir}/${fileName}`, buffer);

    return await SendMessage(
      messageObj,
      `File saved successfully in your personal folder as ${fileName}`
    );
  } catch (error) {
    console.error('Error handling document:', error);
    return await SendMessage(messageObj, 'Error saving file');
  }
}

async function HandlePhoto(messageObj) {
  try {
    const photo = messageObj.photo[messageObj.photo.length - 1];
    const fileId = photo.file_id;
    const username = messageObj.from.username || `user_${messageObj.from.id}`;

    // Get file info from Telegram
    const fileInfo = await fetchInstance.get('getFile', { file_id: fileId });
    if (fileInfo.ok) {
      await SendMessage(messageObj, 'Photo information received');
    }

    if (!fileInfo.ok) {
      return await SendMessage(messageObj, 'Failed to get photo information');
    }

    // Download the photo
    const filePath = fileInfo.result.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${fetchInstance.token}/${filePath}`;

    // Create user-specific directory
    const userDir = ensureUserDirectory(username);

    // Save the photo
    const response = await fetch(fileUrl);
    const buffer = await response.arrayBuffer().then(Buffer.from);
    const fileName = `photo_${messageObj.from.username}-${Date.now()}.jpg`;
    fs.writeFileSync(`${userDir}/${fileName}`, buffer);

    console.log(`Photo saved successfully as ${fileName} for user ${username}`);
    return await SendMessage(
      messageObj,
      `Photo saved successfully in your personal folder as ${fileName}`
    );
  } catch (error) {
    console.error('Error handling photo:', error);
    return await SendMessage(messageObj, 'Error saving photo');
  }
}

async function HandleVideo(messageObj) {
  try {
    const video = messageObj.video;
    const fileId = video.file_id;
    const username = messageObj.from.username || `user_${messageObj.from.id}`;
    const fileInfo = await fetchInstance.get('getFile', { file_id: fileId });
    if (fileInfo.ok) {
      await SendMessage(messageObj, 'Video information received');
    }
    if (!fileInfo.ok) {
      return await SendMessage(messageObj, 'Failed to get video information');
    }
    const filePath = fileInfo.result.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${fetchInstance.token}/${filePath}`;
    const userDir = ensureUserDirectory(username);
    const response = await fetch(fileUrl);
    const buffer = await response.arrayBuffer().then(Buffer.from);
    const fileName = `video_${messageObj.from.username}-${Date.now()}.mp4`;
    fs.writeFileSync(`${userDir}/${fileName}`, buffer);

    console.log(`Video saved successfully as ${fileName} for user ${username}`);
    return await SendMessage(
      messageObj,
      `Video saved successfully in your personal folder as ${fileName}`
    );
  } catch (error) {
    console.error('Error handling video:', error);
    return await SendMessage(messageObj, 'Error saving video');
  }
}

export { HandleMessage };
