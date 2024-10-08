import { Context } from "telegraf"
import { userState } from "../../../userState"
import { PartialWorkout } from "../../../model/workout"
import { PoolClient, QueryResult } from "pg"
import { inlineKeyboardMenu } from "../../mainMenu/inlineKeyboard"
import { updateExerciseVeryficationMenu } from "."
import { bot } from "../../bot"
import { deleteLastMessage, handleIncorrectExerciseNameInput, verifyExerciseName } from "../utils"
import { UPDATE_EXERCISE_KG, UPDATE_EXERCISE_NAME, UPDATE_EXERCISE_REPS } from "./message"
import { handleIncorrectDayInput, verifyDayInput } from "../addMethod/functions"

export const deleteMessageSafe = async (ctx: Context, messageId?: number) => {
  try {
    if (messageId) {
      await ctx.deleteMessage(messageId)
    } else {
      await ctx.deleteMessage()
    }
  } catch (error) {
    console.error("Error al eliminar el mensaje: ", error)
  }
}

export const handleUpdateExerciseDay = async (ctx: Context, userId: number, userMessage: string) => {
  if (!verifyDayInput(userMessage)) {
    await deleteLastMessage(ctx)
    await handleIncorrectDayInput(ctx)
    await ctx.deleteMessage()
    return
  }
  await deleteLastMessage(ctx)
  userState[userId] = {
    ...userState[userId],
    day: userMessage.toLowerCase(),
    stage: 'menu_put_exercise_name'
  }
  await ctx.deleteMessage()
  await ctx.reply(UPDATE_EXERCISE_NAME, {
    parse_mode: "Markdown"
  })
}

export const handleUpdateExerciseName = async (ctx: Context, userId: number,
  userMessage: string, client: PoolClient) => {
  userState[userId] = {
    ...userState[userId],
    name: userMessage
  }
  if (!(await verifyExerciseName(userMessage, ctx))) {
    await deleteLastMessage(ctx)
    await handleIncorrectExerciseNameInput(ctx)
    await ctx.deleteMessage()
    return
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
  await ctx.reply(UPDATE_EXERCISE_REPS, {
    parse_mode: "Markdown"
  })
}

export const handlerUpdateExerciseReps = async (ctx: Context, userId: number,
  userMessage: string) => {
  await deleteLastMessage(ctx)
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
  await deleteLastMessage(ctx)
  userState[userId] = {
    ...userState[userId],
    kg: userMessage
  }
  await ctx.deleteMessage()
  await updateExerciseVeryficationMenu(bot, ctx, userState[userId])
  delete userState[userId]
}

export const findExerciseByDayName = async (userId: number, userState: PartialWorkout, client: PoolClient): Promise<QueryResult<PartialWorkout>> => {
  const { day, name }: PartialWorkout = userState
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
