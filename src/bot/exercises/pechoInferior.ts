import { Context, Markup } from "telegraf";

export class Inferior {
  constructor(private ctx: Context) { }
  public declinadoMancuernas() {
    return this.ctx.reply(`Declinado mancuernas`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
      ])
    )
  }
  public declinadoSmith() {
    return this.ctx.reply(`Declinado smith`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
      ])
    )
  }
  public declinadoBarra() {
    return this.ctx.reply(`Declinado barra`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
      ])
    )
  }
  public declinadoMaquina() {
    return this.ctx.reply(`Declinado maquina`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
      ])
    )
  }
  public declinadoPushUps() {
    return this.ctx.reply(`Push ups declinadas`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
      ])
    )
  }
}
