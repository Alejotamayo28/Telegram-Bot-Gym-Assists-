import { Context } from "telegraf"
import { Pecho } from "../../../services/guideExercises/menus/menuPecho"
import { Superior } from "../../../services/guideExercises/exercises/pechoSuperior"
import { Inferior } from "../../../services/guideExercises/exercises/pechoInferior"
import { Completo } from "../../../services/guideExercises/exercises/pechoEntero"
import { bot } from "../../../telegram/bot"

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
bot.action(`menuPecho_inferior`, async (ctx: Context) => {
  await new Pecho(ctx).inferior()
})
bot.action(`declinado_mancuernas`, async (ctx: Context) => {
  await new Inferior(ctx).declinadoMancuernas()
})
bot.action(`declinado_smith`, async (ctx: Context) => {
  await new Inferior(ctx).declinadoSmith()
})
bot.action(`decliando_barra`, async (ctx: Context) => {
  await new Inferior(ctx).declinadoBarra()
})
//PECHO COMPLETO
bot.action(`menuPecho_completo`, async (ctx: Context) => {
  await new Pecho(ctx).completo()
})
bot.action(`press_plano`, async (ctx: Context) => {
  await new Completo(ctx).planoBarra()
})
bot.action(`press_plano_mancuernas`, async (ctx: Context) => {
  await new Completo(ctx).planoMancuernas()
})
bot.action(`press_plano_maquina`, async (ctx: Context) => {
  await new Completo(ctx).planoMaquina()
})
