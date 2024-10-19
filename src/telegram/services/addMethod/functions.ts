import { Context } from "telegraf"
import { verifyDay } from "../utils"
import { userStagePostExercise, userState, userStateUpdateDay, userStateUpdateKg, userStateUpdateName, userStateUpdateReps } from "../../../userState"
import { addExerciseVeryficationMenu } from "."
import { bot } from "../../bot"
import { EXERCISE_NAME_OUTPUT, EXERCISE_NAME_OUTPUT_INVALID, EXERCISE_REPS_OUTPUT, EXERCISE_WEIGHT_OUTPUT, INCORRECT_DAY_INPUT } from "./messages"
import { isNaN } from "lodash"

export const handleAddExerciseDay = async (ctx: Context, day: string): Promise<void> => {
  try {
    userStateUpdateDay(ctx, day, userStagePostExercise.POST_EXERCISE_NAME)
    await ctx.deleteMessage()
    await ctx.reply(EXERCISE_NAME_OUTPUT, {
      parse_mode: "MarkdownV2"
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}

export const handleAddExerciseName = async (ctx: Context, name: string): Promise<void> => {
  try {
    userStateUpdateName(ctx, name, userStagePostExercise.POST_EXERCISE_REPS)
    await ctx.deleteMessage()
    await ctx.reply(EXERCISE_REPS_OUTPUT, {
      parse_mode: "MarkdownV2"
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}

export const handleAddExerciseReps = async (ctx: Context, userMessage: string): Promise<void> => {
  try {
    const reps = userMessage.split(" ").map(Number)
    userStateUpdateReps(ctx, reps, userStagePostExercise.POST_EXERCISE_VERIFICATION)
    await ctx.deleteMessage()
    await ctx.reply(EXERCISE_WEIGHT_OUTPUT, {
      parse_mode: "MarkdownV2"
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}

export const handleAddExerciseVerification = async (ctx: Context, userMessage: number): Promise<void> => {
  try {
    userStateUpdateKg(ctx, userMessage)
    await ctx.deleteMessage()
    await addExerciseVeryficationMenu(bot, ctx)
    delete userState[ctx.from!.id]
  } catch (error) {
    console.error(`Error: `, error)
  }
}

export const verifyDayInput = (day: string): boolean => {
  return verifyDay(day)
}
export const handleIncorrectDayInput = async (ctx: Context): Promise<void> => {
  await ctx.reply(INCORRECT_DAY_INPUT, {
    parse_mode: 'Markdown'
  })
}
export const handleIncorrectExerciseInput = async (ctx: Context): Promise<void> => {
  await ctx.reply(EXERCISE_NAME_OUTPUT_INVALID, {
    parse_mode: "Markdown"
  })
}

export const isAllRepsValid = (reps: number[]) => {
  return reps.every(rep => !isNaN(rep))
}

