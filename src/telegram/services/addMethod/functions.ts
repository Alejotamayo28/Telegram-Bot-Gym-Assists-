import { Context } from "telegraf"
import { verifyDay } from "../utils"
import { UserStateManager, userState } from "../../../userState"
import { addExerciseVeryficationMenu } from "."
import { bot } from "../../bot"
import { EXERCISE_NAME_OUTPUT, EXERCISE_NAME_OUTPUT_INVALID, EXERCISE_REPS_OUTPUT, EXERCISE_WEIGHT_OUTPUT, INCORRECT_DAY_INPUT } from "./messages"
import { isNaN } from "lodash"

export const handleAddExerciseDay = async (ctx: Context, day: string): Promise<void> => {
  try {
    const userManager = new UserStateManager(ctx.from!.id)
    userManager.updateData({ day: day }, 'menu_post_exercise_name')
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
    const userManager = new UserStateManager(ctx.from!.id)
    userManager.updateData({ name: name }, 'menu_post_exercise_reps')
    await ctx.deleteMessage()
    await ctx.reply(EXERCISE_REPS_OUTPUT, {
      parse_mode: "MarkdownV2"
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}

export const handleAddExerciseReps = async (ctx: Context, userMessage: string) => {
  try {
    const userManager = new UserStateManager(ctx.from!.id)
    const reps = userMessage.split(" ").map(Number)
    userManager.updateData({
      reps: reps
    }, 'menu_post_exercise_verification')
    await ctx.deleteMessage()
    await ctx.reply(EXERCISE_WEIGHT_OUTPUT, {
      parse_mode: "MarkdownV2"
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}

export const isAllRepsValid = (reps: number[]) => {
  return reps.every(rep => !isNaN(rep))
}

export const handleAddExerciseVerification = async (ctx: Context, userMessage: number) => {
  try {
    const userManager = new UserStateManager(ctx.from!.id)
    userManager.updateData({ kg: userMessage })
    userState[ctx.from!.id] = {
      ...userState[ctx.from!.id],
      kg: userMessage,
    }
    await ctx.deleteMessage()
    await addExerciseVeryficationMenu(bot, ctx)
    delete userState[ctx.from!.id]
  } catch (error) {
    console.error(`Error: `, error)
  }
}

export const verifyDayInput = (day: string) => {
  return verifyDay(day)
}
export const handleIncorrectDayInput = async (ctx: Context) => {
  await ctx.reply(INCORRECT_DAY_INPUT, {
    parse_mode: 'Markdown'
  })
}
export const handleIncorrectExerciseInput = async (ctx: Context) => {
  await ctx.reply(EXERCISE_NAME_OUTPUT_INVALID, {
    parse_mode: "Markdown"
  })
}
