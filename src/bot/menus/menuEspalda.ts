import { Context, Markup } from "telegraf";

export class Espalda {
  constructor(private ctx: Context) { }
  public async menu() {
    return this.ctx.reply(`Por favor escoge la parte especifica de la espalda que deseas trabajar: \n`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`Espala alta`, `espalda_alta`), Markup.button.callback(`Dorsales`, `espalda_dorsales`)],
        [Markup.button.callback(`Trapecios`, `espalda_trapecios`), Markup.button.callback(`Lumbar`, `espalda_lumbar`)],
        [Markup.button.callback(`Deltoides`, `espalda_deltoides`)]
      ]))
  }

