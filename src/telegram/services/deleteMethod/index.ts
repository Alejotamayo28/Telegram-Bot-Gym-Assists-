import { Context, Telegraf } from "telegraf";
import { regexPattern, tryCatch } from "../utils";
import { ExerciseDeleteVerificationHandler } from "./inlineKeyboard";
import { ExerciseVerificationCallbacks } from "../addMethod/models";
import { deleteBotMessage, saveBotMessage } from "../../../userState";

export const deleteExerciseVerificationController = async (ctx: Context, bot: Telegraf) => {
  const response = new ExerciseDeleteVerificationHandler(ctx)
  try {
    const message = await response.sendCompleteMessage(ctx)
    saveBotMessage(ctx, message.message_id)
    bot.action(regexPattern(ExerciseVerificationCallbacks), async (ctx) => {
      await deleteBotMessage(ctx)
      const action = ctx.match[0]
      await tryCatch(() => response.handleOptions(ctx, message, action, bot), ctx)
    })
  } catch (error) {
    console.error(`Error`, error)
  }
}

