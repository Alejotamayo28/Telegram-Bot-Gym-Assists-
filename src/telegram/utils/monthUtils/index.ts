import { Context, Telegraf } from "telegraf";
import { MonthInlineKeybord } from "./inlineKeyboard";
import { regexPattern, tryCatch } from "../../services/utils";
import { saveBotMessage } from "../../../userState";
import { MonthCallbacks } from "./models";

export const monthInlineKeyboardController = async (
  ctx: Context,
  bot: Telegraf,
  nextKeyboard: () => Promise<any>,
) => {
  const response = new MonthInlineKeybord();
  try {
    const message = await response.sendCompleteMessage(ctx);
    saveBotMessage(ctx, message.message_id);
    bot.action(regexPattern(MonthCallbacks), async (ctx) => {
      const action = ctx.match[0];
      await tryCatch(
        () => response.handleOptions(ctx, message, action, bot),
        ctx,
      );
    });
  } catch (error) {
    console.error(`Erorr `, error);
  }
};
