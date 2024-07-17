import { bot } from "../../bot"
import { menuPageGetExercises } from "../funtions"
import { pool } from "../../database/database"
import { userState } from "../../userState"
import { sendMenuOptions } from "./menu"

bot.action(`menu_post_exercise`, async (ctx) => {
    await ctx.reply(`Por favor, digita el dia en el cual realizas el  ejercicio `)
    userState[ctx.from.id] = { stage: 'menu_post_exercise_day' }
})
bot.action(`menu_put_exercise`, async (ctx) => {
    await ctx.reply(`Por favor, digita el dia en donde realizaste el ejercicio a actualizar `)
    userState[ctx.from.id] = { stage: 'menu_put_exercise_day' }
})
bot.action('menu_get_exercise_day', async (ctx) => {
    await ctx.reply(`Por favor, digita el dia para buscar tus ejercicios: `)
    userState[ctx.from.id] = { stage: 'menu_get_weekly' }
})
bot.action(`menu_get_exercise`, async (ctx) => {
    await ctx.reply(await menuPageGetExercises(await pool.connect(), ctx.from.id))
    await sendMenuOptions(ctx)
})
bot.action(`menu_delete_exercise`, async (ctx) => {
    await ctx.reply(`Por favor, digita el dia en donde realizaste el ejercicio a eliminar`)
    userState[ctx.from.id] = { stage: 'menu_delete_exercise_day' }
})