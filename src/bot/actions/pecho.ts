import { Context } from "telegraf"
import { bot } from "../../bot"
import { Pecho } from "../guideExercises/menus/menuPecho"
import { Superior } from "../guideExercises/exercises/pechoSuperior"
import { Inferior } from "../guideExercises/exercises/pechoInferior"
import { Completo } from "../guideExercises/exercises/pechoEntero"

bot.action(`Pecho`, async (ctx: Context) => {
  await new Pecho(ctx).menu()
})
//PECHO SUPERIOR
bot.action(`menuPecho_superior`, async (ctx: Context) => {
  await new Pecho(ctx).superior()
})
bot.action(`inclinado_mancuernas`, async (ctx: Context) => {
  await new Superior(ctx).inclinadoMancuernas()
})
bot.action(`inclinado_smith`, async (ctx: Context) => {
  await new Superior(ctx).inclinadoSmith()
})
bot.action(`inclinado_barra`, async (ctx: Context) => {
  await new Superior(ctx).inclinadoBarra()
})
bot.action(`inclinado_maquina`, async (ctx: Context) => {
  await new Superior(ctx).inclinadoMaquina()
})
//PECHO INFERIOR
bot.action(`menuPecho_inferior`, async (ctx) => {
  await new Pecho(ctx).inferior()
})
bot.action(`declinado_mancuernas`, async (ctx) => {
  await new Inferior(ctx).declinadoMancuernas()
})
bot.action(`declinado_smith`, async (ctx) => {
  await new Inferior(ctx).declinadoSmith()
})
bot.action(`decliando_barra`, async (ctx) => {
  await new Inferior(ctx).declinadoBarra()
})
//PECHO COMPLETO
bot.action(`menuPecho_completo`, async (ctx) => {
  await new Pecho(ctx).completo()
})
bot.action(`press_plano`, async (ctx) => {
  await new Completo(ctx).planoBarra()
})
bot.action(`press_plano_mancuernas`, async (ctx) => {
  await new Completo(ctx).planoMancuernas()
})
bot.action(`press_plano_maquina`, async (ctx: Context) => {
  await new Completo(ctx).planoMaquina()
})
