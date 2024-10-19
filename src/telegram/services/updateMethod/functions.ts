import { Context } from "telegraf"
import { userStagePutExercise, userState, userStateUpdateDay, userStateUpdateKg, userStateUpdateReps, userStateUpdateStage } from "../../../userState"
import { PartialWorkout } from "../../../model/workout"
import { QueryResult } from "pg"
import { updateExerciseVeryficationMenu } from "."
import { bot } from "../../bot"
import { UPDATE_EXERCISE_KG, UPDATE_EXERCISE_NAME, UPDATE_EXERCISE_REPS } from "./message"
import { onSession } from "../../../database/dataAccessLayer"

export const handleUpdateExerciseDay = async (ctx: Context, userMessage: string) => {
  try {
    const day = userMessage.toLowerCase()
    userStateUpdateDay(ctx, day, userStagePutExercise.PUT_EXERCISE_NAME)
    await ctx.deleteMessage()
    await ctx.reply(UPDATE_EXERCISE_NAME, {
      parse_mode: "Markdown"
    });
  } catch (error) {
    console.error(`Error: `, error)
  }
};

export const handleUpdateExerciseName = async (ctx: Context) => {
  await ctx.deleteMessage()
  userStateUpdateStage(ctx, userStagePutExercise.PUT_EXERCISE_REPS)
  await ctx.reply(UPDATE_EXERCISE_REPS, {
    parse_mode: "Markdown"
  })
}

export const handlerUpdateExerciseReps = async (ctx: Context, userMessage: string) => {
  const reps = userMessage.split(" ").map(Number)
  userStateUpdateReps(ctx, reps, userStagePutExercise.PUT_EXERCISE_WEIGHT)
  await ctx.deleteMessage()
  await ctx.reply(UPDATE_EXERCISE_KG, {
    parse_mode: "Markdown"
  })
}

export const handlerUpdateExerciseKg = async (ctx: Context, userMessage: number) => {
  userStateUpdateKg(ctx, userMessage)
  await ctx.deleteMessage()
  await updateExerciseVeryficationMenu(bot, ctx, userState[ctx.from!.id])
  delete userState[ctx.from!.id]
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


