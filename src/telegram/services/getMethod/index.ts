import { Context, Telegraf } from "telegraf";
import { sendMenuFunctions } from "../../menus/userMenu";
import { graphic, handleOutputDailyExercise, mapWeeklyExercise } from "./functions";
import { deleteLastMessage, regexPattern, tryCatch } from "../utils";
import { handleExerciseNotFound } from "../updateMethod/functions";
import { ExerciseFetchGraphTextOptions, ExerciseViewOption } from "./models";
import { ExerciseFetchHandler, ExerciseFetchHandlerInterval, ExerciseFetchHandlerOptions } from "./inlineKeyboard";
import { ExerciseQueryFetcher } from "./queries";
import { returnMainMenuPage } from "../../mainMenu";

export const handleGetDailyExercisesGraphic = async (ctx: Context, day: string, bot:Telegraf) => {
  await ctx.deleteMessage()
  try {
    const image = await graphic(ctx.from!.id, day)
    await ctx.replyWithPhoto({
      source: image, filename: 'exercise_chart.png'
    }, {
      caption: `_Gráfico de ejercicios del dia ${day}._`,
      parse_mode: "Markdown"
    });
    await returnMainMenuPage(ctx,bot)
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

// Estructuracion nueva ================

export const fetchExerciseController = async (ctx: Context, bot: Telegraf) => {
  const response = new ExerciseFetchHandler()
  try {
    const message = await response.sendCompleteMessage(ctx)
    bot.action(regexPattern(ExerciseViewOption), async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => response.handleOptions(ctx, message, action, bot), ctx)
    })
  } catch (error) {
    console.error(`Error in handleGetExerciseOptions :`, error)
  }
}

export const fetchExerciseIntervalController = async (ctx: Context, bot: Telegraf) => {
  const response = new ExerciseFetchHandlerInterval()
  try {
    const message = await response.sendCompleteMessage(ctx)
    bot.action(regexPattern(ExerciseIntervalOption), async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => response.handleOptions(ctx, message, action, bot), ctx)
    })
  } catch (error) {
    console.error(`Error in handleGetExerciseOptions :`, error)
  }
}

export const fetchExerciseGraphTextController = async (ctx: Context, bot: Telegraf, userMessage: string) => {
  const response = new ExerciseFetchHandlerOptions()
  try {
    const message = await response.sendCompleteMessage(ctx)
    bot.action(regexPattern(ExerciseFetchGraphTextOptions), async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => response.handleOptions(ctx, message, action, bot, userMessage), ctx)
    })
  } catch (error) {
    console.error(`Error :`, error)
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


