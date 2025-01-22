import { Context, Telegraf } from "telegraf";
import { regexPattern, tryCatch } from "../utils";
import { ConfirmationMenuModel } from "../../../model/confirmationMenuModel";
import { deleteBotMessage, saveBotMessage } from "../../../userState";
import { ExerciseDeleteConfirmInlineKeyboard } from "./inlineKeyboard/ExerciseDeleteInlineKeyboard";

export const deleteExerciseVerificationController = async (
  ctx: Context,
  bot: Telegraf,
) => {
  const response = new ExerciseDeleteConfirmInlineKeyboard(ctx);
  try {
    const message = await response.sendCompleteMessage(ctx);
    saveBotMessage(ctx, message.message_id);
    bot.action(regexPattern(ConfirmationMenuModel.Callback), async (ctx) => {
      await deleteBotMessage(ctx);
      const action = ctx.match[0];
      await tryCatch(
        () => response.handleOptions(ctx, message, action, bot),
        ctx,
      );
    });
  } catch (error) {
    console.error(`Error`, error);
  }
};
