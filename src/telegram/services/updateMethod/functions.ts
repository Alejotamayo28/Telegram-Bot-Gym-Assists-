import { Context } from "telegraf"
import { deleteUserMessage, userStagePutExercise, userState, userStateUpdateDay, userStateUpdateKg, userStateUpdateName, userStateUpdateReps } from "../../../userState"
import { PartialWorkout } from "../../../model/workout"
import { QueryResult } from "pg"
import { UpdateExerciseVerificationController } from "."
import { bot } from "../../bot"
import { onSession } from "../../../database/dataAccessLayer"
import { botMessages } from "../../messages"

export const handleUpdateExerciseDay = async (ctx: Context, userMessage: string) => {
  const day = userMessage.toLowerCase()
  userStateUpdateDay(ctx, day, userStagePutExercise.PUT_EXERCISE_NAME)
  await deleteUserMessage(ctx)
  await ctx.reply(botMessages.inputRequest.prompts.updateMethod.exerciseName, {
    parse_mode: "Markdown"
  });
};

export const handleUpdateExerciseName = async (ctx: Context, userMessage: string) => {
  const name = userMessage.toLowerCase()
  userStateUpdateName(ctx, name, userStagePutExercise.PUT_EXERCISE_REPS)
  await deleteUserMessage(ctx)
  await ctx.reply(botMessages.inputRequest.prompts.updateMethod.exerciseReps, {
    parse_mode: "Markdown"
  })
}

export const handlerUpdateExerciseReps = async (ctx: Context, userMessage: string) => {
  const reps = userMessage.split(" ").map(Number)
  userStateUpdateReps(ctx, reps, userStagePutExercise.PUT_EXERCISE_WEIGHT)
  await deleteUserMessage(ctx)
  await ctx.reply(botMessages.inputRequest.prompts.updateMethod.exerciseWeight, {
    parse_mode: "Markdown"
  })
}

export const handlerUpdateExerciseKg = async (ctx: Context, userMessage: number) => {
  userStateUpdateKg(ctx, userMessage)
  await deleteUserMessage(ctx)
  await UpdateExerciseVerificationController(ctx, bot)
  delete userState[ctx.from!.id]
}

export const findExerciseByDayName = async (userId: number, userState: PartialWorkout):
  Promise<QueryResult<PartialWorkout>> => {
  const { day, name }: PartialWorkout = userState
  const response: QueryResult<PartialWorkout> = await onSession(async (clientTransaction) => {
    const { rows, rowCount }: QueryResult = await clientTransaction.query(`
    SELECT name, reps, kg FROM workout WHERE user_id = $1 AND day = $2 AND name = $3`,
      [userId, day, name])
    return rowCount ? rows[0] : null
  })
  return response
}

export const handleExerciseNotFound = async (ctx: Context) => {
  await ctx.reply(botMessages.inputRequest.prompts.getMethod.errors.exerciseNotFound, {
    parse_mode: 'Markdown',
  })
};


