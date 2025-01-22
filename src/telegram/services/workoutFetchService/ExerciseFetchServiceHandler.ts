import { Context, Telegraf } from "telegraf";
import { deleteUserMessage, userState } from "../../../userState";
import { botMessages } from "../../messages";
import { mainMenuPage } from "../menus/mainMenuHandler/mainMenuController";
import { WorkoutQueryFetcher } from "../../../database/queries/exerciseQueries";
import { buildExerciseMapped } from "./ExerciseDataMapper";
import { dataLenghtEmpty } from "../../../utils/responseUtils";

export class WorkoutFetchHandler {
  private static async showMainMenu(ctx: Context, bot: Telegraf) {
    return await mainMenuPage(
      ctx,
      bot,
      botMessages.inputRequest.prompts.getMethod.succesfull,
    );
  }
  static async getExerciseByMonthAndUserId(
    ctx: Context,
    month: string,
    bot: Telegraf,
  ): Promise<void> {
    await deleteUserMessage(ctx);
    try {
      const exercise = await WorkoutQueryFetcher.getExerciseByMonthAndUserId(
        ctx.from!.id,
        month,
      );
      if (!exercise.length) return await dataLenghtEmpty(ctx, bot);
      await buildExerciseMapped.optiondBuild.returnExerciseByMonthAndUserIdOutput(
        { data: exercise, ctx: ctx, month: month },
      );
      return await this.showMainMenu(ctx, bot);
    } catch (error) {
      console.error(`Error: `, error);
    }
  }
  static async getExerciseByDateAndUserId(
    ctx: Context,
    day: string,
    bot: Telegraf,
  ): Promise<void> {
    await deleteUserMessage(ctx);
    try {
      const { month } = userState[ctx.from!.id];
      const exercise = await WorkoutQueryFetcher.getExerciseByMonthDayAndUserId(
        ctx.from!.id,
        day,
        month,
      );
      if (!exercise.length) return await dataLenghtEmpty(ctx, bot);
      await buildExerciseMapped.optiondBuild.returnExerciseByMonthAndUserIdOutput(
        { data: exercise, ctx: ctx, month: month, day: day },
      );
      return await this.showMainMenu(ctx, bot);
    } catch (error) {
      console.error(`Error: `, error);
    }
  }
  static async getAllTimeExercise(ctx: Context, bot: Telegraf): Promise<void> {
    await deleteUserMessage(ctx);
    try {
      const exercise = await WorkoutQueryFetcher.getExerciseByUserId(
        ctx.from!.id,
      );
      if (!exercise.length) return await dataLenghtEmpty(ctx, bot);
      await buildExerciseMapped.optiondBuild.returnExerciseAllTime({
        data: exercise,
        ctx: ctx,
      });
      return await this.showMainMenu(ctx, bot);
    } catch (error) {
      console.error(`Error: `, error);
    }
  }
}
