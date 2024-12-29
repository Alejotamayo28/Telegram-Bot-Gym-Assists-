import { Context, Telegraf } from "telegraf";
import { regexPattern, tryCatch } from "../utils";
import { ExerciseDeleteVerificationHandler } from "./inlineKeyboard";
import { ExerciseVerificationCallbacks } from "../addMethod/models";
import { deleteBotMessage, saveBotMessage, userState } from "../../../userState";
import { MonthInlineKeybord } from "../../utils/monthUtils/inlineKeyboard";
import { MonthCallbacks } from "../../utils/monthUtils/models";
import { DaysInlineKeyboard } from "../../utils/daysUtils/inlineKeyboard";
import { DaysCallbacks } from "../../utils/daysUtils/models";
import { botMessages } from "../../messages";
import { Message } from "telegraf/typings/core/types/typegram";
import { WeekInlineKeybaord } from "../../utils/weekUtils/inlineKeyboard";
import { WeekCallbacks } from "../../utils/weekUtils/models";
import { ExerciseQueryFetcher } from "../getMethod/queries";
import { ExerciseGetUtils } from "../getMethod/functions";
import { ExerciseInlineKeybaord } from "../updateMethod/inlineKeyboard";

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

interface KeyboardResponse {
  sendCompleteMessage: (ctx: Context) => Promise<Message>;
  handleOptions: (ctx: Context, message: Message, action: string, bot: Telegraf) => Promise<void>;
}

const handleKeyboardStep = async (ctx: Context, keyboard: KeyboardResponse, bot: Telegraf, callbackPattern?: RegExp, nextStep?: () => Promise<any>):
  Promise<void> => {
  const message = await keyboard.sendCompleteMessage(ctx);
  saveBotMessage(ctx, message.message_id);
  if (callbackPattern) {
    bot.action(callbackPattern, async (ctx) => {
      const action = ctx.match[0];
      await tryCatch(() => keyboard.handleOptions(ctx, message, action, bot), ctx);
      if (nextStep) await nextStep();
    });
  } else {
    bot.action(/.*/, async (ctx) => {
      const action = ctx.match[0];
      await tryCatch(() => keyboard.handleOptions(ctx, message, action, bot), ctx);
      if (nextStep) await nextStep();
    });
  }
}

// Flow: Month -> Days -> Week -> exerciseName
export const exerciseDeletionFlow = async (ctx: Context, bot: Telegraf) => {
  try {
    const monthKeyboard = new MonthInlineKeybord(
      botMessages.inputRequest.prompts.deleteMethod.exerciseMonth)
    const daysKeyboard = new DaysInlineKeyboard(
      botMessages.inputRequest.prompts.deleteMethod.exerciseDay)
    const weekKeyboard = new WeekInlineKeybaord(
      botMessages.inputRequest.prompts.deleteMethod.exerciseWeek)

    const deleteExericiseCotroller = async () => {
      const data = await ExerciseQueryFetcher.ExerciseByMonthDayWeekAndId(ctx.from!.id, userState[ctx.from!.id]);
      await ctx.reply(ExerciseGetUtils.mapExerciseByNameDayWeekTESTING(data, ctx), {
        parse_mode: "Markdown"
      });
      const exerciseKeyboard = new ExerciseInlineKeybaord(`deleteMethod`,
        botMessages.inputRequest.prompts.deleteMethod.selectExercisesToDeleteMessage, data)
      await handleKeyboardStep(ctx, exerciseKeyboard, bot)
    };
    // Chain flow
    await handleKeyboardStep(ctx, monthKeyboard, bot, regexPattern(MonthCallbacks), async () => {
      await handleKeyboardStep(ctx, daysKeyboard, bot, regexPattern(DaysCallbacks), async () => {
        await handleKeyboardStep(ctx, weekKeyboard, bot, regexPattern(WeekCallbacks), deleteExericiseCotroller);
      })
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}









