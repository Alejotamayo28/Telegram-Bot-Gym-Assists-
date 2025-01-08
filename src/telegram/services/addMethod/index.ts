import { Context, Telegraf } from "telegraf";
import { handleKeyboardStep, regexPattern, tryCatch } from "../utils";
import { ExercisePostVerificationHandler } from "./inlineKeyboard";
import { ExerciseVerificationCallbacks } from "./models";
import { saveBotMessage, userStagePostExercise, userStateUpdateStage } from "../../../userState";
import { DaysInlineKeyboard } from "../../utils/daysUtils/inlineKeyboard";
import { botMessages } from "../../messages";
import { DaysCallbacks } from "../../utils/daysUtils/models";
import { BotUtils } from "../singUp/functions";

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

export const exercisePostFlow = async (ctx: Context, bot: Telegraf) => {
  try {
    const daysKeyboard = new DaysInlineKeyboard(
      botMessages.inputRequest.prompts.postMethod.exerciseDay)
    const postExerciseController = async () => {
      await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.postMethod.exerciseName)
      userStateUpdateStage(ctx, userStagePostExercise.POST_EXERCISE_NAME)
    }
    //Flow
    await handleKeyboardStep(ctx, daysKeyboard, bot, regexPattern(DaysCallbacks), postExerciseController)
  } catch (error) {
    console.error(`Error: `, error)
  }
}

