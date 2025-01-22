import { Context, Telegraf } from "telegraf";
import { regexPattern, tryCatch } from "../utils";
import { ExercisePostView } from "../../../model/exerciseFetchModel";
import { ExerciseViewInlineKeyboard } from "./inlineKeyboard/ExerciseFetchInlineKeyboard";
import { saveBotMessage } from "../../../userState";

export const fetchExerciseController = async (ctx: Context, bot: Telegraf) => {
  const response = new ExerciseViewInlineKeyboard(ctx);
  try {
    const message = await response.sendCompleteMessage(ctx);
    saveBotMessage(ctx, message.message_id);
    bot.action(regexPattern(ExercisePostView.Callback), async (ctx) => {
      const action = ctx.match[0];
      await tryCatch(
        () => response.handleOptions(ctx, message, action, bot),
        ctx,
      );
    });
  } catch (error) {
    console.error(`Error in handleGetExerciseOptions : `, error);
  }
};

