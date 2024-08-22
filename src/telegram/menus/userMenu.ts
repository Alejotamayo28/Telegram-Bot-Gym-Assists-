import { Context } from 'telegraf';
import { MAIN_MENU_FUNCTIONS_MESSAGE, MAIN_MENU_MESSAGE } from '../messages/mainMenuMessage';
import { inlineKeyboardMenu } from '../mainMenu/inlineKeyboard';

export const sendMenuFunctions = async (ctx: Context) => {
  return ctx.reply(
    MAIN_MENU_FUNCTIONS_MESSAGE,
    inlineKeyboardMenu
  );
}
