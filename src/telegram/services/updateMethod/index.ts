import { Context, Telegraf } from "telegraf";
import { regexPattern, tryCatch, verifyExerciseOutput } from "../utils";
import { ExerciseUpdateVerificationHandler } from "./inlineKeyboard";
import { ExerciseVerificationCallbacks } from "../addMethod/models";
import { MonthInlineKeybord } from "../../utils/monthUtils/inlineKeyboard";
import { botMessages } from "../../messages";
import { DaysInlineKeyboard } from "../../utils/daysUtils/inlineKeyboard";
import { WeekInlineKeybaord } from "../../utils/weekUtils/inlineKeyboard";

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

// Flow: day => name (INCORRECT)
// Change: month => day => week => mostrar opciones a actualizar

export const exerciseUpdateFlow = async (ctx: Context, bot: Telegraf) => {
  try {
    const monthKeyboard = new MonthInlineKeybord(
      botMessages.inputRequest.prompts.updateMethod.exerciseMonth)
    const dayKeyboard = new DaysInlineKeyboard(
      botMessages.inputRequest.prompts.updateMethod.exerciseDay)
const weekKeyboard = new WeekInlineKeybaord(
    botMessages.inputRequest.prompts.updateMethod.

  } catch (error) {

  }
}

