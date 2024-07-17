import { Context, Markup } from "telegraf";

export class Pierna {
  constructor(private ctx: Context) { }
  public async menu() {
    return await this.ctx.reply(`Por favor escoge la parte especifica de la espalda que deseas trabajar: \n`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`Cuadriceps`, `pierna_cuadriceps`), Markup.button.callback(`Gluteos`, `pierna_gluteos`)],
        [Markup.button.callback(`Femorales`, `pierna_femorales`)],
      ])
    )
  }
  public async cuadriceps() {
    try {
      return await this.ctx.reply(`Aqui tienes algunos ejercicios para el cuadriceps que peudes realizar: `,
        Markup.inlineKeyboard([
          [Markup.button.callback(`Sentadilla`, `sentadilla`), Markup.button.callback(`Extensiones`, `extensiones`)],
          [Markup.button.callback(`Prensa`, `prensa`), Markup.button.callback(`Variantes`, `variantes`)],
          [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
        ]))
    } catch (e) {
      console.error(`Ha ocurrido un error en la clase Pierna().cuadriceps`, e)
    }
  }
  public async gluteos() {
    try {
      return await this.ctx.reply(`Aqui tienes algunos ejercicios para el cuadriceps que puedes utilizar: `,
        Markup.inlineKeyboard([
          [Markup.button.callback(`Sentadilla`, `sentadilla_gluteo`), Markup.button.callback(`Puente de gluteo`, `puente_gluteo`)],
          [Markup.button.callback(`Patada`, `patada`), Markup.button.callback(`Estocadas`, `estocadas`)],
          [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
        ]))
    } catch (e) {
      console.error(`Ha ocurrido un error en la clase Pierna().gluteos`, e)
    }
  }
  public async femorales() {
    try {
      return await this.ctx.reply(`Aqui tienes algunos ejercicios para los femorales que puedas utilizar: `,
        Markup.inlineKeyboard([
          [Markup.button.callback(`Curl sentado`, `femoral_sentado`), Markup.button.callback(`Curl acostado`, `femoral_acostado`)],
          [Markup.button.callback(`Peso muerto Rumano`, `peso_muerto_rumano`)],
          [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
        ]))
    } catch (e) {
      console.error(`Ha ocurrido un error en la clase Pierna().femorales`, e)
    }
  }
}
