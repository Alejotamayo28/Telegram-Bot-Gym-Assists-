import { Context, Telegraf } from "telegraf";
import { botMessages } from "../../../messages";
import { mainMenuPage } from "../../menus/mainMenuHandler/mainMenuController";
import { WorkoutQueryInsert } from "../../../../database/queries/exerciseQueries";

export class PostVerifactionCallbackHandler {
  constructor(private ctx: Context) { }
  async handleYesCallback(bot: Telegraf) {
    await WorkoutQueryInsert.insertExerciseByUserId(this.ctx.from!.id);
    return await mainMenuPage(
      this.ctx,
      bot,
      botMessages.inputRequest.prompts.postMethod.successful,
    );
  }
  async handleNoCallback(bot: Telegraf) {
    return await mainMenuPage(
      this.ctx,
      bot,
      botMessages.inputRequest.prompts.postMethod.notSuccessful,
    );
  }
}
