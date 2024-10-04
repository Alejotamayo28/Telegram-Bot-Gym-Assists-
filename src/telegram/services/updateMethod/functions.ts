import { Context } from "telegraf"
import { userState } from "../../../userState"
import { workoutOutput } from "../../../model/workout"
import { PoolClient, QueryResult } from "pg"
import { inlineKeyboardMenu } from "../../mainMenu/inlineKeyboard"
import { updateExerciseVeryficationMenu } from "."
import { bot } from "../../bot"
import { deleteLastMessage } from "../utils"

export const handleUpdateExerciseDay = async (ctx: Context, userId: number, userMessage: string) => {
  await deleteLastMessage(ctx)
  userState[userId] = {
    ...userState[userId],
    day: userMessage.toLowerCase(),
    stage: 'menu_put_exercise_name'
  }
  await ctx.deleteMessage()
  await ctx.reply(`Por favor, digita el nombre del ejercicio a actualizar: `)
}

export const findExerciseByDayName = async (userId: number, userState: workoutOutput, client: PoolClient): Promise<QueryResult<workoutOutput>> => {
  const { day, name }: workoutOutput = userState
  const { rows, rowCount }: QueryResult = await client.query(
    `SELECT name, reps, kg FROM workout WHERE id = $1 AND day = $2 AND name = $3`,
    [userId, day, name])
  return rowCount ? rows[0] : null
}

export const handleExerciseNotFound = async (ctx: Context) => {
  await ctx.reply(`*¡Ejercicio no encontrado\\!* 🤕\n\n_¿Sigue explorando, qué te gustaría hacer ahora?_`,
    {
      parse_mode: 'MarkdownV2',
      ...inlineKeyboardMenu
    })
}
export const handleUpdateExerciseName = async (ctx: Context, userId: number, userMessage: string, client: PoolClient) => {
  await deleteLastMessage(ctx)
  userState[userId] = {
    ...userState[userId],
    name: userMessage
  }
  const exercise = await findExerciseByDayName(userId, userState[userId], client)
  if (!exercise) {
    await handleExerciseNotFound(ctx)
    await ctx.deleteMessage()
    return
  }
  await ctx.deleteMessage()
  userState[userId] = {
    ...userState[userId],
    stage: 'menu_put_exercise_reps',
  }
  await ctx.reply(`Por favor, digita las repeticiones nuevas del ejercicio.\N Ej: 10 10 10`)
}

export const handlerUpdateExerciseReps = async (ctx: Context, userId: number, userMessage: string) => {
  await deleteLastMessage(ctx)
  userState[userId] = {
    ...userState[userId],
    reps: userMessage.split(" ").map(Number),
    stage: 'menu_put_exercise_weight'
  }
  await ctx.deleteMessage()
  await ctx.reply(`Por favor, digita el nuevo peso en kg: `)
}

export const handlerUpdateExerciseKg = async (ctx: Context, userId: number, userMessage: string) => {
  await deleteLastMessage(ctx)
  userState[userId] = {
    ...userState[userId],
    kg: userMessage
  }
  await ctx.deleteMessage()
  await updateExerciseVeryficationMenu(bot, ctx, userState[userId])
  delete userState[userId]
}
