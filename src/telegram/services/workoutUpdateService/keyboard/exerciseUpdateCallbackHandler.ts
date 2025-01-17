import { Context, Telegraf } from "telegraf";
import { mainMenuPage } from "../../menus/mainMenuHandler";
import { onTransaction } from "../../../../database/dataAccessLayer";
import { workoutUpdateQuery } from "../../../../database/queries/exerciseQueries";
import { getUserExercise } from "../../../../userState";

export class ExerciseUpdateCallbacksHandler {
  constructor(private ctx: Context) { }
  async handleYesCallback(bot: Telegraf) {
    const workoutData = getUserExercise(this.ctx.from!.id);
    await onTransaction(async (clientTransaction) => {
      await workoutUpdateQuery(this.ctx, workoutData, clientTransaction);
    });
    return await mainMenuPage(this.ctx, bot, "");
  }
  async handleNoCallback(bot: Telegraf) {
    return await mainMenuPage(
      this.ctx,
      bot,
      `* Actualizacion cancelada * \n\n_La accion ha sido cancelada exitosamente._`,
    );
  }
}
