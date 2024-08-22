import { Context, Markup } from "telegraf";

export class Brazo {
  static async menu(ctx: Context) {
    try {
      return await ctx.reply(`Por favor, escoge la parte especifica del brazo que deseas trabajar: \n`,
        Markup.inlineKeyboard([
          [Markup.button.callback(`Hombro`, `menuBrazo_hombro`),
          Markup.button.callback(`Biscep`, `menuBrazo_biscep`),
          Markup.button.callback(`Triscep`, `menuBrazo_triscep`)]
        ])
      )
    } catch (e) {
      console.error(e)
    }
  }
  static async biscep(ctx: Context) {
    try {
      return await ctx.reply(
        `Aqui tienes algunos ejercicios para el biscep que puedes realizar:`,
        Markup.inlineKeyboard([
          [Markup.button.callback(`Curl martillo`, `martillo`),
          Markup.button.callback(`Curl predicador`, `predicador`)],
          [Markup.button.callback(`Curl alternado`, `alternado`),
          Markup.button.callback(`Curl inclinado`, `inclinado`)],
          [Markup.button.callback(`Menu ejercicios`, `menuExercises`),
          Markup.button.callback(`Menu principal`, `menu_principal`)],
        ])
      )
    } catch (e) {
      console.error(`Something went wrong at class Brazo().biscep `, e)
    }
  }
  public async triscep(ctx: Context) {
    try {
      return await ctx.reply(
        `Aqui tienes algunos ejercicios para el trisceps que puedes realizar:`,
        Markup.inlineKeyboard([
          [Markup.button.callback(`Press frances`, `press_frances`),
          Markup.button.callback(`Fondos`, `fondos`)],
          [Markup.button.callback(`Pushdowns`, `pushdowns`)],
        ])
      )
    } catch (e) {
      console.error(`Something went wrong at class Brazo().triscep `, e)
    }
  }
  public async hombro(ctx: Context) {
    try {
      return await ctx.reply(
        `Aqui tienes algunos ejercicios para el hombro que puedes realizar:`,
        Markup.inlineKeyboard([
          [Markup.button.callback(`Press militar`, `press_militar`),
          Markup.button.callback(`Vuelos laterales`, `vuelos_laterales`)],
          [Markup.button.callback(`Peck fly invertido`, `peck_invertido`)]
        ])
      )
    } catch (e) {
      console.error(`Something went wrong at class Brazo().hombro `, e)
    }
  }
}

