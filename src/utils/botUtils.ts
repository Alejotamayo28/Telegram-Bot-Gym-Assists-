import { Context } from "telegraf";
import { saveBotMessage } from "../userState";
import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";

export class BotUtils {
  public static async sendBotMessage(
    ctx: Context,
    message: string,
    keyboard?: InlineKeyboardMarkup,
  ) {
    if (keyboard) {
      const response = await ctx.reply(message, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
      saveBotMessage(ctx, response.message_id);
    } else {
      const response = await ctx.reply(message, { parse_mode: "Markdown" });
      saveBotMessage(ctx, response.message_id);
    }
  }
}

