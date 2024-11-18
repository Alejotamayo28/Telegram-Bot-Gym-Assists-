import { Context, Telegraf } from "telegraf";
import { regexPattern, tryCatch, verifyExerciseOutput } from "../utils";
import { ExerciseUpdateVerificationHandler } from "./inlineKeyboard";
import { ExerciseVerificationCallbacks } from "../addMethod/models";


export const UpdateExerciseVerificationController = async (ctx: Context, bot: Telegraf) => {
  const response = new ExerciseUpdateVerificationHandler(ctx)
  try {
    const message = await response.sendCompleteMessage(ctx)
    bot.action(regexPattern(ExerciseVerificationCallbacks), async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => response.handleOptions(ctx, message, action, bot), ctx)
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}


