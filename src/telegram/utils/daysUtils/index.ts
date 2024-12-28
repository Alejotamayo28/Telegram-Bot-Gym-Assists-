import { Context, Telegraf } from "telegraf";
import { DaysInlineKeyboard } from "./inlineKeyboard";
import { saveBotMessage } from "../../../userState";
import { regexPattern, tryCatch } from "../../services/utils";
import { DaysCallbacks } from "./models";

export const daysInlineKeyboardController = async (ctx: Context, bot: Telegraf): Promise<any> => {
  const response = new DaysInlineKeyboard()
  try {
    const message = await response.sendCompleteMessage(ctx)
    saveBotMessage(ctx, message.message_id)
    bot.action(regexPattern(DaysCallbacks), async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => response.handleOptions(ctx, message, action, bot), ctx)
    })

  } catch (error) {
    console.error(`Error: `, error)
  }
}
