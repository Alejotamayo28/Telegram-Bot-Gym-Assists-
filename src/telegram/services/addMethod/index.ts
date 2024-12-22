import { Context, Telegraf } from "telegraf"; import { regexPattern, tryCatch } from "../utils";
import { ExercisePostVerificationHandler } from "./inlineKeyboard";
import { ExerciseVerificationCallbacks } from "./models";
import { saveBotMessage } from "../../../userState";

export const PostExerciseVerificationController = async (ctx: Context, bot: Telegraf) => {
  const response = new ExercisePostVerificationHandler(ctx)
  try {
    const message = await response.sendCompleteMessage(ctx)
    saveBotMessage(ctx, message.message_id)
    bot.action(regexPattern(ExerciseVerificationCallbacks), async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => response.handleOptions(ctx, message, action, bot), ctx)
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}



