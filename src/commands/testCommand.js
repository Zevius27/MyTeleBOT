import { getButtonState } from "./btntest.js";


export const handleTest = async (ctx) => {
  await ctx.reply('Bot is up and running! ✅');
  await ctx.reply(`Model is ${process.env.MODEL_NAME}`);
  await getButtonState(ctx);
}; 