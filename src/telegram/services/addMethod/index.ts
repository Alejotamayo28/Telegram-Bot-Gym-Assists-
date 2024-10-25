import { Context, Telegraf } from "telegraf";
import { PartialWorkout } from "../../../model/workout";
import { insertWorkoutQueryTESTING, verifyExerciseOutput } from "../utils";
import { inlineKeyboardVerifyExercise } from "./inlineKeyboard";
import { VERIFY_EXERCISE_NO_CALLBACK, VERIFY_EXERCISE_YES_CALLBACK } from "./buttons";
import { inlineKeyboardMenu } from "../../mainMenu/inlineKeyboard";
import { userState } from "../../../userState";
import { EXERCISE_NOT_SUCCESFULLY_CREATED, EXERCISE_SUCCESFULLY_CREATED } from "./messages";
import { onTransaction } from "../../../database/dataAccessLayer";
import { handleError } from "../../../errors";

export const addExerciseVeryficationMenu = async (bot: Telegraf, ctx: Context) => {
  try {
    const workoutData: PartialWorkout = userState[ctx.from!.id]
    await ctx.reply(verifyExerciseOutput(workoutData),
      {
        parse_mode: 'MarkdownV2',
        ...inlineKeyboardVerifyExercise
      })
    bot.action(VERIFY_EXERCISE_YES_CALLBACK, async (ctx: Context) => {
      await ctx.deleteMessage()
      await onTransaction(async (transactionWorkout) => {
        await insertWorkoutQueryTESTING(workoutData, ctx, transactionWorkout)
        //await insertWorkoutQuery(workoutData, ctx, transactionWorkout)
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
