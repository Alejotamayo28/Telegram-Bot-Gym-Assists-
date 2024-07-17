import { Context } from "telegraf";
import { bot } from "../../bot";
import { Espalda } from "../guideExercises/menus/menuEspalda";
import { EspaldaAlta } from "../guideExercises/exercises/espaldaAlta";
import { Dorsales } from "../guideExercises/exercises/espaldaDorsales";
import { Trapecios } from "../guideExercises/exercises/espaldaTrapecios";
import { Lumbar } from "../guideExercises/exercises/espaldaLumbar";


bot.action(`Espalda`, async (ctx: Context) => {
  await new Espalda(ctx).menu()
})
// Espalda alta 
bot.action(`espalda_alta`, async (ctx: Context) => {
  await new Espalda(ctx).alta()
})
bot.action(`alta_jalon_pecho`, async (ctx: Context) => {
  await new EspaldaAlta(ctx).jalonPecho()
})
bot.action(`dominadas`, async (ctx: Context) => {
  await new EspaldaAlta(ctx).dominadas()
})
// Dorsales
bot.action(`espalda_dorsales`, async (ctx: Context) => {
  await new Espalda(ctx).dorsales()
})
bot.action(`remo_mancuernas`, async (ctx: Context) => {
  await new Dorsales(ctx).remoMancuernas()
})
bot.action(`remo_maquina`, async (ctx: Context) => {
  await new Dorsales(ctx).remoMaquina()
})
bot.action(`remo_barra`, async (ctx: Context) => {
  await new Dorsales(ctx).remoBarra()
})
//TRAPECIOS
bot.action(`espalda_trapecios`, async (ctx: Context) => {
  await new Espalda(ctx).trapecios()
})
bot.action(`encogimiento_mancuernas`, async (ctx: Context) => {
  await new Trapecios(ctx).encogimientoMancuernas()
})
bot.action(`encogimiento_barra`, async (ctx: Context) => {
  await new Trapecios(ctx).encogiminetoBarra()
})
bot.action(`remo_menton`, async (ctx: Context) => {
  await new Trapecios(ctx).remoMenton()
})
//LUMBAR
bot.action(`espalda_lumbar`, async (ctx: Context) => {
  await new Espalda(ctx).lumbar()
})
bot.action(`peso_muerto`, async (ctx: Context) => {
  await new Lumbar(ctx).pesoMuerto()
})
bot.action(`hiperextensiones`, async (ctx: Context) => {
  await new Lumbar(ctx).hiperextensiones()
})
bot.action(`buenos_dias`, async (ctx: Context) => {
  await new Lumbar(ctx).buenosDias()
})
