import { Context, Telegraf } from "telegraf";
import { UserStateManager } from "../../../userState";
import { verifyDeleteExercise } from "../../../bot/functions";
import { inlineKeyboardVerifyDeleteExercise } from "./inlineKeyboard";
import { deleteExerciseByNameDay } from "./functions";
import { inlineKeyboardMenu } from "../../mainMenu/inlineKeyboard";

export const deleteExerciseVerificationMenu = async (bot: Telegraf, ctx: Context) => {
  const userManager = new UserStateManager(ctx.from!.id)
  const { name, day } = userManager.getUserData()
  await ctx.reply(verifyDeleteExercise({ name, day }),
    {
      parse_mode: 'MarkdownV2',
      ...inlineKeyboardVerifyDeleteExercise
    })
  bot.action(`eliminar_si`, async (ctx: Context) => {
    await deleteExerciseByNameDay(ctx, { name, day })
    ctx.reply(
      `*¡Ejercicio eliminado con éxito\\!* 🎉\n\n_¿Sigue explorando, qué te gustaría hacer ahora?_`,
      {
        parse_mode: 'MarkdownV2',
        ...inlineKeyboardMenu
      }
    )
  })
  bot.action(`eliminar_no`, async (ctx: Context) => {
    await ctx.reply(`*¡Ejercicio no eliminado\\!* 🤕\n\n_¿Sigue explorando, qué te gustaría hacer ahora?_`,
      {
        parse_mode: 'MarkdownV2',
        ...inlineKeyboardMenu
      })
  })
}
