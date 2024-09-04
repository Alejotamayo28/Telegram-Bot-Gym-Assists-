import { PoolClient, QueryResult } from "pg";
import { userState } from "../../../userState";
import { handleExerciseNotFound } from "../updateExercise";
import { ClientWorkout, workoutOutput } from "../../../model/workout";
import { pool } from "../../../database/database";
import { Context } from "telegraf";
import { deleteLastMessage } from "..";
import { handleIncorrectDayInput, verifyDayInput } from "../../../telegram/services/addMethod/functions";
import { sendMenuFunctions } from "../../../telegram/menus/userMenu";

export const handleGetDailyExercises = async (ctx: Context, userMessage: string,
  userId: number) => {
  await deleteLastMessage(ctx)
  if (!verifyDayInput(userMessage)) {
    await handleIncorrectDayInput(ctx, userId)
    await ctx.deleteMessage()
    return
  }
  const client = await pool.connect()
  userState[ctx.from!.id] = {
    ...userState[userId],
    day: userMessage.toLowerCase()
  };
  const exercise = await findExercisesByDay(userState[ctx.from!.id].day, client, userId)
  if (!exercise) {
    await handleExerciseNotFound(ctx)
    await ctx.deleteMessage()
    return
  }
  await ctx.deleteMessage()
  const formattedOutput = handleOutputDailyExercise(exercise)
  const day: string = `${userState[userId].day}`.toUpperCase()
  await ctx.reply(`*${day}:*\\\n ${formattedOutput}`, {
    parse_mode: `MarkdownV2`
  })
  await sendMenuFunctions(ctx)
}

export const handleOutputDailyExercise = (data: QueryResult<Partial<ClientWorkout>>) => {
  let result = ""
  data.rows.map((i: any) => {
    let kg: number = i.kg
    result += `
_Nombre:_ ${i.name}
_Reps:_ ${i.reps}
_Peso:_ ${Math.trunc(kg)}\n`
  })
  return result
}

export const findExercisesByDay = async (day: string, client: PoolClient, id: number):
  Promise<QueryResult<Partial<ClientWorkout>>> => {
  const response: QueryResult = await client.query(
    `SELECT name, reps, kg FROM workout WHERE id = $1 and day = $2`,
    [id, day])
  return response
}


