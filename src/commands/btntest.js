import { Markup } from 'telegraf';

const userStates = new Map();

export const handleBtnTest = async (ctx) => {
  const userId = ctx.from.id;
  userStates.set(userId, false); // Initialize state for new user

  await ctx.reply(
    'Button For Ai Img processing',
    Markup.inlineKeyboard([
      [Markup.button.callback(`Ai Image Processing : Off`, 'toggle_button')],
    ])
  );
};

export const handleToggleButton = async (ctx) => {
  const userId = ctx.from.id;
  const currentState = userStates.get(userId) || false;
  const newState = !currentState;
  userStates.set(userId, newState);

  const displayState = newState ? 'On' : 'Off';
  console.log(userStates);
  await ctx.editMessageReplyMarkup(
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          `Ai Image Processing : ${displayState}`,
          'toggle_button'
        ),
      ],
    ]).reply_markup
  );
};

export const getButtonState = (userId) => {
  return userStates.get(userId) || false;
};


