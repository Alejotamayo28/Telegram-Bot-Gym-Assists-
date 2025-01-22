import { Context, Telegraf } from "telegraf";
import { regexPattern, tryCatch } from "../../utils";
import { saveBotMessage } from "../../../../userState";
import { mainMenuModel } from "../../../../model/mainMenuModel";
import { MainMenuHandler } from "./MainMenuInlineKeyboard";

export const mainMenuPage = async (
  ctx: Context,
  bot: Telegraf,
  message?: string,
): Promise<void> => {
  const response = new MainMenuHandler(message);
  try {
    const message = await response.sendCompleteMessage(ctx);
    saveBotMessage(ctx, message.message_id);
    bot.action(regexPattern(mainMenuModel.Callback), async (ctx) => {
      const action = ctx.match[0];
      await tryCatch(
        () => response.handleOptions(ctx, message, action, bot),
        ctx,
      );
    });
  } catch (error) {
    console.error(`Error: `, error);
  }
};
