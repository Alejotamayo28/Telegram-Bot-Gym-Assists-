import { Context, Telegraf } from "telegraf";
import { FamilyType, regexPattern, setUpKeyboardIteration, tryCatch } from "../utils";
import { ExerciseDeleteVerificationHandler } from "./inlineKeyboard";
import { ExerciseVerificationCallbacks } from "../addMethod/models";
import { deleteBotMessage, saveBotMessage, userState } from "../../../userState";
import { MonthInlineKeybord } from "../../utils/monthUtils/inlineKeyboard";
import { MonthCallbacks } from "../../utils/monthUtils/models";
import { DaysInlineKeyboard } from "../../utils/daysUtils/inlineKeyboard";
import { DaysCallbacks } from "../../utils/daysUtils/models";
import { botMessages } from "../../messages";
import { WeekInlineKeybaord } from "../../utils/weekUtils/inlineKeyboard";
import { WeekCallbacks } from "../../utils/weekUtils/models";
import { ExerciseQueryFetcher } from "../getMethod/queries";
import { ExerciseGetUtils } from "../getMethod/functions";
import { ExerciseInlineKeybaord } from "../updateMethod/inlineKeyboard";
import { lt } from "lodash";

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

// Flow: Month -> Days -> Week -> exerciseName
export const exerciseDeleteFlow = async (ctx: Context, bot: Telegraf) => {
  try {
    const monthKeyboard = new MonthInlineKeybord(
      botMessages.inputRequest.prompts.deleteMethod.exerciseMonth)
    const daysKeyboard = new DaysInlineKeyboard(
      botMessages.inputRequest.prompts.deleteMethod.exerciseDay)
    const weekKeyboard = new WeekInlineKeybaord(
      botMessages.inputRequest.prompts.deleteMethod.exerciseWeek)
    //Controller
    const deleteExericiseCotroller = async () => {
      const data = await ExerciseQueryFetcher.ExerciseByMonthDayWeekAndId(ctx.from!.id, userState[ctx.from!.id]);
      await ctx.reply(ExerciseGetUtils.mapExerciseByNameDayWeekTESTING(data, ctx, "deleteMethod"), {
        parse_mode: "Markdown"
      });
      const exerciseKeyboard = new ExerciseInlineKeybaord(`deleteMethod`,
        botMessages.inputRequest.prompts.deleteMethod.selectExercisesToDeleteMessage, data)
      await setUpKeyboardIteration(ctx, exerciseKeyboard, bot, {})
    };
    // Chain flow
    return await setUpKeyboardIteration(ctx, monthKeyboard, bot, {
      callbackPattern: regexPattern(MonthCallbacks),
      nextStep: async () => await setUpKeyboardIteration(ctx, daysKeyboard, bot, {
        callbackPattern: regexPattern(DaysCallbacks),
        nextStep: async () => await setUpKeyboardIteration(ctx, weekKeyboard, bot, {
          callbackPattern: regexPattern(WeekCallbacks),
          nextStep: async () => await deleteExericiseCotroller()
        })
      })
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}


