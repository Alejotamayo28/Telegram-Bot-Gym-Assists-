import { Context, Telegraf } from "telegraf";
import { regexPattern, setUpKeyboardIteration, tryCatch, verifyExerciseOutput } from "../utils";
import { ExerciseInlineKeybaord, ExerciseUpdateVerificationHandler } from "./inlineKeyboard";
import { ExerciseVerificationCallbacks } from "../addMethod/models";
import { MonthInlineKeybord } from "../../utils/monthUtils/inlineKeyboard";
import { botMessages } from "../../messages";
import { DaysInlineKeyboard } from "../../utils/daysUtils/inlineKeyboard";
import { WeekInlineKeybaord } from "../../utils/weekUtils/inlineKeyboard";
import { ExerciseQueryFetcher } from "../getMethod/queries";
import { userState } from "../../../userState";
import { MonthCallbacks } from "../../utils/monthUtils/models";
import { DaysCallbacks } from "../../utils/daysUtils/models";
import { WeekCallbacks } from "../../utils/weekUtils/models";
import { ExerciseGetUtils } from "../getMethod/functions";

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
// Change: month => day => week => mostrar opciones a actualizar
export const exerciseUpdateFlow = async (ctx: Context, bot: Telegraf) => {
  try {
    const monthKeyboard = new MonthInlineKeybord(
      botMessages.inputRequest.prompts.updateMethod.exerciseMonth)
    const daysKeyboard = new DaysInlineKeyboard(
      botMessages.inputRequest.prompts.updateMethod.exerciseDay)
    const weekKeyboard = new WeekInlineKeybaord(
      botMessages.inputRequest.prompts.updateMethod.exerciseWeek)

    const updateExerciseController = async () => {
      const data = await ExerciseQueryFetcher.ExerciseByMonthDayWeekAndId(ctx.from!.id)
      await ctx.reply(ExerciseGetUtils.mapExerciseByNameDayWeekTESTING(data, ctx, "updateMethod"), {
        parse_mode: "Markdown"
      })
      const exerciseKeyboard = new ExerciseInlineKeybaord("updateMethod",
        'Escoge el ejercicio que vas a actualizar de acuerdo a tus selecciones: ', data)
      await setUpKeyboardIteration(ctx, exerciseKeyboard, bot, {})
    }

    return await setUpKeyboardIteration(ctx, monthKeyboard, bot, {
      callbackPattern: regexPattern(MonthCallbacks),
      nextStep: async () => await setUpKeyboardIteration(ctx, daysKeyboard, bot, {
        callbackPattern: regexPattern(DaysCallbacks),
        nextStep: async () => await setUpKeyboardIteration(ctx, weekKeyboard, bot, {
          callbackPattern: regexPattern(WeekCallbacks),
          nextStep: async () => await updateExerciseController()
        })
      })
    })
  } catch (error) {
    console.error('Error: ', error)
  }
}

