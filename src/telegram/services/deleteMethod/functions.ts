import { Context, Telegraf } from "telegraf";
import { deleteUserMessage, saveBotMessage, userStageDeleteExercise, userState, userStateUpdateDay, userStateUpdateMonth, userStateUpdateName, userStateUpdateWeek } from "../../../userState";
import { parseInt, toNumber } from "lodash";
import { ExerciseQueryFetcher } from "../getMethod/queries";
import { deleteExerciseVerificationController } from ".";
import { botMessages } from "../../messages";
import { BotUtils } from "../singUp/functions";
import { ExerciseGetUtils } from "../getMethod/functions";
import { Exercise } from "../../../model/workout";
import { validateMonths } from "../../../validators/allowedValues";
import { getMultipartRequestOptions } from "openai/_shims";

export class ExerciseDeleteHandler {
  private static async handleDeleteExerciseError(ctx: Context, errorType: keyof typeof botMessages.inputRequest.prompts.getMethod.errors) {
    const errorMessage = botMessages.inputRequest.prompts.getMethod.errors[errorType]
    await BotUtils.sendBotMessage(ctx, errorMessage)
  }
  static async exerciseMonth(ctx: Context, month: string, bot: Telegraf): Promise<void> {
    //REWORKING
    await deleteUserMessage(ctx)
    userStateUpdateMonth(ctx, month)
  }
  static async exerciseDay(ctx: Context, day: string): Promise<void> {
    // SHOULD NOT ENTER HERE
    await deleteUserMessage(ctx)
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.deleteMethod.exerciseName)
    userStateUpdateDay(ctx, day, userStageDeleteExercise.DELETE_EXERCISE_NAME)
  }
  static async exerciseName(ctx: Context, name: string): Promise<void> {
    await deleteUserMessage(ctx)
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.deleteMethod.exerciseWeek)
    userStateUpdateName(ctx, name, userStageDeleteExercise.DELETE_EXERCISE_WEEK)
  }
  static async exerciseWeekAndConfirmation(ctx: Context, bot: Telegraf, week: string): Promise<void> {
    await deleteUserMessage(ctx)
    const weekNumber = parseInt(week)
    userStateUpdateWeek(ctx, weekNumber)
    const exercise = await ExerciseQueryFetcher.ExerciseByMonthDayWeekAndId(ctx.from!.id, userState[ctx.from!.id])
    if (!exercise) {
      await this.handleDeleteExerciseError(ctx, "exerciseNotFound")
      return
    }
    const message = await ctx.reply(ExerciseGetUtils.mapExerciseByNameDayWeekTESTING(exercise, ctx), {
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
        result += `     • _ID_: ${exercise.id}  |  _Reps_:  ${exercise.reps.join(', ')}  |  _Peso:_  ${exercise.kg}\n`
      })
    }
    return result.trim()
  }
}




