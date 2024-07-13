import { Context } from "telegraf";

export class Hombro {
  constructor(private ctx: Context) { }
  public async pressMilitar() {
    return await this.ctx.reply(`Press militar`)
  }
  public async vuelosLaterales() {
    return await this.ctx.reply(`Vuelos laterales`)
  }
  public async peckDeckInvertido() {
    return await this.ctx.reply(`Peck deck invertido`)
  }

}
