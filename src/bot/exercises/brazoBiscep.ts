import { Context } from "telegraf";


export class Biscep {
  constructor(private ctx: Context) { }
  public async martillo() {
    return await this.ctx.reply(`Curl martillo`)
  }
  public async predicador() {
    return await this.ctx.reply(`Curl predicador`)
  }
  public async alternado() {
    return await this.ctx.reply(`Curl alternado`)
  }
  public async inclinado() {
    return await this.ctx.reply(`Curl inclinado`)
  }
}
