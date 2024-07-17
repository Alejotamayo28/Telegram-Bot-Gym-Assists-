import { Context, Markup } from "telegraf";

export class Espalda {
  constructor(private ctx: Context) { }
  public async menu() {
    return await this.ctx.reply(`Por favor escoge la parte especifica de la espalda que deseas trabajar: \n`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`Espala alta`, `espalda_alta`), Markup.button.callback(`Dorsales`, `espalda_dorsales`)],
        [Markup.button.callback(`Trapecios`, `espalda_trapecios`), Markup.button.callback(`Lumbar`, `espalda_lumbar`)],
      ]))
  }
  public async alta() {
    try {
      return await this.ctx.reply(
        `Aqui tienes algunos ejercicios para la espalda alta que puedes realizar:
Codos creando 90 grados con tu torso.`,
        Markup.inlineKeyboard([
          [Markup.button.callback(`Jalon al pecho`, `alta_jalon_pecho`), Markup.button.callback(`Dominadas`, `dominadas`)],
          [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
        ]))
    } catch (e) {
      console.error(`Something went wrong at class Espalda(). alta`, e)
    }
  }
  public async dorsales() {
    return await this.ctx.reply(`Dorsales`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`Remo mancuerans`, `remo_mancuernas`), Markup.button.callback(`Remo maquina`, `remo_maquina`)],
        [Markup.button.callback(`Remo en barra`, `remo_barra`)],
        [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)],
      ])
    )
  }
  public async trapecios() {
    return await this.ctx.reply(`Trapecios`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`Encogimineto mancuernas`, `encogimiento_mancuernas`), Markup.button.callback(`Encogimiento barra`, `encogimiento_barra`)],
        [Markup.button.callback(`Remo al menton`, `remo_menton`)],
        [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)],
      ])
    )
  }
  public async lumbar() {
    return await this.ctx.reply(`Lumbar`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`Peso muerto`, `peso_muerto`), Markup.button.callback(`Hiperextensiones`, `hiperextensiones`)],
        [Markup.button.callback(`Buenos dias`, `buenos_dias`)],
        [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)],
      ])
    )
  }
}


