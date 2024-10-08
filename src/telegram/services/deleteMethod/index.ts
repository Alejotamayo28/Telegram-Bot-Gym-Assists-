import { Context, Telegraf } from "telegraf";
import { UserStateManager } from "../../../userState";
import { verifyDeleteExercise } from "../utils";
import { inlineKeyboardVerifyDeleteExercise } from "./inlineKeyboard";
import { inlineKeyboardMenu } from "../../mainMenu/inlineKeyboard";
import { EXERCISE_DELETE_SUCCESFULLY, EXERCISE_NOT_DELETE_SUCCESFULLY } from "./messages";
import { onTransaction } from "../../../database/dataAccessLayer"; import { deleteWorkoutQuery } from "./queries";
import { PartialWorkout } from "../../../model/workout";

export const deleteExerciseVerificationMenu = async (bot: Telegraf, ctx: Context) => {
  const userManager = new UserStateManager(ctx.from!.id)
  const workoutData: PartialWorkout = userManager.getUserProfile()
  await ctx.reply(verifyDeleteExercise(workoutData),
    {
      parse_mode: 'MarkdownV2',
      ...inlineKeyboardVerifyDeleteExercise
    })
  bot.action(`eliminar_si`, async (ctx: Context) => {
    await ctx.deleteMessage()
    await onTransaction(async (transactionWorkout) => {
      await deleteWorkoutQuery(ctx, workoutData, transactionWorkout)
    })
    await ctx.reply(EXERCISE_DELETE_SUCCESFULLY,
      {
        parse_mode: 'MarkdownV2',
        ...inlineKeyboardMenu
      }
    )
  })

  bot.action(`eliminar_no`, async (ctx: Context) => {
    await ctx.reply(EXERCISE_NOT_DELETE_SUCCESFULLY,
      {
        parse_mode: 'MarkdownV2',
        ...inlineKeyboardMenu
      })
  })
}
