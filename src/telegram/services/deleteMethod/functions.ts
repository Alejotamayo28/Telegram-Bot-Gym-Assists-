import { Context, Telegraf } from "telegraf";
import { deleteUserMessage, Exercise, saveBotMessage, updateUserState } from "../../../userState";
import { parseInt } from "lodash";
import { ExerciseQueryFetcher } from "../getMethod/queries";
import { deleteExerciseVerificationController } from ".";
import { botMessages } from "../../messages";
import { BotUtils } from "../singUp/functions";
import { ExerciseGetUtils } from "../getMethod/functions";

export class ExerciseDeleteHandler {
  private static async handleDeleteExerciseError(ctx: Context, errorType: keyof typeof botMessages.inputRequest.prompts.getMethod.errors) {
    const errorMessage = botMessages.inputRequest.prompts.getMethod.errors[errorType]
    await BotUtils.sendBotMessage(ctx, errorMessage)
  }
  static async exerciseWeekAndConfirmation(ctx: Context, bot: Telegraf, week: string): Promise<void> {
    await deleteUserMessage(ctx)
    const weekNumber = parseInt(week)
    updateUserState(ctx.from!.id, {
      data: {
        exercise: {
          week: weekNumber
        }
      }
    })
    const exercise = await ExerciseQueryFetcher.ExerciseByMonthDayWeekAndId(ctx.from!.id)
    if (!exercise) {
      await this.handleDeleteExerciseError(ctx, "exerciseNotFound")
      return
    }
    const message = await ctx.reply(ExerciseGetUtils.mapExerciseByNameDayWeekTESTING(exercise, ctx, "deleteMethod"), {
      parse_mode: "Markdown"
    })
    await saveBotMessage(ctx, message.message_id)
    await deleteExerciseVerificationController(ctx, bot)
  }
  static async getDeletedExercisesMap(ctx: Context, data: Exercise[]): Promise<string> {
    const groupedData: { [name: string]: Exercise[] } = {}
    data.forEach((exercise: Exercise) => {
      groupedData[exercise.name] ??= []
      groupedData[exercise.name].push(exercise)
    })
    const date = new Date()
    let result = `* Registro ejercicios - Fecha ${date.toLocaleDateString()}*\n\n_Ejercicios eliminados_: \n`
    for (const name in groupedData) {
      result += `\n========================\n📅 *${name.toUpperCase()}*
----------------------------------\n`
      groupedData[name].forEach((exercise: Exercise) => {
        result += `     • _ID_: ${exercise.id}  |  _Reps_:  ${exercise.reps.join(', ')}  |  _Peso:_  ${exercise.weight}\n`
      })
    }
    return result.trim()
  }
}




