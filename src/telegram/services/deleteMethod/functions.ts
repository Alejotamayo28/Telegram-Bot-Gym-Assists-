import { Context, Telegraf } from "telegraf";
import { deleteUserMessage, userStageDeleteExercise, userState, userStateUpdateDay, userStateUpdateName, userStateUpdateWeek } from "../../../userState";
import { DELETE_EXERCISE_WEEK, EXERCISE_DELETE_NAME } from "./messages";
import { parseInt } from "lodash";
import { ExerciseQueryFetcher } from "../getMethod/queries";
import { handleExerciseNotFound } from "../updateMethod/functions";
import { deleteExerciseVerificationController } from ".";

export const handleDeleteExerciseDay = async (ctx: Context, userMessage: string) => {
  try {
    userStateUpdateDay(ctx, userMessage, userStageDeleteExercise.DELETE_EXERCISE_NAME)
    await deleteUserMessage(ctx)
    await ctx.reply(EXERCISE_DELETE_NAME, {
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error(`Error: `, error)
  }
};

export const handleDeleteExerciseName = async (ctx: Context, userMessage: string) => {
  try {
    userStateUpdateName(ctx, userMessage, userStageDeleteExercise.DELETE_EXERCISE_WEEK)
    await deleteUserMessage(ctx)
    await ctx.reply(DELETE_EXERCISE_WEEK, {
      parse_mode: "Markdown"
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}

export const handleDeleteExerciseWeekAndConfirmation = async (ctx: Context, bot: Telegraf, userMessage: string) => {
  try {
    const week = parseInt(userMessage)
    userStateUpdateWeek(ctx, week)
    const exercise = await ExerciseQueryFetcher.ExerciseByNameRepsWeekAndId(ctx.from!.id, userState[ctx.from!.id])
    if (!exercise) {
      await deleteUserMessage(ctx)
      await handleExerciseNotFound(ctx)
      return
    }
    await deleteExerciseVerificationController(ctx, bot)
  } catch (error) {
    console.error(`Error: `, error)
  }
}



