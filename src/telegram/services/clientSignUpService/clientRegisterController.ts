import { Context, Telegraf } from "telegraf";
import { regexPattern, tryCatch } from "../utils";
import { ConfirmationMenuModel } from "../../../model/confirmationMenuModel";
import { RegisterConfirmInlineKeyboard } from "./inlineKeyboard/ClientRegisterInlineKeyboard";

export const signUpVerificationController = async (
  ctx: Context,
  bot: Telegraf,
  passwordHash: string,
): Promise<void> => {
  const response = new RegisterConfirmInlineKeyboard(ctx, passwordHash);
  try {
    const message = await response.sendCompleteMessage(ctx);
    bot.action(regexPattern(ConfirmationMenuModel.Callback), async (ctx) => {
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
