import { Context, Telegraf } from "telegraf";
import { workoutOutput } from "../../../model/workout";
import { verifyExerciseOutput } from "../utils";
import { inlineKeyboardVerifyExercise } from "./inlineKeyboard";
import { VERIFY_EXERCISE_NO_CALLBACK, VERIFY_EXERCISE_YES_CALLBACK } from "./buttons";
import { inlineKeyboardMenu } from "../../mainMenu/inlineKeyboard";
import { userState, UserStateManager } from "../../../userState";
import { EXERCISE_NOT_SUCCESFULLY_CREATED, EXERCISE_SUCCESFULLY_CREATED } from "./messages";
import { onTransaction } from "../../../database/dataAccessLayer";
import { insertWorkoutQuery } from "./queries";
import { handleError } from "../../../errors";

export const addExerciseVeryficationMenu = async (bot: Telegraf, ctx: Context) => {
  try {
    const userManager = new UserStateManager(ctx.from!.id)
    const workoutData: workoutOutput = userManager.getUserData()
    await ctx.reply(verifyExerciseOutput(workoutData),
      {
        parse_mode: 'MarkdownV2',
        ...inlineKeyboardVerifyExercise
      })
    bot.action(VERIFY_EXERCISE_YES_CALLBACK, async (ctx: Context) => {
      await ctx.deleteMessage()
      await onTransaction(async (transactionWorkout) => {
        await insertWorkoutQuery(workoutData, ctx, transactionWorkout)
      })
      await ctx.reply(EXERCISE_SUCCESFULLY_CREATED, {
        parse_mode: 'MarkdownV2',
        ...inlineKeyboardMenu
      })
    })
    bot.action(VERIFY_EXERCISE_NO_CALLBACK, async (ctx) => {
      await ctx.deleteMessage()
      await ctx.reply(EXERCISE_NOT_SUCCESFULLY_CREATED, {
        parse_mode: 'MarkdownV2',
        ...inlineKeyboardMenu
      })
    })
  } catch (e) {
    return handleError(e, userState[ctx.from!.id].stage, ctx)
  }
}
