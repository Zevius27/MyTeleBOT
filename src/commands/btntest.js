import { Markup } from 'telegraf';

const userStates = new Map(); // Use Map for user states

export const handleBtnTest = async (ctx) => {
  const userId = ctx.from.id;
  userStates.set(userId, false); // Initialize state for new user
  console.log("first state",userStates);
  try {
    await ctx.reply(
      'Button For AI Image Processing',
      Markup.inlineKeyboard([
        [Markup.button.callback(`AI Image Processing: Off`, 'toggle_button')],
      ])
    );
  } catch (error) {
    console.error('Error sending reply:', error); // Error handling
  }
};

export const handleToggleButton = async (ctx) => {
  const userId = ctx.from.id;
  const currentState = userStates.get(userId) || false; // Get current state
  userStates.set(userId, !currentState); // Toggle state
  const displayState = userStates.get(userId) ? 'On' : 'Off'; // Determine display state
  console.log(userStates);

  // Prepare new reply markup
  const newReplyMarkup = Markup.inlineKeyboard([
    [
      Markup.button.callback(
        `AI Image Processing: ${displayState}`,
        'toggle_button'
      ),
    ],
  ]).reply_markup;

  // Check if the new state is different before editing the message
  try {
    // Compare current reply markup with new reply markup
    if (JSON.stringify(newReplyMarkup) !== JSON.stringify(ctx.callbackQuery.message.reply_markup)) {
      await ctx.editMessageReplyMarkup(newReplyMarkup);
    }
  } catch (error) {
    console.error('Error editing message:', error); // Error handling
  }
};

export async function getButtonState(ctx, userId = 1208927174) {
  const isProcessing = userStates.get(userId);
  if (isProcessing === undefined) {
    userStates.set(userId, false); // Initialize state for new user
  }
  const stateMessage = isProcessing ? `Image processing is on` : `Image processing is off `;
  console.log(stateMessage);
  await ctx.reply(stateMessage);
  return isProcessing;
};
