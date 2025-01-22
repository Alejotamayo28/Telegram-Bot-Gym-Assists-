import { Context } from "telegraf";
import { Exercise } from "../userState";
import { botMessages } from "../telegram/messages";
import { BotUtils } from "../utils/botUtils";

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
    let result = `*🗑️ Registro de ejercicios eliminados - Fecha ${date.toLocaleDateString()}*\n\n`;
    result += `_Ejercicios eliminados:_\n`;
    for (const name in groupedData) {
      // Inicia el bloque de código para el ejercicio actual
      result += `\n========================\n`;
      result += `📅 *${name.toUpperCase()}*\n`;
      // Encabezados de la tabla
      result += `ID       Reps           Peso (kg)\n`;
      // Datos del ejercicio
      groupedData[name].forEach((exercise: Exercise) => {
        result += `${exercise.id.toString().padEnd(8)} ${exercise.reps.join(", ").padEnd(12)} ${exercise.weight}\n`;
      });
      result += `\`\`\`\n`;
    }
    return result.trim();
  }
}
