import { Context } from "telegraf";
import { MENU_SPLIT_MESSAGE } from "../messages/menuSplitMessage";
import { splitsButton } from "../inlineKeyboard/splitWorkoutMenu";

export const sendSplitMenu = async (ctx: Context) => {
  return await ctx.reply(
    MENU_SPLIT_MESSAGE,
    splitsButton
  )
}
