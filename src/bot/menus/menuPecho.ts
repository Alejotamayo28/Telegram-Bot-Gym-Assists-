import { Context, Markup } from "telegraf"

export class Pecho {
  constructor(private ctx: Context) { }
  public async menu() {
    return this.ctx.reply(`Por favor, esocge la parte especifica del pecho que deseas trabajar: \n`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`Pecho superior`, `menuPecho_superior`),
        Markup.button.callback(`Pecho inferior`, `menuPecho_inferior`)],
        [Markup.button.callback(`Pecho completo`, `menuPecho_completo`)]
      ])
    )
  }
  public async superior() {
    return await this.ctx.reply(
      `Aqui tienes algunos ejercicios para el Pecho superior que puedes realizar:`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`Inclinado mancuernas`, `inclinado_mancuernas`), Markup.button.callback(`Inclinado smith`, `inclinado_smith`)],
        [Markup.button.callback(`Inclinado barra`, `inclinado_barra`), Markup.button.callback(`Inclinado maquina`, `inclinado_maquina`)],
        [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
      ])
    )
  }
  public async completo() {
    return await this.ctx.reply(
      `Aqui tienes algunos ejercicios para el Pecho Completo que puedes realizar: `,
      Markup.inlineKeyboard([
        [Markup.button.callback(`Press plano`, `press_plano`), Markup.button.callback(`Press plano mancuernas`, `press_plano_mancuernas`)],
        [Markup.button.callback(`Press plano maquina`, `press_plano_maquina`)]
      ])
    )
  }
  public async inferior() {
    return await this.ctx.reply(
      `Aqui tienes algunos ejercicios para el Pecho superior que puedes realizar:`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`Inclinado mancuernas`, `inclinado_mancuernas`),
        Markup.button.callback(`Inclinado smith`, `inclinado_smith`)],
        [Markup.button.callback(`Inclinado barra`, `inclinado_barra`)],
        [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
      ])
    )
  }
}



