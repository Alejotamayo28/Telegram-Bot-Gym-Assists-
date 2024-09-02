import { Context } from "telegraf"
import { verifyDay } from "."
import { userState } from "../../userState"
import { addExerciseVeryficationMenu } from "../../telegram/services/addMethod"
import { bot } from "../../telegram/bot"

export const verifyDayInput = (day: string) => {
  return verifyDay(day)
}

export const handleIncorrectDayInput = async (ctx: Context, userId: number) => {
  ctx.reply(`Dia incorrecto, escribe el dia bien.`)
  userState[userId] = { ...userState[userId], stage: 'menu_post_exercise_day' }
}

export const handleAddExerciseDay = async (ctx: Context, userId: number, userMessage: string) => {
  ctx.deleteMessage(ctx.message!.message_id - 1)
  if (!verifyDayInput(userMessage)) {
    await handleIncorrectDayInput(ctx, userId)
    await ctx.deleteMessage()
    return
  }
  await ctx.deleteMessage()
  userState[userId] = {
    ...userState[userId], day: userMessage.toLowerCase(),
    stage: 'menu_post_exercise_name'
  }
  await ctx.reply(`Por favor, digita el nombre del ejercicio!`)
}

export const handleAddExerciseName = async (ctx: Context, userId: number, userMessage: string) => {
  await ctx.deleteMessage(ctx.message!.message_id - 1)
  userState[userId] = {
    ...userState[userId],
    name: userMessage,
    stage: 'menu_post_exercise_reps'
  }
  await ctx.deleteMessage()
  await ctx.reply(`Por favor, digita la cantidad de repeticiones que realizaste.\n Ej: 10 10 10`)
}

export const handleAddExerciseReps = async (ctx: Context, userId: number, userMessage: string) => {
  await ctx.deleteMessage(ctx.message!.message_id - 1)
  userState[userId] = {
    ...userState[userId],
    reps: userMessage.split(" ").map(Number),
    stage: 'menu_post_exercise_verification'
  }
  await ctx.deleteMessage()
  await ctx.reply(`Por favor, digita el peso en kg con el cual realizaste el ejercicio`)
}

export const handleAddExerciseVerification = async (ctx: Context, userId: number, userMessage: string) => {
  await ctx.deleteMessage(ctx.message!.message_id - 1)
  userState[userId] = {
    ...userState[userId],
    kg: userMessage,
  }
  await ctx.deleteMessage()
  await addExerciseVeryficationMenu(bot, ctx, userState[userId])
  delete userState[userId]
}
