import { Context, Telegraf } from "telegraf"
import { MAIN_MENU_MESSAGE } from "../messages/mainMenuMessage"
import { userState } from "../../userState"
import { sendMenuFunctions } from "../menus/userMenu"
import { menuPageGetExercises } from "../../bot/functions"
import { pool } from "../../database/database"
import { DELETE_EXERCISE_CALLBACK, EXERCISE_GUIDE_CALLBACK, GET_EXERCISE_DAY_CALLBACK, GET_EXERCISE_WEEK_CALLBACK, POST_EXERCISE_CALLBACK, SEMANAL_SPLIT_CALLBACK, UPDATE_EXERCISE_CALLBACK } from "./buttons"
import { inlineKeyboardMenu } from "./inlineKeyboard"
import { sendSplitMenu } from "../menus/splitMenu"
import { guideExercisesMenu } from "../menus/guide/body"

export const mainMenuPage = async (bot: Telegraf, ctx: Context) => {
  await ctx.reply(MAIN_MENU_MESSAGE, inlineKeyboardMenu)

  bot.action(POST_EXERCISE_CALLBACK, async (ctx: Context) => {
    await ctx.reply(`Por favor, digita el dia en el cual realizaste el ejercicio: `)
    userState[ctx.from!.id] = { stage: 'menu_post_exercise_day' }
  })

  bot.action(UPDATE_EXERCISE_CALLBACK, async (ctx: Context) => {
    await ctx.reply(`Por favooor, digita el dia en donde realizaste el ejercicio a actualizar`)
    userState[ctx.from!.id] = { stage: 'menu_put_exercise_day' }
  })

  bot.action(GET_EXERCISE_DAY_CALLBACK, async (ctx: Context) => {
    await ctx.reply(`Por favor, digita el dia para buscar tus ejercicios: `)
    userState[ctx.from!.id] = { stage: 'menu_get_weekly' }
  })

  bot.action(GET_EXERCISE_WEEK_CALLBACK, async (ctx: Context) => {
    await ctx.reply(await menuPageGetExercises(await pool.connect(), ctx.from!.id))
    await sendMenuFunctions(ctx)
  })

  bot.action(DELETE_EXERCISE_CALLBACK, async (ctx: Context) => {
    await ctx.reply(`Por , digita el dia en donde realizaste el ejercicio a eliminar`)
    userState[ctx.from!.id] = { stage: 'menu_delete_exercise_day' }
  })

  bot.action(EXERCISE_GUIDE_CALLBACK, async (ctx: Context) => {
    await guideExercisesMenu(ctx)
  })
  bot.action(SEMANAL_SPLIT_CALLBACK, async (ctx: Context) => {
    await sendSplitMenu(ctx)
  })
}
