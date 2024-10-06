import { Context } from 'telegraf';
import { MAIN_MENU_FUNCTIONS_MESSAGE } from '../messages/mainMenuMessage';
import { inlineKeyboardMenu } from '../mainMenu/inlineKeyboard';

export const sendMenuFunctions = async (ctx: Context) => {
  return ctx.reply(
    MAIN_MENU_FUNCTIONS_MESSAGE, {
    parse_mode: "Markdown",
    reply_markup: inlineKeyboardMenu.reply_markup
  }
  );
}
