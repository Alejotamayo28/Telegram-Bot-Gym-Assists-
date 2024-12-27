import { Context, Telegraf } from "telegraf";
import { regexPattern, tryCatch } from "../utils";
import { ExerciseDeleteVerificationHandler } from "./inlineKeyboard";
import { ExerciseVerificationCallbacks } from "../addMethod/models";
import { deleteBotMessage, saveBotMessage } from "../../../userState";
import { MonthInlineKeybord } from "../../utils/monthUtils/inlineKeyboard";
import { MonthCallbacks } from "../../utils/monthUtils/models";
import { DaysInlineKeyboard } from "../../utils/daysUtils/inlineKeyboard";
import { DaysCallbacks } from "../../utils/daysUtils/models";

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

export const exerciseDeletionFlow = async (ctx: Context, bot: Telegraf) => {
  const response = new MonthInlineKeybord(`holaaaaaaaaaa, digita el mess`)
  try {
    const message = await response.sendCompleteMessage(ctx)
    saveBotMessage(ctx, message.message_id)
    bot.action(regexPattern(MonthCallbacks), async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => response.handleOptions(ctx, message, action, bot), ctx)
      const daysResponse = new DaysInlineKeyboard(`holaaaaaaa, digita el dia`)
      const daysMessage = await daysResponse.sendCompleteMessage(ctx)
      saveBotMessage(ctx, daysMessage.message_id)
      bot.action(regexPattern(DaysCallbacks), async (ctx) => {
        const dayAction = ctx.match[0];
        await tryCatch(() => daysResponse.handleOptions(ctx, daysMessage, dayAction, bot), ctx);
      });
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}


