import { Context, Markup } from "telegraf";

export class Completo {
  constructor(private ctx: Context) { }
  public planoMancuernas() {
    return this.ctx.reply(`Press plano mancuernas`,
      Markup.inlineKeyboard([
        Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)
      ])
    )
  }
  public planoBarra() {
    return this.ctx.reply(`Press plano barra`,
      Markup.inlineKeyboard([
        Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)
      ])
    )
  }
  public planoMaquina() {
    return this.ctx.reply(`Press plano maquina`,
      Markup.inlineKeyboard([
        Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)
      ])
    )
  }
}
