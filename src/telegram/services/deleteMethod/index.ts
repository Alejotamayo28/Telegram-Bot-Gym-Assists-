import { Context, Telegraf } from "telegraf";
import { regexPattern, tryCatch } from "../utils";
import { ExerciseDeleteVerificationHandler } from "./inlineKeyboard";
import { ExerciseVerificationCallbacks } from "../addMethod/models";
import { userState } from "../../../userState";

export const deleteExerciseVerificationController = async (ctx: Context, bot: Telegraf) => {
  const response = new ExerciseDeleteVerificationHandler(ctx)
  await ctx.deleteMessage()
  try {
    const message = await response.sendCompleteMessage(ctx)
    bot.action(regexPattern(ExerciseVerificationCallbacks), async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => response.handleOptions(ctx, message, action, bot), ctx)
    })
  } catch (error) {
    console.error(`Error`, error)
  }
}

