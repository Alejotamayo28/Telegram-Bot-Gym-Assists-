import { Context, Telegraf } from "telegraf";
import { onTransaction } from "../../../../database/dataAccessLayer";
import { WorkoutQueryDelete } from "../../../../database/queries/exerciseQueries";
import { mainMenuPage } from "../../menus/mainMenuHandler";
import { botMessages } from "../../../messages";

export class ExerciseDeleteCallbackHandler {
  constructor(private ctx: Context) { }
  async handleYesCallback(bot: Telegraf) {
    try {
      await onTransaction(async (clientTransaction) => {
        await WorkoutQueryDelete.deleteExercise(this.ctx);
      });
      return await mainMenuPage(
        this.ctx,
        bot,
        botMessages.inputRequest.prompts.deleteMethod.successfull,
      );
    } catch (error) { }
  }
  async handleNoCallback(bot: Telegraf) {
    return await mainMenuPage(this.ctx, bot, botMessages.action.cancelled);
  }
}
