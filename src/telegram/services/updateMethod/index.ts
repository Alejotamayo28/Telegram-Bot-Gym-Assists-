import { Context, Telegraf } from "telegraf";
import { PartialWorkout } from "../../../model/workout";
import { verifyExerciseOutput } from "../utils";
import { inlineKeyboardMenu } from "../../mainMenu/inlineKeyboard";
import { ExerciseUpdateDayHandler, inlineKeyboardVerifyExerciseUpdate } from "./inlineKeyboard";
import { VERIFY_EXERCISE_UPDATE_YES_CALLBACK } from "./buttons";
import { UPDATED_EXERCISE_SUCCESFULLY } from "./message";
import { onTransaction } from "../../../database/dataAccessLayer";
import { workoutUpdateQuery } from "./queries";

export const updateExerciseVeryficationMenu = async (bot: Telegraf, ctx: Context, workout: PartialWorkout) => {
  const { day, name, reps, kg }: PartialWorkout = workout
  await ctx.reply(verifyExerciseOutput({ day, name, reps, kg }),
    {
      parse_mode: 'MarkdownV2',
      ...inlineKeyboardVerifyExerciseUpdate
    })
  bot.action(VERIFY_EXERCISE_UPDATE_YES_CALLBACK, async (ctx: Context) => {
    await ctx.deleteMessage()
    await onTransaction(async (workoutClient) => {
      await workoutUpdateQuery(ctx, { day, name, reps, kg }, workoutClient)
    })
    await ctx.reply(UPDATED_EXERCISE_SUCCESFULLY,
      {
        parse_mode: 'MarkdownV2',
        ...inlineKeyboardMenu
      }
    )
  })
}


