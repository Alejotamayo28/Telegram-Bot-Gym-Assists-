import { Context, Telegraf } from "telegraf";
import { WorkoutFetchHandler } from "../workoutFetchHandler";
import { handleGetDailyExercisesGraphic } from "..";

export class ExerciseResultViewCallbackHandler {
  constructor(private ctx: Context) { }
  async textCallback(bot: Telegraf, userMessage: string) {
    return await WorkoutFetchHandler.getExerciseByDateAndUserId(
      this.ctx,
      userMessage,
      bot,
    );
  }
  async graphicCallback(bot: Telegraf, userMessage: string) {
    return await handleGetDailyExercisesGraphic(this.ctx, userMessage, bot);
  }
}
