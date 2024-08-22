import { Context, Markup } from "telegraf"
import { bot } from "../../telegram/bot"
import { sendMenuFunctions } from "../../telegram/menus/userMenu"
import { guideExercisesMenu } from "../../telegram/menus/guide/body"

/*
bot.action(`menuExercises`, async (ctx: Context) => {
console.log(`est`)
  await guideExercisesMenu(ctx)
})
*/
bot.action(`menu_principal`, async (ctx: Context) => {
  await sendMenuFunctions(ctx)
})




