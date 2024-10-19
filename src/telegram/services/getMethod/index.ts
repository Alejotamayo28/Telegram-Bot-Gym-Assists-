import { Context } from "telegraf";
import { sendMenuFunctions } from "../../menus/userMenu";
import { findExercisesByDay, findWeeklyExercises, graphic, handleOutputDailyExercise, mapWeeklyExercise } from "./functions";
import { deleteLastMessage } from "../utils";
import { handleExerciseNotFound } from "../updateMethod/functions";

export const handleGetDailyExercisesGraphic = async (ctx: Context, day: string) => {
  await ctx.deleteMessage()
  try {
    const image = await graphic(ctx.from!.id, day)
    const response = ctx.replyWithPhoto({
      source: image, filename: 'exercise_chart.png'
    }, {
      caption: `_Gráfico de ejercicios del dia ${day}._`,
      parse_mode: "Markdown"
    });
    await response
    await sendMenuFunctions(ctx)
  } catch (error) {
    console.error(`Error: `, error)
  }
}

export const handleGetDailyExercisesText = async (ctx: Context, day: string) => {
  await deleteLastMessage(ctx)
  try {
    const exercise = await findExercisesByDay(day, ctx.from!.id)
    if (!exercise) {
      await ctx.deleteMessage()
      await handleExerciseNotFound(ctx)
      return
    }
    const formattedOutput = handleOutputDailyExercise(exercise)
    const formattedDay = day.toUpperCase()
    await ctx.deleteMessage()
    await ctx.reply(`*${formattedDay}:*\n${formattedOutput}`, { parse_mode: `MarkdownV2` })
    await sendMenuFunctions(ctx)
  } catch (error) {
    console.error(`Error: `, error)
  }
}

export const handleGetWeeklyExercises = async (ctx: Context) => {
  await deleteLastMessage(ctx)
  try {
    const exercise = await findWeeklyExercises(ctx.from!.id)
    if (!exercise) {
      await handleExerciseNotFound(ctx)
      await ctx.deleteMessage()
      return
    }
    const formattedExercises = mapWeeklyExercise(exercise.rows)
    await ctx.reply(formattedExercises, {
      parse_mode: 'MarkdownV2'
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}

