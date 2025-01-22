import { Context, Telegraf } from "telegraf";
import { getUserCredentials } from "../../../../userState";
import { ClientQueryInsert } from "../../../../database/queries/clientQueries";
import { commandStart } from "../../../commands/start";

export class RegisterConfirmHandleCallback {
  constructor(private ctx: Context) { }
  async handleYesCallback(bot: Telegraf, passwordHash: string) {
    const { nickname, email } = getUserCredentials(this.ctx.from!.id);
    await ClientQueryInsert.insertClientCredentials(
      this.ctx.from!.id,
      { nickname, email },
      passwordHash,
    );
    return await commandStart(this.ctx, bot);
  }
  async handleNoCallback(bot: Telegraf) {
    return await commandStart(this.ctx, bot);
  }
}
