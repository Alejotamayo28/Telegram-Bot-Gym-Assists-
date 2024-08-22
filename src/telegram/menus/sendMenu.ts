import { Context } from 'telegraf';
import { MAIN_MENU_MESSAGE } from '../messages/mainMenuMessage';
import { inlineKeyboardMenu } from '../mainMenu/inlineKeyboard';


export const sendMenu = async (ctx: Context) => {
  return await ctx.reply(
    MAIN_MENU_MESSAGE,
    inlineKeyboardMenu
  );
};

