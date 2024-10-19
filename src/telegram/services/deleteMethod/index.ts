import { Context, Telegraf } from "telegraf";
import { userState } from "../../../userState";
import { verifyDeleteExercise } from "../utils";
import { inlineKeyboardVerifyDeleteExercise } from "./inlineKeyboard";
import { inlineKeyboardMenu } from "../../mainMenu/inlineKeyboard";
import { EXERCISE_DELETE_SUCCESFULLY, EXERCISE_NOT_DELETE_SUCCESFULLY } from "./messages";
import { onTransaction } from "../../../database/dataAccessLayer"; import { deleteWorkoutQuery } from "./queries";

export const deleteExerciseVerificationMenu = async (bot: Telegraf, ctx: Context) => {
  await ctx.reply(verifyDeleteExercise(userState[ctx.from!.id]),
    {
      parse_mode: 'MarkdownV2',
      ...inlineKeyboardVerifyDeleteExercise
    })
  bot.action(`eliminar_si`, async (ctx: Context) => {
    await ctx.deleteMessage()
    await onTransaction(async (transactionWorkout) => {
      await deleteWorkoutQuery(ctx, userState[ctx.from!.id], transactionWorkout)
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
