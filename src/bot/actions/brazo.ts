import { Context } from "telegraf"
import { bot } from "../../bot"
import { Biscep } from "../guideExercises/exercises/brazoBiscep"
import { Hombro } from "../guideExercises/exercises/brazoHombro"
import { Triscep } from "../guideExercises/exercises/brazoTriscep"
import { Brazo } from "../guideExercises/menus/menuBrazo"

// BRAZO OPCIONES EJERCICIOS
bot.action(`Brazo`, async (ctx) => {
  await new Brazo(ctx).menu()
})
//BISCEP 
bot.action(`menuBrazo_biscep`, async (ctx) => {
  await new Brazo(ctx).biscep()
})
bot.action(`martillo`, async (ctx) => {
  await new Biscep(ctx).martillo()
})
bot.action(`predicador`, async (ctx) => {
  await new Biscep(ctx).predicador()
})
bot.action(`alternado`, async (ctx) => {
  await new Biscep(ctx).alternado()
})
bot.action(`inclinado`, async (ctx) => {
  await new Biscep(ctx).inclinado()
})
//Tricep
bot.action(`menuBrazo_triscep`, async (ctx) => {
  await new Brazo(ctx).triscep()
})
bot.action(`press_frances`, async (ctx) => {
  await new Triscep(ctx).pressFrances()
})
bot.action(`fondos`, async (ctx) => {
  await new Triscep(ctx).fondos()
})
bot.action(`pushdowns`, async (ctx) => {
  await new Triscep(ctx).pushdowns()
})
//HOMBRO
bot.action(`menuBrazo_hombro`, async (ctx) => {
  await new Brazo(ctx).hombro()
})
bot.action(`press_militar`, async (ctx) => {
  await new Hombro(ctx).pressMilitar()
})
bot.action(`vuelos_laterales`, async (ctx: Context) => {
  await new Hombro(ctx).vuelosLaterales()
})
bot.action(`peck_invertido`, async (ctx: Context) => {
  await new Hombro(ctx).peckDeckInvertido()
})
