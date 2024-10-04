import { Context } from "telegraf"
import { deleteLastMessage, verifyDay } from "../utils"
import { UserStateManager, userState } from "../../../userState"
import { addExerciseVeryficationMenu } from "."
import { bot } from "../../bot"
import { EXERCISE_NAME_OUTPUT, EXERCISE_REPS_OUTPUT, EXERCISE_WEIGHT_OUTPUT, INCORRECT_DAY_INPUT } from "./messages"

export const verifyDayInput = (day: string) => {
  return verifyDay(day)
}

export const handleIncorrectDayInput = async (ctx: Context) => {
  ctx.reply(INCORRECT_DAY_INPUT, {
    parse_mode: 'MarkdownV2'
  })
}

export const handleAddExerciseDay = async (ctx: Context, userId: number, userMessage: string) => {
  await deleteLastMessage(ctx)
  if (!verifyDayInput(userMessage)) {
    await handleIncorrectDayInput(ctx)
    await ctx.deleteMessage()
    return
  }
  await ctx.deleteMessage()
  const userManager = new UserStateManager(userId)
  userManager.updateData({ day: userMessage }, 'menu_post_exercise_name')
  await ctx.reply(EXERCISE_NAME_OUTPUT, {
    parse_mode: "MarkdownV2"
  })
}

export const handleAddExerciseName = async (ctx: Context, userId: number, userMessage: string) => {
  await deleteLastMessage(ctx)
  const userManager = new UserStateManager(userId)
  userManager.updateData({ name: userMessage }, 'menu_post_exercise_reps')
  await ctx.deleteMessage()
  await ctx.reply(EXERCISE_REPS_OUTPUT, {
    parse_mode: "MarkdownV2"
  })
}

export const handleAddExerciseReps = async (ctx: Context, userId: number, userMessage: string) => {
  await deleteLastMessage(ctx)

  const userManager = new UserStateManager(userId)
  userManager.updateData({ reps: userMessage.split(" ").map(Number) }, 'menu_post_exercise_verification')
  await ctx.deleteMessage()
  await ctx.reply(EXERCISE_WEIGHT_OUTPUT, {
    parse_mode: "MarkdownV2"
  }
  )
}
export const handleAddExerciseVerification = async (ctx: Context, userId: number, userMessage: string) => {
  await deleteLastMessage(ctx)
  const userManager = new UserStateManager(userId)
  userManager.updateData({ kg: userMessage })
  userState[userId] = {
    ...userState[userId],
    kg: userMessage,
  }
  await ctx.deleteMessage()
  await addExerciseVeryficationMenu(bot, ctx)
  delete userState[userId]
}


