import { Context } from "telegraf";
import { deleteLastMessage } from "../utils";
import { UserStateManager } from "../../../userState";
import { deleteExerciseVerificationMenu } from ".";
import { bot } from "../../bot";
import { DELETE_EXERICISE_DAY } from "./messages";

export const handleDeleteExerciseDay = async (ctx: Context, userMessage: string) => {
  await deleteLastMessage(ctx)
  const userManager = new UserStateManager(ctx.from!.id)
  userManager.updateData({ day: userMessage.toLowerCase() }, 'menu_delete_exercise_name')
  await ctx.reply(DELETE_EXERICISE_DAY, {
    parse_mode: "Markdown"
  })
  await ctx.deleteMessage()
}

export const handleDeleteExerciseName = async (ctx: Context, userMessage: string) => {
  await deleteLastMessage(ctx)
  await ctx.deleteMessage()
  const userManager = new UserStateManager(ctx.from!.id)
  userManager.updateData({ name: userMessage.toLowerCase() })
  await deleteExerciseVerificationMenu(bot, ctx)
}
