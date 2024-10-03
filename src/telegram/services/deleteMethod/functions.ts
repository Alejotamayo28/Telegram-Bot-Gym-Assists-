import { Context } from "telegraf";
import { deleteLastMessage } from "../../../bot/functions";
import { UserStateManager } from "../../../userState";
import { userStateWorkout, workoutOutput } from "../../../model/workout";
import { pool } from "../../../database/database";
import { deleteExerciseVerificationMenu } from ".";
import { bot } from "../../bot";

export const handleDeleteExerciseDay = async (ctx: Context, userMessage: string) => {
  await deleteLastMessage(ctx)
  const userManager = new UserStateManager<userStateWorkout>(ctx.from!.id)
  userManager.updateData({ day: userMessage.toLowerCase() }, 'menu_delete_exercise_name')
  await ctx.reply(`Por favor, digita el nombre del ejercicio a eliminar: `)
  await ctx.deleteMessage()
}


export const handleDeleteExerciseName = async (ctx: Context, userMessage: string) => {
  await deleteLastMessage(ctx)
  await ctx.deleteMessage()
  const userManager = new UserStateManager<userStateWorkout>(ctx.from!.id)
  userManager.updateData({ name: userMessage.toLowerCase() })
  await deleteExerciseVerificationMenu(bot, ctx)
}
