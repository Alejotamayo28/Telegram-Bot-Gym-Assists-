import { Context, Telegraf } from "telegraf";
import { deleteUserMessage, saveBotMessage, userStageDeleteExercise, userState, userStateUpdateDay, userStateUpdateMonth, userStateUpdateName, userStateUpdateStage, userStateUpdateWeek } from "../../../userState";
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
  static async exerciseMonth(ctx: Context, month: string): Promise<void> {
    await deleteUserMessage(ctx)
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.deleteMethod.exerciseDay)
    userStateUpdateMonth(ctx, month, userStageDeleteExercise.DELETE_EXERCISE_DAY)
  }

  static async exerciseDay(ctx: Context, day: string): Promise<void> {
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
    const exercise = await ExerciseQueryFetcher.ExerciseByNameDayWeekAndId(ctx.from!.id, userState[ctx.from!.id])
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
}




