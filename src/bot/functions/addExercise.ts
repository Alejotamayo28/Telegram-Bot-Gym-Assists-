import { Context } from "telegraf"
import { deleteLastMessage, verifyDay } from "."
import { UserStateManager, userState } from "../../userState"
import { addExerciseVeryficationMenu } from "../../telegram/services/addMethod"
import { bot } from "../../telegram/bot"
import { userStateWorkout } from "../../model/workout"

export const verifyDayInput = (day: string) => {
  return verifyDay(day)
}

export const handleIncorrectDayInput = async (ctx: Context, userId: number) => {
  ctx.reply(`
*El día ingresado no es válido❌*
Por favor, asegúrate de escribirlo correctamente`, {
    parse_mode: 'MarkdownV2'
  })
}

export const handleAddExerciseDay = async (ctx: Context, userId: number, userMessage: string) => {
  await deleteLastMessage(ctx)
  if (!verifyDayInput(userMessage)) {
    await handleIncorrectDayInput(ctx, userId)
    await ctx.deleteMessage()
    return
  }
  await ctx.deleteMessage()
  const userManager = new UserStateManager<userStateWorkout>(userId)
  userManager.updateData({ day: userMessage }, 'menu_post_exercise_name')
  await ctx.reply(`Por favor, digita el nombre del ejercicio!`)
}

export const handleAddExerciseName = async (ctx: Context, userId: number, userMessage: string) => {
  await deleteLastMessage(ctx)
  const userManager = new UserStateManager<userStateWorkout>(userId)
  userManager.updateData({ name: userMessage }, 'menu_post_exercise_reps')
  await ctx.deleteMessage()
  await ctx.reply(`Por favor, digita la cantidad de repeticiones que realizaste.\n Ej: 10 10 10`)
}

export const handleAddExerciseReps = async (ctx: Context, userId: number, userMessage: string) => {
  await deleteLastMessage(ctx)

  const userManager = new UserStateManager<userStateWorkout>(userId)
  userManager.updateData({ reps: userMessage.split(" ").map(Number) }, 'menu_post_exercise_verification')
  await ctx.deleteMessage()
  await ctx.reply(`Por favor, digita el peso en kg con el cual realizaste el ejercicio`)
}

export const handleAddExerciseVerification = async (ctx: Context, userId: number, userMessage: string) => {
  await deleteLastMessage(ctx)
  const userManager = new UserStateManager<userStateWorkout>(userId)
  userManager.updateData({ kg: userMessage })
  userState[userId] = {
    ...userState[userId],
    kg: userMessage,
  }
  await ctx.deleteMessage()
  await addExerciseVeryficationMenu(bot, ctx)
  delete userState[userId]
}
