import { Context } from "telegraf";
import { ExerciseFetchFormatter } from "../../../data-formatter.ts/exercise-fetch-formatter";
import { Exercise } from "../../../userState";
import { botMessages } from "../../messages";
import { BotUtils } from "../../../utils/botUtils";

interface ExerciseOptions {
  data?: Exercise[];
  ctx?: Context;
  month?: string;
  day?: string;
}

const exerciseMappedMethods = {
  returnExerciseByMonthAndUserIdOutput: "exerciseByMonthAndUserId",
  returnExerciseByDateAndUserId: "exerciseByDateAndUserId",
  returnExerciseAllTime: "exerciseAllTime",
};

export class buildExerciseMapped {
  private static ErrorHandler(
    error: Error,
    stage: keyof typeof exerciseMappedMethods,
  ): void {
    console.error({
      stage,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });
  }
  private static validateOptions(options: ExerciseOptions): void {
    if (!options.data || !options.ctx || (!options.month && !options.day)) {
      throw new Error("Missing required options: data, ctx, or month/day");
    }
  }
  static readonly optiondBuild: {
    [key in keyof typeof exerciseMappedMethods]: (
      options: Partial<ExerciseOptions>,
    ) => Promise<void>;
  } = {
      returnExerciseByMonthAndUserIdOutput: async function (
        options: ExerciseOptions,
      ): Promise<void> {
        try {
          const formattedOutput =
            ExerciseFetchFormatter.formatExerciseByNameAndWeek(options.data!);
          const formattedMonth = options.month!.toUpperCase();
          const date = new Date();
          return await BotUtils.sendBotMessage(
            options.ctx!,
            botMessages.inputRequest.prompts.getMethod.outPut.Monthly(
              formattedMonth,
              date,
              formattedOutput,
            ),
          );
        } catch (error) {
          if (error instanceof Error) {
            buildExerciseMapped.ErrorHandler(
              error,
              "returnExerciseByMonthAndUserIdOutput",
            );
          } else {
            console.error("Unknown Error :", error);
          }
        }
      },
      returnExerciseByDateAndUserId: async function (
        options: ExerciseOptions,
      ): Promise<void> {
        try {
          const formattedOutput =
            ExerciseFetchFormatter.formatExerciseByNameAndWeek(options.data!);
          const formattedDay = options.day!.toUpperCase();
          const date = new Date();
          return await BotUtils.sendBotMessage(
            options.ctx!,
            botMessages.inputRequest.prompts.getMethod.outPut.Daily(
              options.month!,
              formattedDay,
              date,
              formattedOutput,
            ),
          );
        } catch (error) {
          if (error instanceof Error) {
            buildExerciseMapped.ErrorHandler(
              error,
              "returnExerciseByMonthAndUserIdOutput",
            );
          } else {
            console.error("Unknown Error :", error);
          }
        }
      },
      returnExerciseAllTime: async function (
        options: ExerciseOptions,
      ): Promise<void> {
        try {
          const formattedExercises = ExerciseFetchFormatter.formatClientExercises(
            options.data!,
          );
          const date = new Date();
          await BotUtils.sendBotMessage(
            options.ctx!,
            botMessages.inputRequest.prompts.getMethod.outPut.Alltime(
              date,
              formattedExercises,
            ),
          );
        } catch (error) {
          if (error instanceof Error) {
            buildExerciseMapped.ErrorHandler(
              error,
              "returnExerciseByMonthAndUserIdOutput",
            );
          } else {
            console.error("Unknown Error: ", error);
          }
        }
      },
    };
}
