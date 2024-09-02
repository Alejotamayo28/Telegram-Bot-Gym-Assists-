import { Context, Telegraf } from "telegraf";
import { workoutOutput } from "../../../model/workout";
import { verifyExerciseOutput } from "../../../bot/functions";
import { inlineKeyboardVerifyExercise } from "./inlineKeyboard";
import { VERIFY_EXERCISE_NO_CALLBACK, VERIFY_EXERCISE_YES_CALLBACK } from "./buttons";
import { pool } from "../../../database/database";
import { inlineKeyboardMenu } from "../../mainMenu/inlineKeyboard";

export const addExerciseVeryficationMenu = async (bot: Telegraf, ctx: Context, workout: workoutOutput) => {
  const { day, name, reps, kg }: workoutOutput = workout
  await ctx.reply(verifyExerciseOutput({ day, name, reps, kg }),
    {
      parse_mode: 'MarkdownV2',
      ...inlineKeyboardVerifyExercise
    })
  bot.action(VERIFY_EXERCISE_YES_CALLBACK, async (ctx: Context) => {
    await ctx.deleteMessage()
    await Promise.all([
      pool.query(
        `INSERT INTO workout(id, day, name, reps, kg) VALUES($1, $2, $3, $4, $5)`,
        [ctx.from!.id, day, name, reps, kg]),
      ctx.reply(
        `*¡Ejercicio creado con éxito\\!* 🎉\n\n_¿Sigue explorando, qué te gustaría hacer ahora?_`,
        {
          parse_mode: 'MarkdownV2',
          ...inlineKeyboardMenu
        }
      )
    ])
  })
  bot.action(VERIFY_EXERCISE_NO_CALLBACK, async (ctx) => {
    await ctx.deleteMessage()
    await ctx.reply(`*¡Ejercicio no creado\\!* 🤕\n\n_¿Sigue explorando, qué te gustaría hacer ahora?_`,
      {
        parse_mode: 'MarkdownV2',
        ...inlineKeyboardMenu
      })
  })
}
