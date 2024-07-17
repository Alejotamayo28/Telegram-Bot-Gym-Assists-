import { Context } from "telegraf";
import { bot } from "../../bot";
import { SplitWorkout, SplitWorkoutRecomendaciones } from "../splitWorkout";


bot.action(`splitWorkout`, async (ctx: Context) => {
  await new SplitWorkout(ctx).menu()
})
bot.action(`definicion`, async (ctx: Context) => {
  await new SplitWorkout(ctx).definicion()
})
bot.action(`recomendaciones`, async (ctx: Context) => {
  await new SplitWorkout(ctx).recomendaciones()
})
bot.action(`pushPullLegs`, async (ctx: Context) => {
  await new SplitWorkoutRecomendaciones(ctx).pushPullLegs()
})
bot.action(`fullBody`, async (ctx: Context) => {
  await new SplitWorkoutRecomendaciones(ctx).fullBody()
})
bot.action(`upperLower`, async (ctx: Context) => {
  await new SplitWorkoutRecomendaciones(ctx).upperLower()
})
bot.action(`arnoldsSplit`, async (ctx: Context) => {
  await new SplitWorkoutRecomendaciones(ctx).arnoldsSplit()
})
bot.action(`broSplit`, async (ctx: Context) => {
  await new SplitWorkoutRecomendaciones(ctx).broSplit()
})
