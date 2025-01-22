import { Context, Telegraf } from "telegraf";
import { regexPattern, tryCatch } from "../utils";
import { ConfirmationMenuModel } from "../../../model/confirmationMenuModel";
import { ExerciseUpdateConfirmInlineKeybaord } from "./inlineKeyboard/ExerciseUpdateInlineKeyboard";

export const UpdateExerciseVerificationController = async (
  ctx: Context,
  bot: Telegraf,
) => {
  const response = new ExerciseUpdateConfirmInlineKeybaord(ctx);
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

