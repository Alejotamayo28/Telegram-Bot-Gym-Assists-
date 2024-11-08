import { Context, Telegraf } from "telegraf";
import { PartialWorkout } from "../../../model/workout";
import { insertWorkoutQueryTESTING, regexPattern, tryCatch, verifyExerciseOutput } from "../utils";
import { ExercisePostVerificationHandler, inlineKeyboardVerifyExercise } from "./inlineKeyboard";
import { VERIFY_EXERCISE_NO_CALLBACK, VERIFY_EXERCISE_YES_CALLBACK } from "./buttons";
import { inlineKeyboardMenu } from "../../mainMenu/inlineKeyboard";
import { userState } from "../../../userState";
import { EXERCISE_NOT_SUCCESFULLY_CREATED, EXERCISE_SUCCESFULLY_CREATED } from "./messages";
import { onTransaction } from "../../../database/dataAccessLayer";
import { handleError } from "../../../errors";
import { ExerciseQueryPost } from "./queries";
import { ExerciseVerificationOptions } from "./models";

// Estructuracion nueva =>

export const PostExerciseVerificationController = async (ctx: Context, bot: Telegraf) => {
  const response = new ExercisePostVerificationHandler(ctx)
  try {
    const message = await response.sendCompleteMessage(ctx)
    bot.action(regexPattern(ExerciseVerificationOptions), async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => response.handleOptions(ctx, message, action, bot), ctx)
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}


// Estructura vieja
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
        await ExerciseQueryPost.ExercisePostTesting(workoutData, ctx, transactionWorkout)
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
