import { Context } from "telegraf"
import { bot } from "../../../telegram/bot"
import { Biscep } from "../../../services/guideExercises/exercises/brazoBiscep"
import { Hombro } from "../../../services/guideExercises/exercises/brazoHombro"
import { Triscep } from "../../../services/guideExercises/exercises/brazoTriscep"
import { Brazo } from "../../../services/guideExercises/menus/menuBrazo"


// BRAZO OPCIONES EJERCICIOS
bot.action(`Brazo`, async (ctx: Context) => {
  await new Brazo(ctx).menu()
})
//BISCEP 
bot.action(`menuBrazo_biscep`, async (ctx: Context) => {
  await new Brazo(ctx).biscep()
})
bot.action(`martillo`, async (ctx: Context) => {
  await new Biscep(ctx).martillo()
})
bot.action(`predicador`, async (ctx: Context) => {
  await new Biscep(ctx).predicador()
})
bot.action(`alternado`, async (ctx: Context) => {
  await new Biscep(ctx).alternado()
})
bot.action(`inclinado`, async (ctx: Context) => {
  await new Biscep(ctx).inclinado()
})
//Tricep
bot.action(`menuBrazo_triscep`, async (ctx: Context) => {
  await new Brazo(ctx).triscep()
})
bot.action(`press_frances`, async (ctx: Context) => {
  await new Triscep(ctx).pressFrances()
})
bot.action(`fondos`, async (ctx: Context) => {
  await new Triscep(ctx).fondos()
})
bot.action(`pushdowns`, async (ctx: Context) => {
  await new Triscep(ctx).pushdowns()
})
//HOMBRO
bot.action(`menuBrazo_hombro`, async (ctx: Context) => {
  await new Brazo(ctx).hombro()
})
bot.action(`press_militar`, async (ctx: Context) => {
  await new Hombro(ctx).pressMilitar()
})
bot.action(`vuelos_laterales`, async (ctx: Context) => {
  await new Hombro(ctx).vuelosLaterales()
})
bot.action(`peck_invertido`, async (ctx: Context) => {
  await new Hombro(ctx).peckDeckInvertido()
})
