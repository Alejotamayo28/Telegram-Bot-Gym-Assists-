import { Context, Telegraf } from "telegraf";
import { botMessages } from "../../messages";
import { mainMenuPage } from "../../services/menus/mainMenuHandler/mainMenuController";
import { BotUtils } from "../../../utils/botUtils";
import { ExerciseDeleteFormatter } from "../../../data-formatter.ts/exercise-delete-formatter";
import { WorkoutQueryDelete } from "../../../database/queries/exerciseQueries";
import { BotStage, updateUserState } from "../../../userState";

export class ExerciseSelectionCallackHandler {
  constructor(private ctx: Context) { }
  async deleteMethod(bot: Telegraf, exercisesId: number[]) {
    updateUserState(this.ctx.from!.id, {
      data: {
        selectedExercises: {
          exercisesId: exercisesId,
        },
      },
    });
    const data = await WorkoutQueryDelete.deleteSelectedExercises(this.ctx);
    const mappedData = await ExerciseDeleteFormatter.formatExerciseData(
      this.ctx,
      data,
    );
    await BotUtils.sendBotMessage(this.ctx, mappedData);
    return await mainMenuPage(
      this.ctx,
      bot,
      botMessages.inputRequest.prompts.deleteMethod.successfull,
    );
  }
  async getMethod() { }
  async updateMethod(messagesId: number[], exercisesId: number[]) {
    updateUserState(this.ctx.from!.id, {
      stage: BotStage.Exercise.UPDATE_REPS,
      data: {
        message: {
          messageId: messagesId,
        },
        selectedExercises: {
          exercisesId: exercisesId,
        },
      },
    });
    await this.ctx.reply(
      `✏️ *Digita las nuevas repeticiones*\n\nPor favor, escribe las repeticiones que deseas asignar al ejercicio.\n\n📋 *Ejemplo:*\n\`\`\`10 10 10\`\`\` *(una repetición para cada serie)*\n\n✅ Asegúrate de separarlas con espacios`,
      {
        parse_mode: "Markdown",
      },
    );
  }
}
