import { Context } from "telegraf";
import { Exercise } from "../userState";
import { botMessages } from "../telegram/messages";
import { BotUtils } from "../telegram/services/clientSignUpService/functions";

export class ExerciseDeleteFormatter {
  private static async handleDeleteExerciseError(
    ctx: Context,
    errorType: keyof typeof botMessages.inputRequest.prompts.getMethod.errors,
  ) {
    const errorMessage =
      botMessages.inputRequest.prompts.getMethod.errors[errorType];
    await BotUtils.sendBotMessage(ctx, errorMessage);
  }
  static async formatExerciseData(
    ctx: Context,
    data: Exercise[],
  ): Promise<string> {
    const groupedData: { [name: string]: Exercise[] } = {};
    data.forEach((exercise: Exercise) => {
      groupedData[exercise.name] ??= [];
      groupedData[exercise.name].push(exercise);
    });
    const date = new Date();
    let result = `* Registro ejercicios - Fecha ${date.toLocaleDateString()}*\n\n_Ejercicios eliminados_: \n`;
    for (const name in groupedData) {
      result += `\n========================\n📅 *${name.toUpperCase()}*
----------------------------------\n`;
      groupedData[name].forEach((exercise: Exercise) => {
        result += `     • _ID_: ${exercise.id}  |  _Reps_:  ${exercise.reps.join(", ")}  |  _Peso:_  ${exercise.weight}\n`;
      });
    }
    return result.trim();
  }
}
