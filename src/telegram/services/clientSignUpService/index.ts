import { Context, Telegraf } from "telegraf";
import { regexPattern, tryCatch } from "../utils";
import { SignUpVerificationHandler } from "./inlineKeyboard";
import { ExerciseVerificationCallbacks } from "../workoutPostService/models";

export const signUpVerificationController = async (
  ctx: Context,
  bot: Telegraf,
  passwordHash: string,
): Promise<void> => {
  const response = new SignUpVerificationHandler(ctx, passwordHash);
  try {
    const message = await response.sendCompleteMessage(ctx);
    bot.action(regexPattern(ExerciseVerificationCallbacks), async (ctx) => {
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
