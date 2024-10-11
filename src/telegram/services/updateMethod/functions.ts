import { Context } from "telegraf"
import { userState } from "../../../userState"
import { PartialWorkout } from "../../../model/workout"
import { QueryResult } from "pg"
import { updateExerciseVeryficationMenu } from "."
import { bot } from "../../bot"
import { UPDATE_EXERCISE_KG, UPDATE_EXERCISE_NAME, UPDATE_EXERCISE_REPS } from "./message"
import { onSession } from "../../../database/dataAccessLayer"

export const handleUpdateExerciseDay = async (ctx: Context, userId: number, userMessage: string) => {
  try {
    userState[userId] = {
      ...userState[userId],
      day: userMessage.toLowerCase(),
      stage: 'menu_put_exercise_name'
    }; await ctx.deleteMessage()
    await ctx.reply(UPDATE_EXERCISE_NAME, { parse_mode: "Markdown" });
  } catch (error) {
    console.error(`Error: `, error)
  }
};

export const handleUpdateExerciseName = async (ctx: Context, userId: number) => {
  await ctx.deleteMessage()
  userState[userId] = {
    ...userState[userId],
    stage: 'menu_put_exercise_reps',
  }
  await ctx.reply(UPDATE_EXERCISE_REPS, {
    parse_mode: "Markdown"
  })
}

export const handlerUpdateExerciseReps = async (ctx: Context, userId: number, userMessage: string) => {
  userState[userId] = {
    ...userState[userId],
    reps: userMessage.split(" ").map(Number),
    stage: 'menu_put_exercise_weight'
  }
  await ctx.deleteMessage()
  await ctx.reply(UPDATE_EXERCISE_KG, {
    parse_mode: "Markdown"
  })
}

export const handlerUpdateExerciseKg = async (ctx: Context, userId: number, userMessage: string) => {
  userState[userId] = {
    ...userState[userId],
    kg: userMessage
  }
  await ctx.deleteMessage()
  await updateExerciseVeryficationMenu(bot, ctx, userState[userId])
  delete userState[userId]
}

export const findExerciseByDayName = async (userId: number, userState: PartialWorkout):
  Promise<QueryResult<PartialWorkout>> => {
  const { day, name }: PartialWorkout = userState
  const response: QueryResult<PartialWorkout> = await onSession(async (clientTransaction) => {
    const { rows, rowCount }: QueryResult = await clientTransaction.query(`
    SELECT name, reps, kg FROM workout WHERE id = $1 AND day = $2 AND name = $3`,
      [userId, day, name])
    return rowCount ? rows[0] : null
  })
  return response
}

export const handleExerciseNotFound = async (ctx: Context) => {
  await ctx.reply(`*¡Ejercicio no encontrado\\!* 🤕\n\n_¿Sigue explorando, qué te gustaría hacer ahora?_`,
    {
      parse_mode: 'MarkdownV2',
    })
};

export const userStateUpdateDay = (ctx: Context, day: string) => {
  userState[ctx.from!.id] = { ...userState[ctx.from!.id], day: day }
}
export const userStateUpdateName = (ctx: Context, name: string) => {
  userState[ctx.from!.id] = { ...userState[ctx.from!.id], name: name }
}


