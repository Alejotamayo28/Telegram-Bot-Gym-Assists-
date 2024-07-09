import { Markup } from "telegraf"
import { bot } from "../.."


export const menuBrazo = async (ctx: any) => {
  return ctx.reply(`Por favor, escoge la parte especifica del brazo que deseas trabajar: \n`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Hombro`, `menuBrazo_hombro`), Markup.button.callback(`Biscep`, `menuBrazo_biscep`),
      Markup.button.callback(`Triscep`, `menuBrazo_triscep`)]
    ])
  )
}

export const menuBrazo_Biscep = async (ctx: any) => {
  return ctx.reply(
    `Aqui tienes algunos ejercicios para el biscep que puedes realizar:`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Curl martillo`, `curl_martillo`), Markup.button.callback(`Curl predicador`, `curl_predicador`)],
      [Markup.button.callback(`Curl alternado`, `curl_alternado`), Markup.button.callback(`Curl inclinado`, `curl_inclinado`)],
      [Markup.button.callback(`Menu ejercicios`, `menuExercise`), Markup.button.callback(`Menu principal`, `menu_principal`)],
    ])
  )
}

export const menuBrazo_Triscep = async (ctx: any) => {
  return ctx.reply(
    `Aqui tienes algunos ejercicios para el trisceps que puedes realizar:`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Press frances`, `press_frances`), Markup.button.callback(`Fondos`, `fondos`)],
      [Markup.button.callback(`Pushdowns`, `pushdowns`)],
    ])
  )
}
bot.action(`press_frances`, async (ctx) => {
  ctx.reply(`holaaa`)
})

export const menuBrazo_hombro = async (ctx: any) => {
  return ctx.reply(
    `Aqui tienes algunos ejercicios para el hombro que puedes realizar:`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Press militar`, `press_militar`), Markup.button.callback(`Vuelos laterales`, `vuelos_laterales`)],
      [Markup.button.callback(`Peck fly invertido`, `peck_fly_invertido`)]
    ])
  )
}
