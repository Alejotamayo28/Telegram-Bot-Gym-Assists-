import { Context } from "telegraf";

export class Superior {
  constructor(private ctx: Context) { }
  public async inclinadoMancuernas() {
    return await this.ctx.reply(`Inclinado mancuernas`)
  }
  public async inclinadoSmith() {
    return await this.ctx.reply(`Inclinado smith`)
  }
  public async inclinadoBarra() {
    return await this.ctx.reply(`Inclinado barra`)
  }
  public async inclinadoMaquina() {
    return await this.ctx.reply(`Inclinado maquina`)
  }
}
