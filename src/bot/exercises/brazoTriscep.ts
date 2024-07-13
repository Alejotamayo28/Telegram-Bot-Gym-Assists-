import { Context } from "telegraf";


export class Triscep {
  constructor(private ctx: Context) { }
  public async pressFrances() {
    return await this.ctx.reply(`Press frances`)
  }
  public async fondos() {
    return await this.ctx.reply(`Fondos`)
  }
  public async pushdowns() {
    return await this.ctx.reply(`Pushdownds`)
  }
  public async trasNuca() {
    return await this.ctx.reply(`Tras nuca`)
  }
}
