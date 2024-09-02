import { Context, Telegraf } from "telegraf";
import { workoutOutput } from "../../../model/workout";
import { verifyExerciseOutput } from "../../../bot/functions";
import { pool } from "../../../database/database";
import { inlineKeyboardMenu } from "../../mainMenu/inlineKeyboard";
import { inlineKeyboardVerifyExerciseUpdate } from "./inlineKeyboard";
import { VERIFY_EXERCISE_UPDATE_YES_CALLBACK } from "./buttons";

export const updateExerciseVeryficationMenu = async (bot: Telegraf, ctx: Context, workout: workoutOutput) => {
  const { day, name, reps, kg }: workoutOutput = workout
  await ctx.reply(verifyExerciseOutput({ day, name, reps, kg }),
    {
      parse_mode: 'MarkdownV2',
      ...inlineKeyboardVerifyExerciseUpdate
    })
  bot.action(VERIFY_EXERCISE_UPDATE_YES_CALLBACK, async (ctx: Context) => {
    await ctx.deleteMessage()
    await Promise.all([
      pool.query(`UPDATE workout SET  reps = $1, kg = $2 WHERE id = $3 AND day = $4 AND name = $5`,
        [reps, kg, ctx.from!.id, day, name]),
      ctx.reply(
        `*¡Ejercicio actualizado con éxito\\!* 🎉\n\n_¿Sigue explorando, qué te gustaría hacer ahora?_`,
        {
          parse_mode: 'MarkdownV2',
          ...inlineKeyboardMenu
        }
      )
    ])
  })
}
