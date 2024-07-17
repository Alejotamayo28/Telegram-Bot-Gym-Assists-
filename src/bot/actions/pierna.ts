import { Context } from "telegraf";
import { bot } from "../../bot";
import { Pierna } from "../guideExercises/menus/menuPierna";
import { Cuadriceps } from "../guideExercises/exercises/piernaCuadriceps";
import { Gluteos } from "../guideExercises/exercises/piernaGluteos";
import { Femorales } from "../guideExercises/exercises/piernaFemorales";

bot.action(`Pierna`, async (ctx: Context) => {
  await new Pierna(ctx).menu()
})
//Cuadriceps
bot.action(`pierna_cuadriceps`, async (ctx: Context) => {
  await new Pierna(ctx).cuadriceps()
})
bot.action(`sentadilla`, async (ctx: Context) => {
  await new Cuadriceps(ctx).sentadilla()
})
bot.action(`extensiones`, async (ctx: Context) => {
  await new Cuadriceps(ctx).sentadilla()
})
bot.action(`prensa`, async (ctx: Context) => {
  await new Cuadriceps(ctx).sentadilla()
})
bot.action(`variantes`, async (ctx: Context) => {
  await new Cuadriceps(ctx).variantes()
})
//Gluteos
bot.action(`pierna_gluteo`, async (ctx: Context) => {
  await new Pierna(ctx).gluteos()
})
bot.action(`puente_gluteo`, async (ctx: Context) => {
  await new Gluteos(ctx).puenteGluteo()
})
bot.action(`patada`, async (ctx: Context) => {
  await new Gluteos(ctx).patada()
})
bot.action(`estocadas`, async (ctx: Context) => {
  await new Gluteos(ctx).estocadas()
})
// FEMORALES 
bot.action(`pierna_femorales`, async (ctx: Context) => {
  await new Pierna(ctx).femorales()
})
bot.action(`femoral_sentado`, async (ctx: Context) => {
  await new Femorales(ctx).curlSentado()
})
bot.action(`femoral_acostado`, async (ctx: Context) => {
  await new Femorales(ctx).curlAcostado()
})
bot.action(`peso_muerto_rumano`, async (ctx: Context) => {
  await new Femorales(ctx).pesoMuertoRumano()
})

