import { Context, Telegraf } from "telegraf";
import { regexPattern, setUpKeyboardIteration, tryCatch } from "../utils";
import { ExercisePostVerificationHandler } from "./inlineKeyboard";
import { ExerciseVerificationCallbacks } from "./models";
import { BotStage, saveBotMessage, updateUserStage, userStagePostExercise, userStateUpdateStage } from "../../../userState";
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
    const postExerciseController = async (): Promise<void> => {
      await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.postMethod.exerciseName)
      return updateUserStage(ctx.from!.id, BotStage.Exercise.CREATE_NAME)
    }
    await setUpKeyboardIteration(ctx, daysKeyboard, bot, { callbackPattern: regexPattern(DaysCallbacks), nextStep: async () => await postExerciseController() })
  } catch (error) {
    console.error(`Error: `, error)
  }
}

