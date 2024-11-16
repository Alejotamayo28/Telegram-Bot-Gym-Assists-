import { Context, Telegraf } from "telegraf"; import { regexPattern, tryCatch } from "../utils";
import { ExercisePostVerificationHandler } from "./inlineKeyboard";
import { ExerciseVerificationCallbacks } from "./models";

export const PostExerciseVerificationController = async (ctx: Context, bot: Telegraf) => {
  const response = new ExercisePostVerificationHandler(ctx)
  try {
    const message = await response.sendCompleteMessage(ctx)
    bot.action(regexPattern(ExerciseVerificationCallbacks), async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => response.handleOptions(ctx, message, action), ctx) })
  } catch (error) {
    console.error(`Error: `, error)
  }
}



