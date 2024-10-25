import { Context, Telegraf } from "telegraf";
import { sendMenuFunctions } from "../../menus/userMenu";
import { graphic, handleOutputDailyExercise, mapWeeklyExercise } from "./functions";
import { deleteLastMessage, regexPattern, tryCatch } from "../utils";
import { handleExerciseNotFound } from "../updateMethod/functions";
import { ExerciseViewOption } from "./models";
import { ExerciseIntervalHandler, sendInlineExerciseOptions } from "./inlineKeyboard";
import { handleExerciseOption } from "./options";
import { ExerciseQueryFetcher } from "./queries";

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
    const exercise = await ExerciseQueryFetcher.ExerciseByIdAndDay(ctx.from!.id, day)
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
    const exercise = await ExerciseQueryFetcher.ExerciseById(ctx.from!.id)
    if (!exercise) {
      await handleExerciseNotFound(ctx)
      await ctx.deleteMessage()
      return
    }
    const formattedExercises = mapWeeklyExercise(exercise)
    await ctx.reply(formattedExercises, {
      parse_mode: 'MarkdownV2'
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}

// -------> EJEMPLOS NUEVOS DE ESTRUCTURA ->


//MENSAJE








//Funcion principal
export const handleGetExercisesOptions = async (ctx: Context, bot: Telegraf) => {
  try {
    const message = await sendInlineExerciseOptions(ctx)
    bot.action(regexPattern(ExerciseViewOption), async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => handleExerciseOption(ctx, message, action, bot), ctx)
    })
  } catch (error) {
    console.error(`Error in handleGetExerciseOptions :`, error)
  }
}



//OTRO EJEMPLO DE ESTRUCTURA

export enum ExerciseIntervalOption {
  WEEK_1 = 'semana1',
  WEEK_2 = 'semana2',
  WEEK_3 = 'semana3'
}

export const EXERCISE_INTERVALS_LABELS = {
  SEMANA_1: '🔹 Semana 1',
  SEMANA_2: '🔹 Semana 2',
  SEMANA_3: '🔹 Semana 3'
}

export const handleGetExercisesByInterval = async (ctx: Context, bot: Telegraf) => {
  try {
    const response = new ExerciseIntervalHandler()
    const message = await response.sendExerciseIntervalOptions(ctx)
    bot.action(regexPattern(ExerciseIntervalOption), async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => response.handleOption(ctx, message, action), ctx)
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}



